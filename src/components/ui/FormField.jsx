import React from 'react';

/**
 * FormField:
 * Wrapper managing accessibility linkage between labels, helper texts, and validation errors.
 */
export default function FormField({
  id,
  label,
  required = false,
  error = '',
  helperText = '',
  children,
  className = ''
}) {
  return (
    <div className={`quill-form-field ${className}`}>
      {label && (
        <label htmlFor={id} className="quill-form-label">
          <span>{label}</span>
          {required && <span className="quill-form-required" aria-hidden="true">*</span>}
        </label>
      )}

      {children}

      {error ? (
        <span id={`${id}-error`} className="quill-input-error-msg" role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span id={`${id}-helper`} className="quill-input-helper">
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
