import React from 'react';

/**
 * EmptyState:
 * Informative zero-data feedback state with original local abstract SVG art.
 */
export default function EmptyState({
  title = 'No items found',
  description = 'There are no records to display at this time.',
  action = null,
  illustration = null,
  className = ''
}) {
  return (
    <div className={`quill-empty-state ${className}`}>
      <div className="quill-empty-art" aria-hidden="true">
        {illustration || (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Abstract Open Manuscript & Quill Outline */}
            <path d="M20 70 C35 62, 45 68, 50 72 C55 68, 65 62, 80 70 L80 32 C65 24, 55 30, 50 34 C45 30, 35 24, 20 32 Z" fill="var(--color-surface-hover)" />
            <line x1="50" y1="34" x2="50" y2="72" stroke="var(--color-accent)" strokeWidth="2" />
            <path d="M68 22 C72 15, 82 12, 85 10 C83 18, 76 25, 70 30" stroke="var(--color-accent)" />
          </svg>
        )}
      </div>

      <h3 className="quill-empty-title">{title}</h3>
      <p className="quill-empty-desc">{description}</p>

      {action && <div className="quill-empty-action">{action}</div>}
    </div>
  );
}
