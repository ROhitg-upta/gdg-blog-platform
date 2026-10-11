import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import StoryReaderHeader from '../components/editorial/StoryReaderHeader';
import ArticleContentRenderer from '../components/editorial/ArticleContentRenderer';
import StoryArtworkRenderer from '../components/editorial/StoryArtworkRenderer';
import RelatedStories from '../components/editorial/RelatedStories';
import StoryUnavailable from '../components/editorial/StoryUnavailable';
import HighlightToolbar from '../components/editorial/HighlightToolbar';
import MarginNotesDrawer from '../components/editorial/MarginNotesDrawer';
import StoryReactions from '../components/editorial/StoryReactions';
import StoryResponses from '../components/editorial/StoryResponses';
import Avatar from '../components/ui/Avatar';
import { Toast, ToastContainer } from '../components/ui/Toast';
import { getStoryBySlug, getRelatedStories } from '../data/communityData';
import { useReader } from '../hooks/useReader';
import { useReaderPreferences } from '../hooks/useReaderPreferences';
import { getStoredNotes, saveHighlight } from '../utils/advancedStorage';

export default function StoryReaderPage({ slug, onNavigate }) {
  const {
    isBookmarked,
    toggleBookmark,
    isFollowing,
    followWriter,
    unfollowWriter,
    toasts,
    dismissToast,
    showToast,
    findStoryBySlug,
    getUnifiedRelatedStories,
    recordReadingProgress
  } = useReader();
  const { preferences, setTextSize, setReadingWidth, setLineSpacing, resetPreferences } = useReaderPreferences();

  // Find story by slug across unified collection
  const story = useMemo(() => {
    if (findStoryBySlug) {
      return findStoryBySlug(slug);
    }
    return getStoryBySlug(slug);
  }, [slug, findStoryBySlug]);

  // Notes drawer state
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [initialNoteQuote, setInitialNoteQuote] = useState('');
  const [notesCount, setNotesCount] = useState(0);

  // Update notes count when drawer opens/closes or story changes
  useEffect(() => {
    if (story) {
      setNotesCount(getStoredNotes(story.id).length);
    }
  }, [story, notesDrawerOpen]);

  // Related stories across unified collection
  const relatedStories = useMemo(() => {
    if (!story) return [];
    if (getUnifiedRelatedStories) {
      return getUnifiedRelatedStories(story.id, story.topic, story.authorId, 3);
    }
    return getRelatedStories(story.id, story.topic, story.authorId, 3);
  }, [story, getUnifiedRelatedStories]);

  // Scroll reading progress calculation
  const [scrollProgress, setScrollProgress] = useState(0);
  const articleRef = useRef(null);

  useEffect(() => {
    if (!story) return;

    const handleScroll = () => {
      const articleEl = articleRef.current;
      if (!articleEl) return;

      const rect = articleEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const articleHeight = rect.height;

      // Start calculating when top of article enters, complete when bottom reaches near viewport bottom
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      const articleTop = articleEl.offsetTop;
      const totalScrollable = articleHeight - windowHeight + 120;

      if (totalScrollable <= 0) {
        setScrollProgress(100);
        return;
      }

      const currentScroll = scrolled - articleTop;
      const percentage = Math.min(100, Math.max(0, (currentScroll / totalScrollable) * 100));
      setScrollProgress(percentage);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [story]);

  // Record reading progress in browser-local history
  useEffect(() => {
    if (!story || scrollProgress === 0) return;
    const timer = setTimeout(() => {
      recordReadingProgress?.(
        story.id,
        story.slug,
        story.title,
        story.author?.name || 'Quill Writer',
        scrollProgress
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [story, scrollProgress, recordReadingProgress]);

  // Scroll to top upon navigating to a new story
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // Handlers for reader superpowers
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleCopyMarkdown = useCallback(() => {
    if (!story) return;
    let md = `# ${story.title || 'Untitled'}\n\n`;
    if (story.subtitle || story.excerpt) {
      md += `*${story.subtitle || story.excerpt}*\n\n`;
    }
    md += `**Author:** ${story.author?.name || 'Reader'}  \n`;
    md += `**Published:** ${story.date || new Date().toLocaleDateString()}  \n`;
    md += `**Topic:** ${story.topic || 'General'}  \n\n---\n\n`;

    if (Array.isArray(story.content)) {
      story.content.forEach((block) => {
        if (typeof block === 'string') {
          md += `${block}\n\n`;
        } else if (block && block.type === 'heading') {
          md += `## ${block.text}\n\n`;
        } else if (block && block.type === 'quote') {
          md += `> “${block.text}”\n`;
          if (block.attribution) md += `> — *${block.attribution}*\n`;
          md += `\n`;
        } else if (block && block.type === 'list' && Array.isArray(block.items)) {
          block.items.forEach((item) => {
            md += `- ${item}\n`;
          });
          md += `\n`;
        } else if (block && block.type === 'paragraph') {
          md += `${block.text}\n\n`;
        }
      });
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(md)
        .then(() => {
          showToast('Article copied as Markdown.', 'success');
        })
        .catch(() => {
          showToast('Failed copying markdown to clipboard.', 'error');
        });
    }
  }, [story, showToast]);

  const handleHighlight = useCallback((text) => {
    if (!story) return;
    saveHighlight({ storyId: story.id, text, color: 'terracotta' });
    showToast('Quote highlighted and saved to your desk.', 'success');
  }, [story, showToast]);

  const handleAddNoteFromQuote = useCallback((text) => {
    setInitialNoteQuote(text);
    setNotesDrawerOpen(true);
  }, []);

  if (!story) {
    return (
      <div className="quill-app-shell" style={{ backgroundColor: 'var(--color-paper, #F8F5EE)', minHeight: '100vh' }}>
        <StoryReaderHeader
          story={null}
          progress={0}
          preferences={preferences}
          onTextSizeChange={setTextSize}
          onReadingWidthChange={setReadingWidth}
          onLineSpacingChange={setLineSpacing}
          onResetPreferences={resetPreferences}
          onNavigate={onNavigate}
        />
        <StoryUnavailable onNavigate={onNavigate} />
        <ToastContainer>
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => dismissToast(toast.id)} />
          ))}
        </ToastContainer>
      </div>
    );
  }

  const bookmarked = isBookmarked(story.id);
  const following = isFollowing(story.authorId);
  const authorName = story.author?.name || 'Quill Writer';

  const readingColumnWidth = preferences.readingWidth === 'spacious' ? '760px' : '680px';

  return (
    <div className="quill-app-shell" style={{ backgroundColor: 'var(--color-paper, #F8F5EE)', minHeight: '100vh' }}>
      {/* 1. Sticky Reader Header with Progress Bar */}
      <StoryReaderHeader
        story={story}
        progress={scrollProgress}
        preferences={preferences}
        notesCount={notesCount}
        onOpenNotes={() => setNotesDrawerOpen(true)}
        onPrint={handlePrint}
        onCopyMarkdown={handleCopyMarkdown}
        onTextSizeChange={setTextSize}
        onReadingWidthChange={setReadingWidth}
        onLineSpacingChange={setLineSpacing}
        onResetPreferences={resetPreferences}
        onNavigate={onNavigate}
      />

      {/* Floating Selection Toolbar */}
      <HighlightToolbar
        story={story}
        onHighlight={handleHighlight}
        onAddNoteFromQuote={handleAddNoteFromQuote}
        showToast={showToast}
      />

      {/* 2. Main Article Reading Room */}
      <main
        style={{
          width: '100%',
          maxWidth: 'var(--container-max-width)',
          margin: '0 auto',
          padding: 'var(--space-8) var(--gutter-desktop) var(--space-20) var(--gutter-desktop)'
        }}
      >
        <article
          ref={articleRef}
          style={{
            maxWidth: readingColumnWidth,
            margin: '0 auto',
            transition: 'max-width var(--transition-normal)'
          }}
        >
          {/* Masthead Topic */}
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <span
              className="quill-chip quill-chip-compact selected"
              style={{ cursor: 'default' }}
            >
              {story.topic}
            </span>
          </div>

          {/* Headline (One h1 per page) */}
          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(2.1rem, 4.5vw, 2.9rem)',
              lineHeight: '1.2',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-3)',
              fontWeight: 700,
              letterSpacing: 'var(--tracking-tight)'
            }}
          >
            {story.title}
          </h1>

          {/* Subtitle / Excerpt */}
          {story.subtitle && (
            <p
              className="text-body"
              style={{
                fontSize: '1.2rem',
                lineHeight: '1.5',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-6)',
                fontStyle: 'normal'
              }}
            >
              {story.subtitle}
            </p>
          )}

          {/* Author Byline Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 'var(--space-6)',
              borderBottom: '1px solid var(--color-border-subtle)',
              marginBottom: 'var(--space-8)',
              gap: 'var(--space-4)',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Avatar name={authorName} size="md" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {authorName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (following) unfollowWriter(story.authorId);
                      else followWriter(story.authorId);
                    }}
                    className={`quill-btn quill-btn-secondary ${following ? 'active' : ''}`}
                    style={{
                      padding: '0.15rem 0.65rem',
                      minHeight: '26px',
                      fontSize: '0.74rem',
                      borderColor: following ? 'var(--color-accent)' : 'var(--color-border)',
                      backgroundColor: following ? 'var(--color-accent-soft)' : 'transparent',
                      color: following ? 'var(--color-accent)' : 'var(--color-text-primary)'
                    }}
                  >
                    {following ? 'Following' : 'Follow'}
                  </button>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  <span>Published on {story.date}</span>
                  <span style={{ margin: '0 6px' }}>·</span>
                  <span>{story.readingTime}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button
                type="button"
                onClick={() => toggleBookmark(story.id, story.title)}
                className={`quill-btn quill-btn-secondary ${bookmarked ? 'active' : ''}`}
                style={{
                  padding: '0.35rem 0.85rem',
                  minHeight: '32px',
                  fontSize: '0.8rem',
                  borderColor: bookmarked ? 'var(--color-accent)' : 'var(--color-border)',
                  backgroundColor: bookmarked ? 'var(--color-accent-soft)' : 'var(--color-surface-card)',
                  color: bookmarked ? 'var(--color-accent)' : 'var(--color-text-primary)'
                }}
                aria-label={bookmarked ? `Remove ${story.title} from shelf` : `Save ${story.title} to shelf`}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill={bookmarked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span>{bookmarked ? 'Saved to shelf' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Cover Artwork Banner */}
          {story.artworkId && (
            <div
              style={{
                width: '100%',
                height: 'clamp(200px, 35vw, 320px)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: 'var(--space-10)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}
              aria-label={`Cover illustration: ${story.title}`}
            >
              <StoryArtworkRenderer artworkId={story.artworkId} />
            </div>
          )}

          {/* Article Essay Content */}
          <ArticleContentRenderer
            content={story.content || story.previewContent}
            textSize={preferences.textSize}
            lineSpacing={preferences.lineSpacing}
          />

          {/* 3. End-of-Story Author Mini-Card */}
          <div
            className="quill-surface-card"
            style={{
              marginTop: 'var(--space-12)',
              padding: 'var(--space-6)',
              backgroundColor: '#FFFDFA',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', minWidth: 0 }}>
              <Avatar name={authorName} size="lg" />
              <div>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: 600 }}>
                  Written by
                </span>
                <h3 className="font-serif text-h3" style={{ color: 'var(--color-text-primary)', margin: '2px 0 6px 0' }}>
                  {authorName}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', maxWidth: '440px', lineHeight: 1.45 }}>
                  {story.author?.bio || 'Independent contributor writing on craft and observation.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (following) unfollowWriter(story.authorId);
                else followWriter(story.authorId);
              }}
              className={`quill-btn quill-btn-secondary ${following ? 'active' : ''}`}
              style={{
                padding: '0.45rem 1rem',
                minHeight: '36px',
                fontSize: '0.82rem',
                borderColor: following ? 'var(--color-accent)' : 'var(--color-border)',
                backgroundColor: following ? 'var(--color-accent-soft)' : 'var(--color-surface-card)',
                color: following ? 'var(--color-accent)' : 'var(--color-text-primary)'
              }}
            >
              {following ? 'Following author' : `Follow ${authorName.split(' ')[0]}`}
            </button>
          </div>

          {/* Reader Contemplation Reactions */}
          <StoryReactions
            storyId={story.id}
            showToast={showToast}
          />

          {/* Reader Local Responses */}
          <StoryResponses
            storyId={story.id}
            showToast={showToast}
          />

          {/* 4. Related Stories ("Continue wandering") */}
          <RelatedStories
            stories={relatedStories}
            onNavigate={onNavigate}
          />
        </article>
      </main>

      {/* Private Margin Notes Drawer */}
      <MarginNotesDrawer
        isOpen={notesDrawerOpen}
        onClose={() => setNotesDrawerOpen(false)}
        storyId={story.id}
        storyTitle={story.title}
        initialQuote={initialNoteQuote}
        onClearInitialQuote={() => setInitialNoteQuote('')}
        showToast={showToast}
      />

      {/* Toast Feedback */}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </div>
  );
}
