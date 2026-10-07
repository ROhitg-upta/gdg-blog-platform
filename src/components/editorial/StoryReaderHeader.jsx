import React, { useState } from 'react';
import { useReader } from '../../hooks/useReader';
import ReaderSettingsPopover from './ReaderSettingsPopover';

export default function StoryReaderHeader({
  story,
  progress = 0,
  preferences,
  onTextSizeChange,
  onReadingWidthChange,
  onLineSpacingChange,
  onResetPreferences,
  onNavigate
}) {
  const { isBookmarked, toggleBookmark, showToast } = useReader();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const bookmarked = story ? isBookmarked(story.id) : false;

  const handleShare = async () => {
    if (!story) return;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: story.title,
      text: `${story.title} by ${story.author?.name || 'Quill Writer'}`,
      url: shareUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        showToast('Story link shared successfully.', 'success');
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Fall back to clipboard if share was denied
          copyToClipboard(shareUrl);
        }
        return;
      }
    }

    copyToClipboard(shareUrl);
  };

  const copyToClipboard = (url) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          showToast('Link copied to clipboard.', 'success');
        })
        .catch(() => {
          showToast('Unable to copy link to clipboard.', 'error');
        });
    } else {
      showToast('Clipboard access not supported in this browser.', 'error');
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#FFFDFA',
        borderBottom: '1px solid var(--color-border)',
        width: '100%'
      }}
    >
      {/* Top Reading Progress Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '2.5px',
          backgroundColor: 'transparent',
          overflow: 'hidden'
        }}
        aria-hidden="true"
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, Math.max(0, progress))}%`,
            backgroundColor: 'var(--color-accent)',
            transition: 'width 80ms linear'
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 'var(--container-max-width)',
          margin: '0 auto',
          padding: '0 var(--gutter-desktop)',
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)'
        }}
      >
        {/* Left: Wordmark & Back Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="brand-wordmark"
            aria-label="quill. — Return to landing page"
            style={{ fontSize: '1.55rem' }}
          >
            quill<span className="brand-dot">.</span>
          </a>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--color-border)' }} aria-hidden="true" />

          <button
            type="button"
            onClick={() => onNavigate('/community')}
            className="quill-btn-text"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              padding: '0.2rem 0.4rem'
            }}
            aria-label="Back to community feed"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to community</span>
          </button>
        </div>

        {/* Center: Truncated Title Preview on medium+ screens */}
        {story && (
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              color: 'var(--color-text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '380px',
              display: 'none'
            }}
            className="reader-header-title-preview"
          >
            {story.title}
          </div>
        )}

        {/* Right: Controls (Bookmark, Share, Typography Settings) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {/* Bookmark Toggle */}
          {story && (
            <button
              type="button"
              onClick={() => toggleBookmark(story.id, story.title)}
              className="quill-icon-btn quill-icon-btn-compact"
              aria-label={bookmarked ? `Remove ${story.title} from bookmarks` : `Save ${story.title} to shelf`}
              style={{
                color: bookmarked ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                backgroundColor: bookmarked ? 'var(--color-accent-soft)' : 'transparent'
              }}
              title={bookmarked ? 'Saved to reading shelf' : 'Save to reading shelf'}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={bookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          )}

          {/* Share Action */}
          {story && (
            <button
              type="button"
              onClick={handleShare}
              className="quill-icon-btn quill-icon-btn-compact"
              aria-label={`Share ${story.title}`}
              title="Share story link"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          )}

          {/* Reader Typography Settings Toggle */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="quill-icon-btn quill-icon-btn-compact"
              aria-label="Reader text size and display preferences"
              aria-expanded={settingsOpen}
              title="Display preferences"
              style={{
                backgroundColor: settingsOpen ? 'var(--color-surface-hover)' : 'transparent',
                color: settingsOpen ? 'var(--color-accent)' : 'var(--color-text-secondary)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>

            {/* Desktop Popover */}
            <ReaderSettingsPopover
              isOpen={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              preferences={preferences}
              onTextSizeChange={onTextSizeChange}
              onReadingWidthChange={onReadingWidthChange}
              onLineSpacingChange={onLineSpacingChange}
              onReset={onResetPreferences}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
