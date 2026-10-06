import React, { useState, useEffect, useRef } from 'react';

export default function ActionNoticeModal({ type, onClose }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousActiveElement = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  const isWriterAction = type === 'write' || type === 'share';

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-notice-title"
    >
      <div className="modal-container" style={{ maxWidth: '540px' }}>
        <button
          ref={closeButtonRef}
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="3" x2="15" y2="15" />
            <line x1="3" y1="15" x2="15" y2="3" />
          </svg>
        </button>

        <div className="notice-modal-badge">
          <span>● Coming Soon</span>
        </div>

        <h2 id="action-notice-title" className="notice-modal-title">
          {isWriterAction ? "The Writer Studio is in Crafting." : "Reader Accounts Rolling Out Soon."}
        </h2>

        <p className="notice-modal-desc">
          {isWriterAction
            ? "We are fine-tuning our distraction-free markdown editor, typography palette, and publishing pipeline. Early writer invites are being dispatched in rolling cohorts."
            : "Personalized reading queues, custom bookmarks, and private annotations are launching in the upcoming product release."}
        </p>

        {subscribed ? (
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(216, 90, 53, 0.08)',
              borderRadius: '6px',
              border: '1px solid #D85A35',
              fontSize: '0.92rem',
              color: '#22211F',
              marginBottom: '1.25rem'
            }}
          >
            ✓ Thank you! We'll notify you as soon as early access opens.
          </div>
        ) : (
          <form className="notice-modal-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="notice-modal-input"
              placeholder="Enter your email for early invitation"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary-action" style={{ padding: '0.75rem 1.4rem' }}>
              Notify me
            </button>
          </form>
        )}

        <div style={{ textAlign: 'right' }}>
          <button
            type="button"
            className="btn-start-writing"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem', backgroundColor: '#6D675F' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
