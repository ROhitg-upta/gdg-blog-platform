import React from 'react';
import { SecondaryButton } from './Button';

/**
 * ErrorState:
 * Full-section or page-level error state with retry actions.
 */
export function ErrorState({
  title = 'Something interrupted your reading',
  description = 'We encountered an unexpected issue while loading this section.',
  onRetry,
  onBack,
  className = ''
}) {
  return (
    <div className={`quill-empty-state ${className}`}>
      <div className="quill-empty-art" style={{ color: 'var(--color-error)' }} aria-hidden="true">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="50" r="38" />
          <line x1="50" y1="32" x2="50" y2="54" strokeWidth="2.5" />
          <circle cx="50" cy="68" r="2.5" fill="currentColor" />
        </svg>
      </div>

      <h3 className="quill-empty-title">{title}</h3>
      <p className="quill-empty-desc">{description}</p>

      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        {onRetry && (
          <SecondaryButton onClick={onRetry}>
            Try again
          </SecondaryButton>
        )}
        {onBack && (
          <SecondaryButton onClick={onBack}>
            Go back
          </SecondaryButton>
        )}
      </div>
    </div>
  );
}

/**
 * InlineMessage:
 * Banner message for success, warning, error, or info feedback.
 */
export function InlineMessage({
  children,
  type = 'info', // 'success' | 'warning' | 'error' | 'info'
  className = ''
}) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 9.5 7.5 13 14 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'warning':
        return (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 2L1 16H17L9 2Z" strokeLinejoin="round" />
            <line x1="9" y1="7" x2="9" y2="11" strokeLinecap="round" />
            <circle cx="9" cy="13.5" r="0.75" fill="currentColor" />
          </svg>
        );
      case 'error':
        return (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="9" r="7" />
            <line x1="9" y1="6" x2="9" y2="10" strokeLinecap="round" />
            <circle cx="9" cy="12.5" r="0.75" fill="currentColor" />
          </svg>
        );
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="9" r="7" />
            <line x1="9" y1="8" x2="9" y2="12" strokeLinecap="round" />
            <circle cx="9" cy="5.5" r="0.75" fill="currentColor" />
          </svg>
        );
    }
  };

  return (
    <div className={`quill-inline-msg quill-inline-msg-${type} ${className}`} role="status">
      <span aria-hidden="true" style={{ marginTop: '1px', flexShrink: 0 }}>
        {getIcon()}
      </span>
      <div>{children}</div>
    </div>
  );
}
