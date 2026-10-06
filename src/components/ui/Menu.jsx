import React from 'react';

/**
 * Menu:
 * Presentational dropdown container for profile actions and context menus.
 */
export function Menu({ children, isOpen = false, className = '', ...props }) {
  if (!isOpen) return null;

  return (
    <div
      role="menu"
      className={`quill-surface-card ${className}`}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 'var(--space-2)',
        minWidth: '200px',
        zIndex: 50,
        boxShadow: 'var(--shadow-md)',
        padding: 'var(--space-2)'
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function MenuItem({
  children,
  onClick,
  icon = null,
  destructive = false,
  disabled = false
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: '0.55rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--text-size-body-sm)',
        color: destructive ? 'var(--color-error)' : 'var(--color-text-primary)',
        transition: 'background-color var(--transition-fast)',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = destructive
          ? 'var(--color-error-soft)'
          : 'var(--color-surface-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export function MenuDivider() {
  return (
    <div
      role="separator"
      style={{
        height: '1px',
        backgroundColor: 'var(--color-border)',
        margin: 'var(--space-1) 0'
      }}
    />
  );
}
