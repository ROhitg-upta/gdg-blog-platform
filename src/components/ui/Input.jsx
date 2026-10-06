import React, { useState } from 'react';

/**
 * TextInput:
 * Base text input field.
 */
export function TextInput({
  id,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  error = false,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`quill-input ${error ? 'quill-input-error' : ''} ${className}`}
      {...props}
    />
  );
}

/**
 * SearchInput:
 * Search bar with leading search icon and instant clear button.
 */
export function SearchInput({
  id = 'quill-search',
  value,
  onChange,
  onClear,
  placeholder = 'Search stories, topics, or authors...',
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className={`quill-search-wrapper ${className}`}>
      <span className="quill-search-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="7" cy="7" r="5" />
          <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" strokeLinecap="round" />
        </svg>
      </span>

      <input
        id={id}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="quill-input quill-search-input"
        {...props}
      />

      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="quill-search-clear"
          aria-label="Clear search input"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="2" y1="2" x2="10" y2="10" strokeLinecap="round" />
            <line x1="2" y1="10" x2="10" y2="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * PasswordInput:
 * Secure password input with eye toggle button and accessible labels.
 */
export function PasswordInput({
  id,
  value,
  onChange,
  placeholder = '••••••••••••',
  disabled = false,
  error = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="quill-input-wrapper">
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`quill-input ${error ? 'quill-input-error' : ''} ${className}`}
        style={{ paddingRight: '2.5rem' }}
        {...props}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="quill-password-toggle"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        disabled={disabled}
      >
        {showPassword ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

/**
 * TextArea:
 * Multi-line text field for story writing and notes.
 */
export function TextArea({
  id,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  disabled = false,
  error = false,
  className = '',
  ...props
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`quill-textarea ${error ? 'quill-input-error' : ''} ${className}`}
      {...props}
    />
  );
}
