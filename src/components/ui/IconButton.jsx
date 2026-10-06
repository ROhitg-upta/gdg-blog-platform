import React, { useState } from 'react';

/**
 * IconButton:
 * Accessible button for icon-only actions with optional tooltip.
 */
export default function IconButton({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
  size = 'standard', // 'standard' | 'compact'
  tooltip = '',
  className = '',
  ...props
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={active}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={`quill-icon-btn quill-icon-btn-${size} ${active ? 'active' : ''} ${className}`}
        {...props}
      >
        <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </span>
      </button>

      {tooltip && showTooltip && !disabled && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-6px)',
            backgroundColor: 'var(--color-ink-muted)',
            color: 'var(--color-text-primary)',
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            whiteSpace: 'nowrap',
            border: '1px solid var(--color-border)',
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {tooltip}
        </span>
      )}
    </div>
  );
}
