import React, { useEffect, useRef } from 'react';

export default function ReaderSettingsPopover({
  isOpen,
  onClose,
  preferences,
  onTextSizeChange,
  onReadingWidthChange,
  onLineSpacingChange,
  onReset
}) {
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label="Reader typography settings"
      className="quill-surface-card"
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        width: '280px',
        zIndex: 250,
        backgroundColor: '#FFFDFA',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)' }}>
          Reader Display
        </span>
        <button
          type="button"
          onClick={onReset}
          className="quill-btn-text"
          style={{ fontSize: '0.75rem', padding: '0 4px', color: 'var(--color-text-muted)' }}
        >
          Reset
        </button>
      </div>

      {/* 1. Text Size */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
          Text Size
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
          {[
            { id: 'small', label: 'Small', sample: '15px' },
            { id: 'default', label: 'Default', sample: '18px' },
            { id: 'large', label: 'Large', sample: '20px' }
          ].map((option) => {
            const isSelected = preferences.textSize === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onTextSizeChange(option.id)}
                className={`quill-btn quill-btn-secondary ${isSelected ? 'active' : ''}`}
                style={{
                  padding: '0.35rem 0',
                  minHeight: '34px',
                  fontSize: '0.78rem',
                  borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-accent-soft)' : 'var(--color-surface-card)',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  fontWeight: isSelected ? 600 : 400
                }}
                aria-pressed={isSelected}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Reading Column Width */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
          Reading Width
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
          {[
            { id: 'standard', label: 'Standard (680px)' },
            { id: 'spacious', label: 'Spacious (760px)' }
          ].map((option) => {
            const isSelected = preferences.readingWidth === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onReadingWidthChange(option.id)}
                className={`quill-btn quill-btn-secondary ${isSelected ? 'active' : ''}`}
                style={{
                  padding: '0.35rem 0.4rem',
                  minHeight: '34px',
                  fontSize: '0.76rem',
                  borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-accent-soft)' : 'var(--color-surface-card)',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  fontWeight: isSelected ? 600 : 400
                }}
                aria-pressed={isSelected}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Line Spacing */}
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
          Line Spacing
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
          {[
            { id: 'standard', label: 'Standard' },
            { id: 'relaxed', label: 'Relaxed' }
          ].map((option) => {
            const isSelected = preferences.lineSpacing === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onLineSpacingChange(option.id)}
                className={`quill-btn quill-btn-secondary ${isSelected ? 'active' : ''}`}
                style={{
                  padding: '0.35rem 0.4rem',
                  minHeight: '34px',
                  fontSize: '0.78rem',
                  borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-accent-soft)' : 'var(--color-surface-card)',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  fontWeight: isSelected ? 600 : 400
                }}
                aria-pressed={isSelected}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
          Preferences saved to this browser
        </span>
      </div>
    </div>
  );
}
