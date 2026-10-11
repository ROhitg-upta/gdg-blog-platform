import React, { useEffect, useState, useRef } from 'react';

/**
 * Contextual floating toolbar appearing above selected article text.
 * Provides Highlight, Add Note, and Copy Quote actions.
 */
export default function HighlightToolbar({
  story,
  onHighlight,
  onAddNoteFromQuote,
  showToast
}) {
  const [position, setPosition] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const toolbarRef = useRef(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setPosition(null);
        setSelectedText('');
        return;
      }

      const text = selection.toString().trim();
      // Ensure selection is inside the article body
      const anchorNode = selection.anchorNode;
      const articleEl = document.querySelector('.quill-article-body');
      if (!articleEl || !anchorNode || !articleEl.contains(anchorNode)) {
        setPosition(null);
        setSelectedText('');
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Position toolbar centered directly above the selection
      const top = Math.max(10, rect.top + window.scrollY - 46);
      const left = Math.max(10, Math.min(window.innerWidth - 220, rect.left + window.scrollX + rect.width / 2 - 100));

      setSelectedText(text);
      setPosition({ top, left });
    };

    const handleMouseUp = () => {
      setTimeout(handleSelectionChange, 10);
    };

    const handleKeyUp = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Shift'].includes(e.key)) {
        setTimeout(handleSelectionChange, 10);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (!position || !selectedText) return null;

  const handleHighlightClick = () => {
    if (onHighlight) {
      onHighlight(selectedText);
    }
    window.getSelection()?.removeAllRanges();
    setPosition(null);
    setSelectedText('');
  };

  const handleNoteClick = () => {
    if (onAddNoteFromQuote) {
      onAddNoteFromQuote(selectedText);
    }
    window.getSelection()?.removeAllRanges();
    setPosition(null);
    setSelectedText('');
  };

  const handleCopyQuote = () => {
    const formattedQuote = `“${selectedText}”\n— from "${story?.title || 'Quill Story'}", by ${story?.author?.name || 'Quill Writer'}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(formattedQuote)
        .then(() => {
          showToast?.('Quote copied with attribution.', 'success');
        })
        .catch(() => {
          showToast?.('Unable to copy quote.', 'error');
        });
    }
    window.getSelection()?.removeAllRanges();
    setPosition(null);
    setSelectedText('');
  };

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label="Text selection tools"
      className="quill-highlight-toolbar"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        backgroundColor: '#1E1C1A',
        color: '#FFFDFA',
        padding: '3px 6px',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-md)',
        animation: 'fadeIn var(--transition-fast)'
      }}
    >
      <button
        type="button"
        onClick={handleHighlightClick}
        className="quill-btn-text"
        style={{
          color: '#F8E4D9',
          fontSize: '0.78rem',
          padding: '0.3rem 0.6rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          borderRadius: 'var(--radius-pill)'
        }}
        title="Save highlight"
      >
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)'
          }}
        />
        <span>Highlight</span>
      </button>

      <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.2)' }} />

      <button
        type="button"
        onClick={handleNoteClick}
        className="quill-btn-text"
        style={{
          color: '#FFFDFA',
          fontSize: '0.78rem',
          padding: '0.3rem 0.6rem',
          fontWeight: 500,
          borderRadius: 'var(--radius-pill)'
        }}
        title="Add margin note"
      >
        <span>Note</span>
      </button>

      <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.2)' }} />

      <button
        type="button"
        onClick={handleCopyQuote}
        className="quill-btn-text"
        style={{
          color: '#FFFDFA',
          fontSize: '0.78rem',
          padding: '0.3rem 0.6rem',
          fontWeight: 500,
          borderRadius: 'var(--radius-pill)'
        }}
        title="Copy quote with attribution"
      >
        <span>Copy quote</span>
      </button>
    </div>
  );
}
