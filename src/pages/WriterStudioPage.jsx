import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useReader } from '../hooks/useReader';
import {
  createEmptyStory,
  calculateReadingMetrics,
  validateStoryForPublish
} from '../utils/storyStorage';
import CoverArtworkPicker from '../components/writer/CoverArtworkPicker';
import BlockEditor from '../components/writer/BlockEditor';
import WriterOutlineDrawer from '../components/writer/WriterOutlineDrawer';
import VersionHistoryModal from '../components/writer/VersionHistoryModal';
import WritingGoalWidget from '../components/writer/WritingGoalWidget';
import { createStorySnapshot } from '../utils/advancedStorage';
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
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const fileInputRef = useRef(null);

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

  // Non-judgmental checklist status
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
    const hasHeading = Boolean(
      Array.isArray(story.content) &&
      story.content.some((b) => b && b.type === 'heading' && b.text && b.text.trim().length > 0)
    );

    const items = [hasTitle, hasExcerpt, hasTopic, hasCover, hasContent, hasHeading];
    const completedCount = items.filter(Boolean).length;

    return {
      hasTitle,
      hasExcerpt,
      hasTopic,
      hasCover,
      hasContent,
      hasHeading,
      completedCount,
      totalCount: 6,
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
    createStorySnapshot(story, 'Manual save snapshot');
    showToast('Draft and snapshot saved locally.', 'info');
  };

  // Restore snapshot handler
  const handleRestoreVersion = (snapshot) => {
    if (!snapshot) return;
    const restoredUpdates = {
      title: snapshot.title || '',
      subtitle: snapshot.subtitle || '',
      excerpt: snapshot.subtitle || '',
      content: Array.isArray(snapshot.content) ? snapshot.content : [],
      topic: snapshot.topic || 'Writing',
      artworkId: snapshot.artworkId || 'portal'
    };
    updateStoryFields(restoredUpdates);
    performSave({ ...story, ...restoredUpdates });
  };

  // Outline handlers
  const handleAddHeadingBlock = () => {
    const newBlock = { type: 'heading', text: 'New Section' };
    const content = Array.isArray(story.content) ? [...story.content, newBlock] : [newBlock];
    updateStoryFields({ content });
    showToast('Section heading added.', 'info');
  };

  const handleScrollToBlock = (index) => {
    const el = document.querySelectorAll('.quill-block-item')[index];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Export handlers
  const handleExportMarkdown = () => {
    let md = `# ${story.title || 'Untitled'}\n\n`;
    if (story.excerpt || story.subtitle) {
      md += `*${story.excerpt || story.subtitle}*\n\n`;
    }
    md += `**Topic:** ${story.topic || 'Writing'}  \n`;
    md += `**Date:** ${new Date().toLocaleDateString()}  \n\n---\n\n`;

    if (Array.isArray(story.content)) {
      story.content.forEach((b) => {
        if (typeof b === 'string') {
          md += `${b}\n\n`;
        } else if (b && b.type === 'heading') {
          md += `## ${b.text}\n\n`;
        } else if (b && b.type === 'quote') {
          md += `> “${b.text}”\n`;
          if (b.attribution) md += `> — ${b.attribution}\n`;
          md += `\n`;
        } else if (b && b.type === 'list' && Array.isArray(b.items)) {
          b.items.forEach((item) => {
            md += `- ${item}\n`;
          });
          md += `\n`;
        } else if (b && b.type === 'paragraph') {
          md += `${b.text}\n\n`;
        }
      });
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.slug || 'story-draft'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Draft exported as Markdown file.', 'success');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(story, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.slug || 'story-draft'}-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Draft exported as JSON backup.', 'success');
  };

  // Import Markdown file handler
  const handleImportMarkdown = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      showToast('Please select a .md or .txt Markdown file.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') return;

        const lines = text.split(/\r?\n/);
        const parsedBlocks = [];
        let detectedTitle = '';
        let detectedSubtitle = '';
        let currentPara = [];

        const flushPara = () => {
          if (currentPara.length > 0) {
            parsedBlocks.push({
              type: 'paragraph',
              text: currentPara.join(' ').trim()
            });
            currentPara = [];
          }
        };

        lines.forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed) {
            flushPara();
            return;
          }

          if (trimmed.startsWith('# ') && !detectedTitle) {
            flushPara();
            detectedTitle = trimmed.replace(/^#\s*/, '').trim();
          } else if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            flushPara();
            parsedBlocks.push({
              type: 'heading',
              text: trimmed.replace(/^#+\s*/, '').trim()
            });
          } else if (trimmed.startsWith('> ')) {
            flushPara();
            parsedBlocks.push({
              type: 'quote',
              text: trimmed.replace(/^>\s*/, '').replace(/^[“"']|[”"']$/g, '').trim(),
              attribution: ''
            });
          } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            flushPara();
            parsedBlocks.push({
              type: 'list',
              items: [trimmed.replace(/^[-*]\s*/, '').trim()]
            });
          } else {
            currentPara.push(trimmed);
          }
        });
        flushPara();

        const updates = {};
        if (detectedTitle && !story.title) {
          updates.title = detectedTitle;
        }
        if (parsedBlocks.length > 0) {
          updates.content = parsedBlocks;
        }

        updateStoryFields(updates);
        performSave({ ...story, ...updates });
        showToast('Imported Markdown into story draft.', 'success');
      } catch (err) {
        console.warn('Import error:', err);
        showToast('Unable to parse Markdown file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Publish handler with auto-snapshot
  const handlePublish = () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    // Save current draft and take snapshot
    performSave(story);
    createStorySnapshot(story, 'Auto snapshot before publishing');

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

        {/* Right: Studio Actions (Save Draft, Preview, Outline, History, Export/Import, Publish) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {/* Hidden Markdown file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportMarkdown}
            accept=".md,.txt"
            style={{ display: 'none' }}
          />

          {/* Outline Button */}
          <button
            type="button"
            onClick={() => setOutlineOpen(true)}
            className="quill-btn quill-btn-ghost"
            title="Document Outline"
            aria-label="Document Outline"
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem', minHeight: '36px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <span>Outline</span>
          </button>

          {/* History Button */}
          <button
            type="button"
            onClick={() => setVersionModalOpen(true)}
            className="quill-btn quill-btn-ghost"
            title="Version Snapshots"
            aria-label="Version Snapshots"
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem', minHeight: '36px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>History</span>
          </button>

          {/* Markdown / JSON Export / Import buttons */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="quill-btn quill-btn-ghost"
            title="Import Markdown (.md)"
            aria-label="Import Markdown"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', minHeight: '36px' }}
          >
            Import .md
          </button>

          <button
            type="button"
            onClick={handleExportMarkdown}
            className="quill-btn quill-btn-ghost"
            title="Export Markdown (.md)"
            aria-label="Export Markdown"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', minHeight: '36px' }}
          >
            Export .md
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="quill-btn quill-btn-ghost"
            title="Export JSON backup"
            aria-label="Export JSON"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', minHeight: '36px' }}
          >
            Export .json
          </button>

          <div style={{ height: '18px', width: '1px', backgroundColor: 'var(--color-border)', margin: '0 0.15rem' }} />

          <button
            type="button"
            onClick={handleManualSave}
            className="quill-btn quill-btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem', minHeight: '36px' }}
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
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem', minHeight: '36px' }}
          >
            Preview
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="quill-btn quill-btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 1.25rem', minHeight: '36px' }}
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

        {/* Quiet Side Panel (Checklist, Goal & Editorial Tips) */}
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
          {/* Writing Session Goal */}
          <WritingGoalWidget currentWordCount={metrics.wordCount} />

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Story Checklist
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: checklist.completedCount === checklist.totalCount ? 'var(--color-success, #3E8A54)' : 'var(--color-accent, #D85A35)'
                }}
              >
                {checklist.completedCount}/{checklist.totalCount}
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', lineHeight: 1.4 }}>
              Your draft is taking shape ({checklist.completedCount}/{checklist.totalCount} items complete)
            </p>

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

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.85rem' }}>
                <span style={{ color: checklist.hasHeading ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                  {checklist.hasHeading ? '✓' : '○'}
                </span>
                <span style={{ color: checklist.hasHeading ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  Section heading
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

      {/* Document Outline Drawer */}
      <WriterOutlineDrawer
        isOpen={outlineOpen}
        onClose={() => setOutlineOpen(false)}
        title={story.title}
        blocks={story.content || []}
        onSelectBlock={handleScrollToBlock}
        onAddHeading={handleAddHeadingBlock}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={versionModalOpen}
        onClose={() => setVersionModalOpen(false)}
        story={story}
        onRestoreVersion={handleRestoreVersion}
        showToast={showToast}
      />

      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </ToastContainer>
    </div>
  );
}
