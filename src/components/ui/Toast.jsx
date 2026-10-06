import React from 'react';

/**
 * Toast & ToastContainer:
 * Dismissible, lightweight feedback notifications.
 */
export function Toast({
  message,
  type = 'info', // 'success' | 'error' | 'info'
  onDismiss
}) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--color-success)" strokeWidth="2">
            <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'error':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--color-error)" strokeWidth="2">
            <circle cx="8" cy="8" r="6" />
            <line x1="8" y1="5" x2="8" y2="8.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.75" fill="var(--color-error)" />
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--color-info)" strokeWidth="2">
            <circle cx="8" cy="8" r="6" />
            <line x1="8" y1="7" x2="8" y2="11" strokeLinecap="round" />
            <circle cx="8" cy="5" r="0.75" fill="var(--color-info)" />
          </svg>
        );
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="quill-toast"
    >
      <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>
        {getIcon()}
      </span>
      <span>{message}</span>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          style={{
            marginLeft: 'var(--space-2)',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="3" x2="11" y2="11" strokeLinecap="round" />
            <line x1="3" y1="11" x2="11" y2="3" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function ToastContainer({ children }) {
  return (
    <div className="quill-toast-container">
      {children}
    </div>
  );
}
