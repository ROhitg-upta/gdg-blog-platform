import React from 'react';

/**
 * TopicChip:
 * Interactive filter pill with restrained emerald green selection.
 */
export default function TopicChip({
  label,
  selected = false,
  onClick,
  count = null,
  size = 'standard', // 'standard' | 'compact'
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`quill-chip quill-chip-${size} ${selected ? 'selected' : ''} ${className}`}
      {...props}
    >
      <span>{label}</span>
      {count !== null && (
        <span className="quill-chip-count" aria-label={`${count} stories`}>
          ({count})
        </span>
      )}
    </button>
  );
}
