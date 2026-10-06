import React, { useEffect, useRef } from 'react';

export default function ReadingModal({ story, onClose }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Focus management & Escape to close
  useEffect(() => {
    const previousActiveElement = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [onClose]);

  if (!story) return null;

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
      aria-labelledby="reading-modal-title"
    >
      <div className="modal-container" ref={modalRef}>
        {/* Accessible Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close reading preview modal"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="3" x2="15" y2="15" />
            <line x1="3" y1="15" x2="15" y2="3" />
          </svg>
        </button>

        {/* Modal Content */}
        <span className="modal-article-topic">{story.topic}</span>
        <h2 id="reading-modal-title" className="modal-article-title">
          {story.title}
        </h2>

        <div className="modal-article-meta">
          <span>By {story.author.name}</span>
          <span>•</span>
          <span>{story.readingTime}</span>
        </div>

        <div className="modal-article-body">
          {Array.isArray(story.content) ? (
            story.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))
          ) : (
            <p>{story.summary || "A thoughtful reflection on craft and observation."}</p>
          )}
        </div>

        <div className="modal-preview-notice">
          <span>Curated preview for quill. readers</span>
          <button
            type="button"
            className="btn-start-writing"
            style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
            onClick={onClose}
          >
            Done reading
          </button>
        </div>
      </div>
    </div>
  );
}
