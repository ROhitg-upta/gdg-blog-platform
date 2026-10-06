import React, { useEffect, useRef } from 'react';

/**
 * Modal:
 * Accessible overlay dialog with escape-to-close, body scroll lock, and focus restoration.
 */
export default function Modal({
  isOpen = false,
  onClose,
  title = '',
  description = '',
  children,
  maxWidth = '540px',
  className = ''
}) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      // Focus first focusable element inside modal
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="quill-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'quill-modal-title' : undefined}
      aria-describedby={description ? 'quill-modal-desc' : undefined}
    >
      <div
        ref={modalRef}
        className={`quill-modal-card ${className}`}
        style={{ maxWidth }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          {title && (
            <h3 id="quill-modal-title" className="text-h3 font-serif">
              {title}
            </h3>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="quill-icon-btn quill-icon-btn-compact"
            style={{ marginLeft: 'auto' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="3" x2="13" y2="13" strokeLinecap="round" />
              <line x1="3" y1="13" x2="13" y2="3" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {description && (
          <p id="quill-modal-desc" className="text-body-sm" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
            {description}
          </p>
        )}

        <div className="quill-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
