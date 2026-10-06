import React from 'react';

/**
 * SelectField:
 * Styled native select element with customized dropdown chevron.
 */
export function SelectField({
  id,
  value,
  onChange,
  options = [],
  disabled = false,
  error = false,
  className = '',
  ...props
}) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`quill-select ${error ? 'quill-input-error' : ''} ${className}`}
        style={{ appearance: 'none', paddingRight: '2.5rem' }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <span
        style={{
          position: 'absolute',
          right: '1rem',
          pointerEvents: 'none',
          color: 'var(--color-text-muted)'
        }}
        aria-hidden="true"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2.5 4.5L6 8L9.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}
