import React, { useState, useEffect } from 'react';

export default function Header({
  onNavClick,
  onContinueReader,
  onStartWritingClick,
  onExploreClick
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleMobileNav = (targetId) => {
    setMobileMenuOpen(false);
    if (targetId === 'explore' && onExploreClick) {
      onExploreClick();
    } else {
      onNavClick(targetId);
    }
  };

  return (
    <header className="site-header">
      <div className="quill-container header-inner">
        {/* Brand Wordmark */}
        <a
          href="#top"
          className="brand-wordmark"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="quill. — Return to top"
        >
          quill<span className="brand-dot">.</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="nav-center" aria-label="Main Navigation">
          <button
            type="button"
            className="nav-link"
            onClick={() => {
              if (onExploreClick) onExploreClick();
              else onNavClick('explore');
            }}
          >
            Explore
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => onNavClick('our-story')}
          >
            Our story
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => onNavClick('for-writers')}
          >
            For writers
          </button>
        </nav>

        {/* Desktop Right Actions */}
        <div className="nav-right">
          <button
            type="button"
            className="btn-sign-in"
            onClick={onContinueReader}
            aria-label="Continue to community as reader"
          >
            Continue as reader
          </button>
          <button
            type="button"
            className="btn-start-writing"
            onClick={onStartWritingClick}
          >
            Start writing
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="4" y1="16" x2="16" y2="4" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="17" y2="6" />
              <line x1="3" y1="14" x2="17" y2="14" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Expandable Navigation Panel */}
      <div
        id="mobile-nav-panel"
        className={`mobile-nav-panel ${mobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          className="nav-link"
          onClick={() => handleMobileNav('explore')}
        >
          Explore
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => handleMobileNav('our-story')}
        >
          Our story
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => handleMobileNav('for-writers')}
        >
          For writers
        </button>

        <div className="mobile-actions">
          <button
            type="button"
            className="btn-sign-in"
            style={{ textAlign: 'left', padding: '0.5rem 0' }}
            onClick={() => {
              setMobileMenuOpen(false);
              onContinueReader();
            }}
          >
            Continue as reader
          </button>
          <button
            type="button"
            className="btn-start-writing"
            onClick={() => {
              setMobileMenuOpen(false);
              onStartWritingClick();
            }}
          >
            Start writing
          </button>
        </div>
      </div>
    </header>
  );
}
