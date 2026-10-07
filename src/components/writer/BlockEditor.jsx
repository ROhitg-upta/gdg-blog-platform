import React from 'react';

/**
 * BlockEditor:
 * Lightweight, structured block-based composition editor for Quill stories.
 * Employs zero dangerouslySetInnerHTML injection and guarantees keyboard accessibility.
 */
export default function BlockEditor({
  blocks = [],
  onChange,
  error = null
}) {
  const handleUpdateBlock = (index, updatedFields) => {
    const next = [...blocks];
    next[index] = { ...next[index], ...updatedFields };
    onChange(next);
  };

  const handleRemoveBlock = (index) => {
    const next = blocks.filter((_, i) => i !== index);
    onChange(next);
  };

  const handleMoveBlock = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const next = [...blocks];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
  };

  const handleInsertBlock = (index, type = 'paragraph') => {
    const newBlock = createDefaultBlock(type);
    const next = [...blocks];
    next.splice(index + 1, 0, newBlock);
    onChange(next);
  };

  const handleAppendBlock = (type) => {
    const newBlock = createDefaultBlock(type);
    onChange([...blocks, newBlock]);
  };

  function createDefaultBlock(type) {
    switch (type) {
      case 'heading':
        return { type: 'heading', text: '' };
      case 'quote':
        return { type: 'quote', text: '', attribution: '' };
      case 'list':
        return { type: 'list', items: [''] };
      case 'paragraph':
      default:
        return { type: 'paragraph', text: '' };
    }
  }

  return (
    <div className="quill-block-editor" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Editor Block List */}
      {blocks.length === 0 ? (
        <div
          style={{
            padding: 'var(--space-8) var(--space-4)',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface-secondary, #F0EBE2)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--color-border-strong, #CBBEAE)'
          }}
        >
          <p
            className="font-serif"
            style={{
              fontSize: '1.15rem',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-4)'
            }}
          >
            What has been on your mind lately?
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
            Choose a block below to begin drafting your story.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleAppendBlock('paragraph')}
              className="quill-btn quill-btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', minHeight: '36px' }}
            >
              + Add paragraph
            </button>
            <button
              type="button"
              onClick={() => handleAppendBlock('heading')}
              className="quill-btn quill-btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', minHeight: '36px' }}
            >
              + Add heading
            </button>
            <button
              type="button"
              onClick={() => handleAppendBlock('quote')}
              className="quill-btn quill-btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', minHeight: '36px' }}
            >
              + Add pull quote
            </button>
            <button
              type="button"
              onClick={() => handleAppendBlock('list')}
              className="quill-btn quill-btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', minHeight: '36px' }}
            >
              + Add bullet list
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {blocks.map((block, index) => {
            const isFirst = index === 0;
            const isLast = index === blocks.length - 1;

            return (
              <div
                key={index}
                className="quill-editor-block"
                style={{
                  backgroundColor: 'var(--color-surface-card, #FFFDFA)',
                  border: '1px solid var(--color-border, #DDD4C7)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  position: 'relative',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                {/* Block Header Toolbar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-3)',
                    paddingBottom: 'var(--space-2)',
                    borderBottom: '1px solid var(--color-border-subtle, #EDE7DD)'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--color-accent, #D85A35)'
                    }}
                  >
                    {block.type === 'heading' && 'Section Heading'}
                    {block.type === 'quote' && 'Pull Quote'}
                    {block.type === 'list' && 'Bulleted List'}
                    {block.type === 'paragraph' && 'Paragraph'} #{index + 1}
                  </span>

                  {/* Reorder and Delete Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleMoveBlock(index, 'up')}
                      aria-label={`Move ${block.type} ${index + 1} up`}
                      title="Move up"
                      style={{
                        minWidth: '32px',
                        minHeight: '32px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px 8px',
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: isFirst ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                        cursor: isFirst ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleMoveBlock(index, 'down')}
                      aria-label={`Move ${block.type} ${index + 1} down`}
                      title="Move down"
                      style={{
                        minWidth: '32px',
                        minHeight: '32px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px 8px',
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: isLast ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                        cursor: isLast ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(index)}
                      aria-label={`Remove ${block.type} ${index + 1}`}
                      title="Remove block"
                      style={{
                        minWidth: '32px',
                        minHeight: '32px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px 8px',
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-error, #C94236)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        marginLeft: 'var(--space-2)'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Block Content Inputs */}
                {block.type === 'heading' && (
                  <div>
                    <input
                      type="text"
                      value={block.text || ''}
                      onChange={(e) => handleUpdateBlock(index, { text: e.target.value })}
                      placeholder="Section heading..."
                      className="quill-input font-serif"
                      aria-label={`Heading ${index + 1} text`}
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        padding: 'var(--space-2) var(--space-3)'
                      }}
                    />
                  </div>
                )}

                {block.type === 'quote' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <textarea
                      value={block.text || ''}
                      onChange={(e) => handleUpdateBlock(index, { text: e.target.value })}
                      placeholder="Insert notable quote or memorable excerpt..."
                      className="quill-textarea font-serif"
                      aria-label={`Quote ${index + 1} text`}
                      rows={3}
                      style={{ fontStyle: 'italic', fontSize: '1.05rem' }}
                    />
                    <input
                      type="text"
                      value={block.attribution || ''}
                      onChange={(e) => handleUpdateBlock(index, { attribution: e.target.value })}
                      placeholder="Attribution / speaker (optional)"
                      className="quill-input"
                      aria-label={`Quote ${index + 1} attribution`}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                )}

                {block.type === 'list' && (
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: '4px'
                      }}
                    >
                      Enter bullet points (one line per item):
                    </label>
                    <textarea
                      value={Array.isArray(block.items) ? block.items.join('\n') : ''}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n');
                        handleUpdateBlock(index, { items: lines });
                      }}
                      placeholder="First key takeaway&#10;Second observation&#10;Third essential thought"
                      className="quill-textarea"
                      aria-label={`List ${index + 1} items`}
                      rows={4}
                      style={{ lineHeight: 1.6 }}
                    />
                  </div>
                )}

                {block.type === 'paragraph' && (
                  <div>
                    <textarea
                      value={block.text || ''}
                      onChange={(e) => handleUpdateBlock(index, { text: e.target.value })}
                      placeholder="Write your paragraph here..."
                      className="quill-textarea"
                      aria-label={`Paragraph ${index + 1} text`}
                      rows={5}
                      style={{
                        fontSize: '1rem',
                        lineHeight: 1.75
                      }}
                    />
                  </div>
                )}

                {/* Quick Insert Paragraph After Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                  <button
                    type="button"
                    onClick={() => handleInsertBlock(index, 'paragraph')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 6px'
                    }}
                    title="Insert a paragraph block immediately after this one"
                  >
                    <span>+ Insert paragraph below</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Append New Block Toolbar */}
      {blocks.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
            padding: 'var(--space-3)',
            backgroundColor: 'var(--color-surface-card, #FFFDFA)',
            border: '1px dashed var(--color-border, #DDD4C7)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginRight: 'var(--space-2)' }}>
            Append block:
          </span>
          <button
            type="button"
            onClick={() => handleAppendBlock('paragraph')}
            className="quill-btn quill-btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', minHeight: '32px' }}
          >
            + Paragraph
          </button>
          <button
            type="button"
            onClick={() => handleAppendBlock('heading')}
            className="quill-btn quill-btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', minHeight: '32px' }}
          >
            + Heading
          </button>
          <button
            type="button"
            onClick={() => handleAppendBlock('quote')}
            className="quill-btn quill-btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', minHeight: '32px' }}
          >
            + Pull quote
          </button>
          <button
            type="button"
            onClick={() => handleAppendBlock('list')}
            className="quill-btn quill-btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', minHeight: '32px' }}
          >
            + Bullet list
          </button>
        </div>
      )}

      {error && (
        <p
          role="alert"
          style={{
            color: 'var(--color-error, #C94236)',
            fontSize: '0.85rem',
            margin: 'var(--space-1) 0 0 0'
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
