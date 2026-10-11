import React, { useState, useEffect } from 'react';
import { getReadingHistory, removeReadingHistoryEntry, clearReadingHistory } from '../../utils/advancedStorage';
import ConfirmDialog from '../ui/ConfirmDialog';

export default function ReadingTrail({ onNavigate, showToast }) {
  const [history, setHistory] = useState([]);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const loadHistory = () => {
    setHistory(getReadingHistory());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRemoveEntry = (e, storyId) => {
    e.stopPropagation();
    removeReadingHistoryEntry(storyId);
    loadHistory();
    showToast?.('Entry removed from reading trail.', 'info');
  };

  const handleConfirmClear = () => {
    clearReadingHistory();
    loadHistory();
    setConfirmClearOpen(false);
    showToast?.('Reading trail cleared from this device.', 'info');
  };

  if (history.length === 0) {
    return (
      <div
        className="quill-surface-card"
        style={{
          padding: 'var(--space-5)',
          backgroundColor: '#FFFDFA',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: 600 }}>
          Your Reading Trail
        </span>
        <h4 className="font-serif" style={{ fontSize: '1.05rem', color: 'var(--color-text-primary)', margin: '2px 0 6px 0' }}>
          No reading trail yet
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.45, margin: 0 }}>
          As you read essays, your private progress will quietly appear here so you can retrace your steps.
        </p>
      </div>
    );
  }

  return (
    <div
      className="quill-surface-card"
      style={{
        padding: 'var(--space-5)',
        backgroundColor: '#FFFDFA',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <div>
          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: 600 }}>
            Personal Trail
          </span>
          <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--color-text-primary)', margin: '2px 0 0 0' }}>
            Your reading trail
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setConfirmClearOpen(true)}
          className="quill-btn-text"
          style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}
        >
          Clear trail
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {history.slice(0, 6).map((item) => {
          const dateStr = new Date(item.lastReadAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });

          return (
            <div
              key={item.storyId}
              onClick={() => item.slug && onNavigate && onNavigate(`/story/${item.slug}`)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                gap: 'var(--space-2)'
              }}
              title={`Read ${item.title}`}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {item.authorName} · {item.progress}% read · {dateStr}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleRemoveEntry(e, item.storyId)}
                className="quill-icon-btn quill-icon-btn-compact"
                aria-label={`Remove ${item.title} from reading trail`}
                title="Remove"
                style={{ flexShrink: 0 }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
          Reading trail stored privately in this browser
        </span>
      </div>

      <ConfirmDialog
        isOpen={confirmClearOpen}
        title="Clear reading trail?"
        message="This will remove your reading history log on this browser. Your bookmarks, drafts, and notes will remain intact."
        confirmLabel="Clear history"
        cancelLabel="Keep history"
        isDestructive={false}
        onConfirm={handleConfirmClear}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}
