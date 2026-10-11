import React, { useState, useRef, useEffect } from 'react';
import { SearchInput } from '../ui/Input';
import Avatar from '../ui/Avatar';
import { useReader } from '../../hooks/useReader';
import { getRecentSearches, addRecentSearch, clearRecentSearches } from '../../utils/advancedStorage';
import { TOPICS, WRITERS } from '../../data/communityData';

export default function CommunityHeader({
  searchQuery,
  onSearchChange,
  onSearchClear,
  onNavigate,
  onOpenMobileMenu,
  onOpenCommandPalette
}) {
  const { bookmarks, profilePreferences } = useReader();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const menuRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [searchFocused]);

  // Close menu and search popover on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

        {/* Center: Search Field with Suggestions */}
        <div ref={searchContainerRef} style={{ flex: 1, maxWidth: '440px', position: 'relative' }}>
          <SearchInput
            id="dashboard-search"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                addRecentSearch(searchQuery);
                setSearchFocused(false);
              }
            }}
            onClear={() => {
              onSearchClear();
              setSearchFocused(false);
            }}
            placeholder="Search stories, topics, or writers..."
          />

          {/* Search Suggestions Popover */}
          {searchFocused && (
            <div
              className="quill-surface-card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                zIndex: 220,
                backgroundColor: '#FFFDFA',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                padding: 'var(--space-3)',
                animation: 'fadeIn var(--transition-fast)'
              }}
            >
              {/* 1. Recent Searches */}
              {recentSearches.length > 0 && (
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: 600 }}>
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        clearRecentSearches();
                        setRecentSearches([]);
                      }}
                      className="quill-btn-text"
                      style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}
                    >
                      Clear
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {recentSearches.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          onSearchChange(item);
                          addRecentSearch(item);
                          setSearchFocused(false);
                        }}
                        className="quill-chip quill-chip-compact"
                        style={{ fontSize: '0.76rem', padding: '0.15rem 0.5rem' }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Suggested Topics */}
              <div style={{ marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Topics
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {TOPICS.filter((t) => t !== 'All topics').map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        onSearchChange(topic);
                        addRecentSearch(topic);
                        setSearchFocused(false);
                      }}
                      className="quill-chip quill-chip-compact"
                      style={{ fontSize: '0.76rem', padding: '0.15rem 0.5rem' }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Featured Writers */}
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Writers
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {WRITERS.slice(0, 3).map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => {
                        onSearchChange(w.name);
                        addRecentSearch(w.name);
                        setSearchFocused(false);
                      }}
                      className="quill-btn-text"
                      style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', padding: '0.1rem 0.4rem' }}
                    >
                      {w.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Command Palette, Write action & Reader Avatar Menu */}
        <div className="quill-header-actions">
          {/* Quick Bookmarks Button */}
          <button
            type="button"
            onClick={() => onNavigate('/bookmarks')}
            className="quill-header-saved-btn"
            title={`Saved Bookmarks (${bookmarks.length})`}
            aria-label="View saved bookmarks"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span className="quill-saved-label">Saved</span>
            {bookmarks.length > 0 && (
              <span className="quill-saved-count">{bookmarks.length}</span>
            )}
          </button>

          {/* Quick Directory / Explore Modal Button */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="quill-command-btn"
              title="Explore & Quick Directory (Ctrl+K or /)"
              aria-label="Open quick directory"
            >
              <span className="quill-cmd-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.2" />
                </svg>
              </span>
              <span className="quill-cmd-label">Explore</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigate('/write')}
            className="quill-header-write-btn"
            aria-label="Write a story"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span className="quill-write-label">Write a story</span>
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
              <Avatar name={profilePreferences?.penName || 'Reader'} size="sm" />
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
                    {profilePreferences?.penName || 'Reader'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Local reading session
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: 'var(--space-1) 0' }} />

                {/* Profile Link */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onNavigate('/profile');
                  }}
                  className="quill-sidebar-nav-item"
                  style={{ fontSize: '0.88rem', padding: '0.5rem 0.75rem' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Reading Space & Stats</span>
                </button>

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
