import React from 'react';

/**
 * SidebarNavItem:
 * Navigation link item with emerald active indicator and optional compact icon mode.
 */
export function SidebarNavItem({
  icon,
  label,
  active = false,
  onClick,
  compact = false,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`quill-sidebar-nav-item ${active ? 'active' : ''} ${className}`}
      title={compact ? label : undefined}
      aria-label={label}
      {...props}
    >
      <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </span>
      {!compact && <span>{label}</span>}
    </button>
  );
}

/**
 * SectionLabel:
 * Small uppercase tracking label for sidebar and section headers.
 */
export function SectionLabel({ children, className = '' }) {
  return (
    <span className={`quill-section-label ${className}`}>
      {children}
    </span>
  );
}

/**
 * TopNavAction:
 * Action button wrapper for header icons and commands.
 */
export function TopNavAction({
  children,
  onClick,
  label,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`quill-icon-btn quill-icon-btn-standard ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * TabList & TabButton:
 * Accessible tab bar for feed streams ("For you", "Following", "Latest").
 */
export function TabList({ children, label = 'Feed segments', className = '' }) {
  return (
    <div role="tablist" aria-label={label} className={`quill-tab-list ${className}`}>
      {children}
    </div>
  );
}

export function TabButton({
  id,
  label,
  active = false,
  onClick,
  controls,
  className = ''
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={active}
      aria-controls={controls}
      onClick={onClick}
      className={`quill-tab-btn ${active ? 'active' : ''} ${className}`}
    >
      {label}
    </button>
  );
}
