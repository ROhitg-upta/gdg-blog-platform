import React from 'react';

/**
 * PrimaryButton:
 * Main call-to-action button with Quill emerald green fill.
 */
export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  icon = null,
  trailingIcon = null,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`quill-btn quill-btn-primary ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="quill-btn-spinner" aria-hidden="true" />
          <span>{typeof children === 'string' ? 'Loading...' : children}</span>
        </>
      ) : (
        <>
          {icon && <span className="quill-btn-icon" aria-hidden="true">{icon}</span>}
          <span>{children}</span>
          {trailingIcon && <span className="quill-btn-trailing" aria-hidden="true">{trailingIcon}</span>}
        </>
      )}
    </button>
  );
}

/**
 * SecondaryButton:
 * Elevated charcoal button for secondary actions.
 */
export function SecondaryButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  icon = null,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`quill-btn quill-btn-secondary ${className}`}
      {...props}
    >
      {loading && <span className="quill-btn-spinner" aria-hidden="true" />}
      {icon && !loading && <span className="quill-btn-icon" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

/**
 * GhostButton:
 * Transparent button with subtle hover background.
 */
export function GhostButton({
  children,
  onClick,
  disabled = false,
  type = 'button',
  icon = null,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`quill-btn quill-btn-ghost ${className}`}
      {...props}
    >
      {icon && <span className="quill-btn-icon" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

/**
 * TextButton:
 * Understated inline text action.
 */
export function TextButton({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`quill-btn quill-btn-text ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
