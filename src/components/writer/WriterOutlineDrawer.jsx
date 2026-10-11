import React from 'react';

export default function WriterOutlineDrawer({
  isOpen,
  onClose,
  storyTitle,
  blocks = [],
  onAddHeadingBlock,
  onScrollToBlock
}) {
  if (!isOpen) return null;

  // Extract headings from blocks
  const headings = [];
  if (Array.isArray(blocks)) {
    blocks.forEach((block, index) => {
      if (block && block.type === 'heading' && block.text && block.text.trim()) {
        headings.push({
          index,
          text: block.text.trim()
        });
      }
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Document outline"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(30, 28, 26, 0.35)',
        animation: 'fadeIn var(--transition-fast)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="quill-surface-card"
        style={{
          width: '100%',
          maxWidth: '340px',
          height: '100%',
          backgroundColor: '#FFFDFA',
          borderRight: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInLeft var(--transition-normal)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-5)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-surface-secondary)'
          }}
        >
          <div>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: 600 }}>
              Structure
            </span>
            <h2 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', margin: '2px 0 0 0' }}>
              Document Outline
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="quill-icon-btn quill-icon-btn-compact"
            aria-label="Close outline"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Outline Content */}
        <div style={{ flex: 1, padding: 'var(--space-5)', overflowY: 'auto' }}>
          {/* Document Title Root */}
          <div
            style={{
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-surface-secondary)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-4)',
              borderLeft: '3px solid var(--color-accent)'
            }}
          >
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>
              Title
            </span>
            <div className="font-serif" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>
              {storyTitle || 'Untitled Story'}
            </div>
          </div>

          {headings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-2)' }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.45, margin: '0 0 var(--space-4) 0' }}>
                No section headings added yet. Add section headings to organize your essay into clear chapters.
              </p>
              {onAddHeadingBlock && (
                <button
                  type="button"
                  onClick={() => {
                    onAddHeadingBlock();
                    onClose();
                  }}
                  className="quill-btn quill-btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
                >
                  + Add section heading
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                Headings ({headings.length})
              </span>
              {headings.map((h, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (onScrollToBlock) onScrollToBlock(h.index);
                    onClose();
                  }}
                  className="quill-sidebar-nav-item"
                  style={{
                    fontSize: '0.88rem',
                    padding: '0.45rem 0.65rem',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-xs)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}
                >
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                    {i + 1}.
                  </span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.text}
                  </span>
                </button>
              ))}

              {onAddHeadingBlock && (
                <button
                  type="button"
                  onClick={() => {
                    onAddHeadingBlock();
                    onClose();
                  }}
                  className="quill-btn-text"
                  style={{ fontSize: '0.82rem', color: 'var(--color-accent)', marginTop: 'var(--space-3)', textAlign: 'left' }}
                >
                  + Add new heading
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
