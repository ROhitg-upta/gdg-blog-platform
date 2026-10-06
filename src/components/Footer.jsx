import React from 'react';

export default function Footer({ onNavClick }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="quill-container footer-inner">
        {/* Left Brand & Tagline */}
        <div className="footer-brand-side">
          <span className="brand-wordmark" style={{ fontSize: '1.65rem' }}>
            quill<span className="brand-dot">.</span>
          </span>
          <p className="footer-tagline">A little curiosity goes a long way.</p>
        </div>

        {/* Minimal Nav Links */}
        <nav className="footer-nav" aria-label="Footer Navigation">
          <button
            type="button"
            className="footer-link"
            onClick={() => onNavClick('explore')}
          >
            Explore
          </button>
          <button
            type="button"
            className="footer-link"
            onClick={() => onNavClick('our-story')}
          >
            Our story
          </button>
          <button
            type="button"
            className="footer-link"
            onClick={() => onNavClick('for-writers')}
          >
            For writers
          </button>
          <button
            type="button"
            className="footer-back-to-top"
            onClick={scrollToTop}
          >
            Top ↑
          </button>
        </nav>
      </div>
    </footer>
  );
}
