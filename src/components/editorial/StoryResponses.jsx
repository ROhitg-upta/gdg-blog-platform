import React, { useState, useEffect } from 'react';
import Avatar from '../ui/Avatar';
import ConfirmDialog from '../ui/ConfirmDialog';
import { getStoredResponses, saveResponse, deleteResponse } from '../../utils/advancedStorage';
import { useReader } from '../../hooks/useReader';

export default function StoryResponses({ storyId, showToast }) {
  const { profilePreferences } = useReader();
  const authorDisplayName = profilePreferences?.penName || 'Reader';

  const [responses, setResponses] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [responseToDelete, setResponseToDelete] = useState(null);

  const MAX_CHARS = 500;

  useEffect(() => {
    if (storyId) {
      setResponses(getStoredResponses(storyId));
    }
  }, [storyId]);

  const handlePostResponse = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const saved = saveResponse({
      storyId,
      text: inputText.slice(0, MAX_CHARS),
      authorName: authorDisplayName
    });

    if (saved) {
      setResponses(getStoredResponses(storyId));
      setInputText('');
      showToast?.('Your thought has been recorded locally.', 'success');
    }
  };

  const handleSaveEdit = (respId) => {
    if (!editText.trim()) return;

    saveResponse({
      storyId,
      text: editText.slice(0, MAX_CHARS),
      authorName: authorDisplayName,
      id: respId
    });

    setResponses(getStoredResponses(storyId));
    setEditingId(null);
    setEditText('');
    showToast?.('Response updated.', 'info');
  };

  const handleConfirmDelete = () => {
    if (responseToDelete) {
      deleteResponse(responseToDelete.id);
      setResponses(getStoredResponses(storyId));
      setResponseToDelete(null);
      showToast?.('Response removed.', 'info');
    }
  };

  return (
    <section
      className="quill-responses-section quill-surface-card"
      style={{
        marginTop: 'var(--space-12)',
        padding: 'var(--space-8)',
        backgroundColor: '#FFFDFA',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)'
      }}
      aria-label="Story responses"
    >
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: 600 }}>
          Conversation
        </span>
        <h2 className="font-serif text-h3" style={{ color: 'var(--color-text-primary)', margin: '4px 0 6px 0' }}>
          Leave a thought
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Responses are saved in this browser for this demo. No public sync or external accounts are involved.
        </p>
      </div>

      {/* Input Composer */}
      <form onSubmit={handlePostResponse} style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
          <Avatar name={authorDisplayName} size="md" />
          <div style={{ flex: 1 }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="What questions or memories does this piece bring forward?"
              rows={3}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-card)',
                color: 'var(--color-text-primary)',
                fontSize: '0.92rem',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical'
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'var(--space-2)'
              }}
            >
              <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                {inputText.length}/{MAX_CHARS} characters
              </span>
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="quill-btn quill-btn-primary"
                style={{ padding: '0.35rem 0.95rem', minHeight: '34px', fontSize: '0.82rem' }}
              >
                Post thought
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Response Stream */}
      <div>
        <h3
          style={{
            fontSize: '0.92rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-4)',
            paddingBottom: 'var(--space-2)',
            borderBottom: '1px solid var(--color-border-subtle)'
          }}
        >
          Responses ({responses.length})
        </h3>

        {responses.length === 0 ? (
          <div style={{ padding: 'var(--space-6) 0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', fontStyle: 'italic', margin: 0 }}>
              No responses here yet. Start the conversation.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {responses.map((resp) => {
              const isEditing = editingId === resp.id;
              const formattedDate = new Date(resp.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <article
                  key={resp.id}
                  style={{
                    padding: 'var(--space-4)',
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-subtle)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--space-2)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Avatar name={resp.authorName} size="xs" />
                      <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {resp.authorName}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        · {formattedDate}
                      </span>
                    </div>

                    {!isEditing && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(resp.id);
                            setEditText(resp.text);
                          }}
                          className="quill-btn-text"
                          style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setResponseToDelete(resp)}
                          className="quill-btn-text"
                          style={{ fontSize: '0.74rem', color: 'var(--color-error)' }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value.slice(0, MAX_CHARS))}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: 'var(--space-2)',
                          fontSize: '0.88rem',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--color-accent)',
                          fontFamily: 'inherit'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="quill-btn quill-btn-secondary"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem', minHeight: '28px' }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(resp.id)}
                          className="quill-btn quill-btn-primary"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem', minHeight: '28px' }}
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.55 }}>
                      {resp.text}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Named Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(responseToDelete)}
        title="Delete response?"
        message="Are you sure you want to remove this thought? This action will permanently delete it from this browser."
        confirmLabel="Delete permanently"
        cancelLabel="Keep thought"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setResponseToDelete(null)}
      />
    </section>
  );
}
