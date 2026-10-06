import React from 'react';

/**
 * PageContainer:
 * Responsive content bounding box constrained to --container-max-width.
 */
export function PageContainer({ children, className = '' }) {
  return (
    <div className={`quill-page-container ${className}`}>
      {children}
    </div>
  );
}

/**
 * SplitLayout:
 * Responsive two-column split view for authentication and editorial focuses.
 */
export function SplitLayout({ left, right, className = '' }) {
  return (
    <div className={`quill-split-layout ${className}`}>
      <div className="quill-split-left">{left}</div>
      <div className="quill-split-right">{right}</div>
    </div>
  );
}

/**
 * DashboardLayout:
 * Structurally ready 3-column layout (sidebar, main content feed, right rail).
 */
export function DashboardLayout({
  sidebar,
  children,
  rail,
  className = ''
}) {
  return (
    <div className={`quill-dashboard-layout ${className}`}>
      {sidebar && <aside className="quill-dashboard-sidebar">{sidebar}</aside>}
      <main className="quill-dashboard-main">{children}</main>
      {rail && <aside className="quill-dashboard-rail">{rail}</aside>}
    </div>
  );
}
