import React, { useState, useEffect, useRef } from 'react';
import { getStoredNotes, saveNote, deleteNote } from '../../utils/advancedStorage';

export default function MarginNotesDrawer({
  isOpen,
  onClose,
  storyId,
  storyTitle,
  initialQuote = '',
  onClearInitialQuote,
  showToast
}) {
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [quotedText, setQuotedText] = useState(initialQuote || '');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState('');
  const drawerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (storyId) {
      setNotes(getStoredNotes(storyId));
    }
  }, [storyId, isOpen]);

  useEffect(() => {
    if (initialQuote) {
      setQuotedText(initialQuote);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialQuote]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const created = saveNote({
      storyId,
      text: newNoteText,
      quote: quotedText
    });

    if (created) {
      setNotes(getStoredNotes(storyId));
      setNewNoteText('');
      setQuotedText('');
      onClearInitialQuote?.();
      showToast?.('Margin thought saved locally.', 'success');
    }
  };

  const handleStartEdit = (note) => {
    setEditingNoteId(note.id);
    setEditText(note.text);
  };

  const handleSaveEdit = (noteId) => {
    if (!editText.trim()) return;
    saveNote({
      storyId,
      text: editText,
      id: noteId
    });
    setNotes(getStoredNotes(storyId));
    setEditingNoteId(null);
    setEditText('');
    showToast?.('Note updated.', 'info');
  };

  const handleDeleteNote = (noteId) => {
    deleteNote(noteId);
    setNotes(getStoredNotes(storyId));
    showToast?.('Note removed.', 'info');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Private margin notes"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(30, 28, 26, 0.35)',
        animation: 'fadeIn var(--transition-fast)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={drawerRef}
        className="quill-margin-drawer quill-surface-card"
        style={{
          width: '100%',
          maxWidth: '380px',
          height: '100%',
          backgroundColor: '#FFFDFA',
          borderLeft: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          animation: 'slideInRight var(--transition-normal)'
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
              Private Thoughts
            </span>
            <h2 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', margin: '2px 0 0 0' }}>
              Margin Notes
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="quill-icon-btn quill-icon-btn-compact"
            aria-label="Close notes drawer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Local-only reassurance banner */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-5)',
            backgroundColor: 'var(--color-surface-card)',
            borderBottom: '1px solid var(--color-border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)'
          }}
        >
          <span style={{ fontWeight: 500, color: 'var(--color-text-secondary)' }}>Note:</span> These thoughts are private and exist only in this browser. The author and other readers cannot see them.
        </div>

        {/* Note Composer */}
        <form
          onSubmit={handleCreateNote}
          style={{
            padding: 'var(--space-5)',
            borderBottom: '1px solid var(--color-border-subtle)',
            backgroundColor: '#FFFDFA'
          }}
        >
          {quotedText && (
            <div
              style={{
                marginBottom: 'var(--space-3)',
                padding: 'var(--space-2) var(--space-3)',
                backgroundColor: 'var(--color-surface-secondary)',
                borderLeft: '2px solid var(--color-accent)',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                position: 'relative'
              }}
            >
              <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--color-text-secondary)', margin: 0 }}>
                “{quotedText}”
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuotedText('');
                  onClearInitialQuote?.();
                }}
                className="quill-btn-text"
                style={{ fontSize: '0.72rem', color: 'var(--color-accent)', marginTop: '4px' }}
              >
                Clear quote
              </button>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Jot down a fleeting reflection or question..."
            rows={3}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-card)',
              color: 'var(--color-text-primary)',
              fontSize: '0.88rem',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              outline: 'none'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
            <button
              type="submit"
              disabled={!newNoteText.trim()}
              className="quill-btn quill-btn-primary"
              style={{ padding: '0.35rem 0.9rem', fontSize: '0.82rem', minHeight: '32px' }}
            >
              Save thought
            </button>
          </div>
        </form>

        {/* Notes List / Empty State */}
        <div style={{ flex: 1, padding: 'var(--space-5)', overflowY: 'auto' }}>
          {notes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-4)' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-3) auto',
                  color: 'var(--color-accent)'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.05rem', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Keep a thought close.
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.45, maxWidth: '240px', margin: '0 auto' }}>
                Select any sentence in the story to attach a quote, or leave an independent margin thought here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {notes.map((note) => {
                const isEditing = editingNoteId === note.id;
                const formattedTime = new Date(note.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={note.id}
                    style={{
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-surface-card)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {note.quote && (
                      <p
                        style={{
                          fontSize: '0.78rem',
                          fontStyle: 'italic',
                          color: 'var(--color-text-secondary)',
                          borderLeft: '2px solid var(--color-accent-border)',
                          paddingLeft: 'var(--space-2)',
                          margin: '0 0 var(--space-2) 0'
                        }}
                      >
                        “{note.quote}”
                      </p>
                    )}

                    {isEditing ? (
                      <div>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: 'var(--space-2)',
                            fontSize: '0.85rem',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid var(--color-accent)',
                            fontFamily: 'inherit'
                          }}
                        />
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '6px' }}>
                          <button
                            type="button"
                            onClick={() => setEditingNoteId(null)}
                            className="quill-btn quill-btn-secondary"
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.76rem', minHeight: '26px' }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(note.id)}
                            className="quill-btn quill-btn-primary"
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.76rem', minHeight: '26px' }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.5 }}>
                          {note.text}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 'var(--space-3)',
                            paddingTop: 'var(--space-2)',
                            borderTop: '1px solid var(--color-border-subtle)',
                            fontSize: '0.74rem',
                            color: 'var(--color-text-muted)'
                          }}
                        >
                          <span>{formattedTime}</span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(note)}
                              className="quill-btn-text"
                              style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNote(note.id)}
                              className="quill-btn-text"
                              style={{ fontSize: '0.74rem', color: 'var(--color-error)' }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
