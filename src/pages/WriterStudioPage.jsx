import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useReader } from '../hooks/useReader';
import {
  createEmptyStory,
  calculateReadingMetrics,
  validateStoryForPublish
} from '../utils/storyStorage';
import CoverArtworkPicker from '../components/writer/CoverArtworkPicker';
import BlockEditor from '../components/writer/BlockEditor';
import { Toast, ToastContainer } from '../components/ui/Toast';

const WRITING_TOPICS = [
  'Technology',
  'Design',
  'AI',
  'Personal Growth',
  'Culture',
  'Writing',
  'Science',
  'Philosophy'
];

export default function WriterStudioPage({ storyId = null, onNavigate }) {
  const {
    getUserStory,
    saveStory,
    publishStory,
    toasts,
    dismissToast,
    showToast
  } = useReader();

  // Load existing story or initialize a new draft
  const [story, setStory] = useState(() => {
    if (storyId) {
      const existing = getUserStory(storyId);
      if (existing) return existing;
    }
    return createEmptyStory();
  });

  const [notFound, setNotFound] = useState(() => {
    if (storyId && !getUserStory(storyId)) {
      return true;
    }
    return false;
  });

  // Save status: 'saved' | 'saving' | 'unsaved'
  const [saveStatus, setSaveStatus] = useState('saved');
  const [errors, setErrors] = useState({});
  const [isPublishing, setIsPublishing] = useState(false);

  // Debounce timer ref
  const autosaveTimerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Sync state if storyId prop changes
  useEffect(() => {
    if (storyId) {
      const existing = getUserStory(storyId);
      if (existing) {
        setStory(existing);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    }
  }, [storyId, getUserStory]);

  // Compute live reading metrics
  const metrics = useMemo(() => {
    return calculateReadingMetrics(
      story.title,
      story.excerpt || story.subtitle,
      story.content
    );
  }, [story.title, story.excerpt, story.subtitle, story.content]);

  // Checklist status
  const checklist = useMemo(() => {
    const hasTitle = Boolean(story.title && story.title.trim().length > 0);
    const hasExcerpt = Boolean((story.excerpt || story.subtitle) && (story.excerpt || story.subtitle).trim().length > 0);
    const hasTopic = Boolean(story.topic && story.topic.trim().length > 0);
    const hasCover = Boolean(story.artworkId && story.artworkId.trim().length > 0);
    const hasContent = Boolean(
      Array.isArray(story.content) &&
      story.content.some((b) => {
        if (typeof b === 'string') return b.trim().length > 0;
        if (b.type === 'paragraph' || b.type === 'heading' || b.type === 'quote') {
          return b.text && b.text.trim().length > 0;
        }
        if (b.type === 'list') {
          return Array.isArray(b.items) && b.items.some((i) => i && i.trim().length > 0);
        }
        return false;
      })
    );

    return {
      hasTitle,
      hasExcerpt,
      hasTopic,
      hasCover,
      hasContent,
      isComplete: hasTitle && hasExcerpt && hasTopic && hasCover && hasContent
    };
  }, [story]);

  // Save story to local storage helper
  const performSave = useCallback((storyToSave) => {
    setSaveStatus('saving');
    try {
      const saved = saveStory(storyToSave);
      if (saved) {
        setSaveStatus('saved');
      }
    } catch (err) {
      console.warn('Autosave error:', err);
      setSaveStatus('unsaved');
    }
  }, [saveStory]);

  // Autosave trigger on story edits
  const updateStoryFields = useCallback((fieldUpdates) => {
    setStory((prev) => {
      const updated = {
        ...prev,
        ...fieldUpdates
      };

      setSaveStatus('unsaved');

      // Clear inline errors for updated fields
      setErrors((prevErrors) => {
        const next = { ...prevErrors };
        Object.keys(fieldUpdates).forEach((k) => delete next[k]);
        return next;
      });

      // Debounce autosave
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }

      // Check if story has any meaningful input before autosaving blank stories
      const hasMeaningfulInput =
        (updated.title && updated.title.trim().length > 0) ||
        (updated.excerpt && updated.excerpt.trim().length > 0) ||
        (Array.isArray(updated.content) && updated.content.some((b) => b && b.text && b.text.trim().length > 0));

      if (hasMeaningfulInput || storyId) {
        autosaveTimerRef.current = setTimeout(() => {
          performSave(updated);
        }, 850);
      }

      return updated;
    });
  }, [performSave, storyId]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);

  // Warning before unload if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (saveStatus === 'unsaved') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  // Manual save draft handler
  const handleManualSave = () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    performSave(story);
    showToast('Draft saved locally.', 'info');
  };

  // Publish handler
  const handlePublish = () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    // Save current draft first
    performSave(story);

    setIsPublishing(true);
    const result = publishStory(story.id);

    if (result.success) {
      setIsPublishing(false);
      onNavigate(`/story/${result.story.slug}`);
    } else {
      setIsPublishing(false);
      setErrors(result.errors || {});
      showToast('Please address the highlighted fields to publish.', 'warning');

      // Scroll to first invalid field if present
      if (result.errors.title) {
        document.getElementById('studio-story-title')?.focus();
      } else if (result.errors.excerpt) {
        document.getElementById('studio-story-excerpt')?.focus();
      }
    }
  };

  if (notFound) {
    return (
      <div className="quill-app-shell" style={{ backgroundColor: 'var(--color-paper, #F8F5EE)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: 'var(--space-4) var(--space-8)', borderBottom: '1px solid var(--color-border)', backgroundColor: '#FFFDFA' }}>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
            className="brand-wordmark"
            style={{ fontSize: '1.75rem' }}
          >
            quill<span className="brand-dot">.</span>
          </a>
        </header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-12) var(--space-4)', textAlign: 'center' }}>
          <h1 className="font-serif text-h2" style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            Story draft not found
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '460px', marginBottom: 'var(--space-6)' }}>
            This story was not found in your browser’s local storage. It may have been removed or created on another device.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              type="button"
              onClick={() => onNavigate('/my-stories')}
              className="quill-btn quill-btn-secondary"
            >
              Back to My Stories
            </button>
            <button
              type="button"
              onClick={() => {
                const fresh = createEmptyStory();
                setStory(fresh);
                setNotFound(false);
                onNavigate('/write');
              }}
              className="quill-btn quill-btn-primary"
            >
              Start a New Story
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPublished = story.status === 'published';

  return (
    <div
      className="quill-writer-studio"
      style={{
        backgroundColor: 'var(--color-paper, #F8F5EE)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. Sticky Writing Desk Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#FFFDFA',
          borderBottom: '1px solid var(--color-border, #DDD4C7)',
          padding: '0 var(--gutter-desktop, 2rem)',
          height: 'var(--header-height, 68px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)'
        }}
      >
        {/* Left: Brand & Return Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="brand-wordmark"
            aria-label="quill. — Return to landing page"
            style={{ fontSize: '1.65rem' }}
          >
            quill<span className="brand-dot">.</span>
          </a>

          <div style={{ height: '18px', width: '1px', backgroundColor: 'var(--color-border)' }} />

          <button
            type="button"
            onClick={() => onNavigate('/my-stories')}
            className="quill-btn quill-btn-ghost"
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.65rem' }}
          >
            ← My stories
          </button>
        </div>

        {/* Center: Honest Local Save Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }} aria-live="polite">
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor:
                saveStatus === 'saved'
                  ? 'var(--color-success, #3E8A54)'
                  : saveStatus === 'saving'
                  ? 'var(--color-warning, #C7771B)'
                  : 'var(--color-accent, #D85A35)',
              boxShadow: saveStatus === 'saving' ? '0 0 6px rgba(199, 119, 27, 0.6)' : 'none',
              transition: 'background-color var(--transition-fast)'
            }}
          />
          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            {saveStatus === 'saved' && 'Saved locally'}
            {saveStatus === 'saving' && 'Saving locally…'}
            {saveStatus === 'unsaved' && 'Unsaved changes'}
          </span>
        </div>

        {/* Right: Studio Actions (Save Draft, Preview, Publish) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            type="button"
            onClick={handleManualSave}
            className="quill-btn quill-btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', minHeight: '38px' }}
          >
            Save draft
          </button>

          <button
            type="button"
            onClick={() => {
              performSave(story);
              onNavigate(`/write/${story.id}/preview`);
            }}
            className="quill-btn quill-btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', minHeight: '38px' }}
          >
            Preview
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="quill-btn quill-btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 1.25rem', minHeight: '38px' }}
          >
            {isPublishing ? 'Publishing…' : isPublished ? 'Save & Update' : 'Publish story'}
          </button>
        </div>
      </header>

      {/* 2. Main Studio Canvas & Side Panel */}
      <div
        className="quill-studio-grid"
        style={{
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto',
          padding: 'var(--space-8) var(--gutter-desktop, 2rem) var(--space-16) var(--gutter-desktop, 2rem)'
        }}
      >
        {/* Main Writing Canvas */}
        <main
          className="quill-writing-canvas"
          style={{
            backgroundColor: '#FFFDFA',
            borderRadius: 'var(--radius-lg, 16px)',
            border: '1px solid var(--color-border, #DDD4C7)',
            padding: 'var(--space-8) var(--space-8) var(--space-10) var(--space-8)',
            boxShadow: '0 2px 12px rgba(30, 28, 26, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)'
          }}
        >
          {/* Story Title */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
              <label
                htmlFor="studio-story-title"
                style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                Story Title *
              </label>
              <span style={{ fontSize: '0.78rem', color: (story.title || '').length > 110 ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                {(story.title || '').length}/120
              </span>
            </div>

            <input
              id="studio-story-title"
              type="text"
              value={story.title || ''}
              onChange={(e) => updateStoryFields({ title: e.target.value.slice(0, 120) })}
              placeholder="Give your story a title..."
              className="quill-input font-serif"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'studio-title-error' : undefined}
              style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                padding: 'var(--space-3) var(--space-4)',
                lineHeight: 1.3
              }}
            />
            {errors.title && (
              <p id="studio-title-error" role="alert" style={{ color: 'var(--color-error)', fontSize: '0.82rem', marginTop: 'var(--space-1)' }}>
                {errors.title}
              </p>
            )}
          </div>

          {/* Subtitle / Excerpt */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
              <label
                htmlFor="studio-story-excerpt"
                style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                Subtitle & Excerpt *
              </label>
              <span style={{ fontSize: '0.78rem', color: (story.excerpt || story.subtitle || '').length > 220 ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                {(story.excerpt || story.subtitle || '').length}/240
              </span>
            </div>

            <textarea
              id="studio-story-excerpt"
              value={story.excerpt || story.subtitle || ''}
              onChange={(e) => {
                const val = e.target.value.slice(0, 240);
                updateStoryFields({ excerpt: val, subtitle: val });
              }}
              placeholder="A short thought to invite readers in..."
              rows={2}
              className="quill-textarea"
              aria-invalid={Boolean(errors.excerpt)}
              aria-describedby={errors.excerpt ? 'studio-excerpt-error' : undefined}
              style={{ fontSize: '1rem', lineHeight: 1.5 }}
            />
            {errors.excerpt && (
              <p id="studio-excerpt-error" role="alert" style={{ color: 'var(--color-error)', fontSize: '0.82rem', marginTop: 'var(--space-1)' }}>
                {errors.excerpt}
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle, #EDE7DD)' }} />

          {/* Topic Selection */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 'var(--space-2)'
              }}
            >
              Select Topic *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {WRITING_TOPICS.map((topic) => {
                const isSelected = story.topic === topic;
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => updateStoryFields({ topic })}
                    className={`quill-chip quill-chip-standard ${isSelected ? 'selected' : ''}`}
                    aria-pressed={isSelected}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
            {errors.topic && (
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.82rem', marginTop: 'var(--space-1)' }}>
                {errors.topic}
              </p>
            )}
          </div>

          {/* Cover Artwork Chooser */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 'var(--space-2)'
              }}
            >
              Cover Artwork *
            </label>
            <CoverArtworkPicker
              selectedArtworkId={story.artworkId || 'portal'}
              onSelectArtwork={(artworkId) => updateStoryFields({ artworkId, coverVariant: artworkId })}
            />
            {errors.artworkId && (
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.82rem', marginTop: 'var(--space-1)' }}>
                {errors.artworkId}
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle, #EDE7DD)' }} />

          {/* Structured Body Editor */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 'var(--space-3)'
              }}
            >
              Story Body Blocks *
            </label>
            <BlockEditor
              blocks={story.content || []}
              onChange={(newBlocks) => updateStoryFields({ content: newBlocks })}
              error={errors.content}
            />
          </div>

          {/* Studio Footer Stats */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--color-border-subtle, #EDE7DD)',
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
              flexWrap: 'wrap',
              gap: 'var(--space-2)'
            }}
          >
            <span>
              {metrics.wordCount} words · ~{metrics.readingTime} min read
            </span>
            <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>
              Saved locally on this device. No cloud sync.
            </span>
          </div>
        </main>

        {/* Quiet Side Panel (Checklist & Editorial Tips) */}
        <aside
          className="quill-studio-aside"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
            position: 'sticky',
            top: 'calc(var(--header-height, 68px) + var(--space-4))'
          }}
        >
          {/* Story Completeness Checklist */}
          <div
            style={{
              backgroundColor: '#FFFDFA',
              border: '1px solid var(--color-border, #DDD4C7)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              boxShadow: '0 1px 4px rgba(30, 28, 26, 0.03)'
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--space-3)'
              }}
            >
              Story Checklist
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.85rem' }}>
                <span style={{ color: checklist.hasTitle ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                  {checklist.hasTitle ? '✓' : '○'}
                </span>
                <span style={{ color: checklist.hasTitle ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  Title defined
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.85rem' }}>
                <span style={{ color: checklist.hasExcerpt ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                  {checklist.hasExcerpt ? '✓' : '○'}
                </span>
                <span style={{ color: checklist.hasExcerpt ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  Excerpt summary
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.85rem' }}>
                <span style={{ color: checklist.hasTopic ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                  {checklist.hasTopic ? '✓' : '○'}
                </span>
                <span style={{ color: checklist.hasTopic ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  Topic selected
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.85rem' }}>
                <span style={{ color: checklist.hasCover ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                  {checklist.hasCover ? '✓' : '○'}
                </span>
                <span style={{ color: checklist.hasCover ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  Artwork chosen
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.85rem' }}>
                <span style={{ color: checklist.hasContent ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                  {checklist.hasContent ? '✓' : '○'}
                </span>
                <span style={{ color: checklist.hasContent ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  Body content
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Writing Tips */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-secondary, #F0EBE2)',
              border: '1px solid var(--color-border, #DDD4C7)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)'
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--color-accent, #D85A35)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--space-2)'
              }}
            >
              Writing Guidance
            </span>
            <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
              <li style={{ marginBottom: 'var(--space-2)' }}>Focus on one core thought or observation.</li>
              <li style={{ marginBottom: 'var(--space-2)' }}>Use pull quotes to anchor key insights.</li>
              <li>Break reflections into bite-sized paragraphs.</li>
            </ul>
          </div>
        </aside>
      </div>

      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </ToastContainer>
    </div>
  );
}
