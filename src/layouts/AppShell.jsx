import React from 'react';

/**
 * AppShell:
 * Full viewport application shell wrapping the dark editorial Quill surface.
 */
export default function AppShell({ children, className = '' }) {
  return (
    <div className={`quill-app-shell ${className}`}>
      {children}
    </div>
  );
}
