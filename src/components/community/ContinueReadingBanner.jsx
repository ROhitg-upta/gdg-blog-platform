import React, { useState, useEffect } from 'react';
import { getMostRecentIncompleteStory, removeReadingHistoryEntry } from '../../utils/advancedStorage';

export default function ContinueReadingBanner({ onNavigate, readingHistoryUpdated }) {
  const [recentStory, setRecentStory] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const incomplete = getMostRecentIncompleteStory();
    setRecentStory(incomplete);
    setDismissed(false);
  }, [readingHistoryUpdated]);

  if (!recentStory || dismissed) return null;

  const handleResume = () => {
    if (recentStory.slug && onNavigate) {
      onNavigate(`/story/${recentStory.slug}`);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div
      className="quill-surface-card"
      style={{
        padding: 'var(--space-4) var(--space-5)',
        backgroundColor: 'var(--color-surface-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-3)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
        {/* Circular progress or mini bar */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '2px solid var(--color-border)',
            borderTopColor: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--color-accent)',
            flexShrink: 0
          }}
          aria-hidden="true"
        >
          {recentStory.progress}%
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: 600 }}>
              Continue Reading
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              · {recentStory.authorName}
            </span>
          </div>
          <div
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '420px'
            }}
          >
            {recentStory.title}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <button
          type="button"
          onClick={handleResume}
          className="quill-btn quill-btn-primary"
          style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', minHeight: '30px' }}
        >
          Resume reading →
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="quill-icon-btn quill-icon-btn-compact"
          aria-label="Dismiss continue reading prompt"
          title="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
