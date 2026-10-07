import React, { useState, useRef, useEffect } from 'react';
import { SearchInput } from '../ui/Input';
import Avatar from '../ui/Avatar';
import { useReader } from '../../hooks/useReader';

export default function CommunityHeader({
  searchQuery,
  onSearchChange,
  onSearchClear,
  onNavigate,
  onOpenMobileMenu
}) {
  const { bookmarks } = useReader();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#FFFDFA',
        borderBottom: '1px solid var(--color-border)',
        width: '100%'
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max-width)',
          margin: '0 auto',
          padding: '0 var(--gutter-desktop)',
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-6)'
        }}
      >
        {/* Left: Mobile Toggle & Brand Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="quill-icon-btn quill-icon-btn-standard"
              aria-label="Open navigation menu"
              style={{ display: 'none' }}
              id="community-mobile-menu-btn"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </svg>
            </button>
          )}

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="brand-wordmark"
            aria-label="quill. — Return to landing page"
            style={{ fontSize: '1.75rem' }}
          >
            quill<span className="brand-dot">.</span>
          </a>
        </div>

        {/* Center: Search Field */}
        <div style={{ flex: 1, maxWidth: '440px' }}>
          <SearchInput
            id="dashboard-search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={onSearchClear}
            placeholder="Search stories, topics, or writers..."
          />
        </div>

        {/* Right: Write action & Reader Avatar Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button
            type="button"
            onClick={() => onNavigate('/write')}
            className="quill-btn quill-btn-primary"
            style={{ padding: '0.45rem 1.1rem', minHeight: '38px', fontSize: '0.88rem' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Write a story</span>
          </button>

          {/* Reader Profile Menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Reader account menu"
              aria-expanded={menuOpen}
              style={{
                borderRadius: 'var(--radius-pill)',
                padding: '2px',
                border: menuOpen ? '2px solid var(--color-accent)' : '2px solid transparent',
                cursor: 'pointer',
                display: 'flex'
              }}
            >
              <Avatar name="Reader" size="sm" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="quill-surface-card"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  zIndex: 200,
                  boxShadow: 'var(--shadow-md)',
                  padding: 'var(--space-3)',
                  backgroundColor: '#FFFDFA'
                }}
              >
                {/* Guest Identity Notice */}
                <div style={{ padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Reading as a guest
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Local prototype reading session
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: 'var(--space-1) 0' }} />

                {/* My Stories Link */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onNavigate('/my-stories');
                  }}
                  className="quill-sidebar-nav-item"
                  style={{ fontSize: '0.88rem', padding: '0.5rem 0.75rem' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <span>My stories</span>
                </button>

                {/* Saved Bookmarks Link */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onNavigate('/bookmarks');
                  }}
                  className="quill-sidebar-nav-item"
                  style={{ fontSize: '0.88rem', padding: '0.5rem 0.75rem' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Bookmarks ({bookmarks.length})</span>
                </button>

                {/* Back to landing */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onNavigate('/');
                  }}
                  className="quill-sidebar-nav-item"
                  style={{ fontSize: '0.88rem', padding: '0.5rem 0.75rem' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Back to landing</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
