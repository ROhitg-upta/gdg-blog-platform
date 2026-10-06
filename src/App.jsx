import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StoryMosaic from './components/StoryMosaic';
import ExploreTopics from './components/ExploreTopics';
import EditorialInfo from './components/EditorialInfo';
import Footer from './components/Footer';
import ReadingModal from './components/ReadingModal';
import ActionNoticeModal from './components/ActionNoticeModal';
import DesignSystemPreview from './pages/DesignSystemPreview';

export default function App() {
  const [readingStory, setReadingStory] = useState(null);
  const [actionModalType, setActionModalType] = useState(null); // 'signin' | 'write' | 'share' | null
  const [showDesignSystem, setShowDesignSystem] = useState(
    typeof window !== 'undefined' &&
    (window.location.pathname === '/design-system' || window.location.hash === '#/design-system')
  );

  useEffect(() => {
    const handlePopState = () => {
      setShowDesignSystem(
        window.location.pathname === '/design-system' || window.location.hash === '#/design-system'
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Smooth scroll handler for anchor sections
  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Route to Design System Showcase if requested
  if (showDesignSystem) {
    return (
      <DesignSystemPreview
        onBackToApp={() => {
          setShowDesignSystem(false);
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  return (
    <div className="quill-app-root">
      {/* Refined Navigation Bar */}
      <Header
        onNavClick={handleScrollToSection}
        onSignInClick={() => setActionModalType('signin')}
        onStartWritingClick={() => setActionModalType('write')}
      />

      {/* Main Content Area */}
      <main className="quill-container">
        {/* Centered Editorial Hero */}
        <Hero
          onExploreClick={() => handleScrollToSection('explore')}
          onShareStoryClick={() => setActionModalType('share')}
        />

        {/* 3-Card Editorial Story Mosaic with Restrained Decorations */}
        <StoryMosaic onSelectStory={(story) => setReadingStory(story)} />

        {/* Explore Section with Functional Topic Tabs */}
        <ExploreTopics onSelectStory={(story) => setReadingStory(story)} />

        {/* Supporting Editorial Information (Our Story & For Writers) */}
        <EditorialInfo
          onStartWritingClick={() => setActionModalType('write')}
          onExploreClick={() => handleScrollToSection('explore')}
        />
      </main>

      {/* Site Footer */}
      <Footer onNavClick={handleScrollToSection} />

      {/* Accessible Reading Preview Modal */}
      {readingStory && (
        <ReadingModal
          story={readingStory}
          onClose={() => setReadingStory(null)}
        />
      )}

      {/* Accessible Action Notice Modal (Sign In / Editor Coming Soon) */}
      {actionModalType && (
        <ActionNoticeModal
          type={actionModalType}
          onClose={() => setActionModalType(null)}
        />
      )}

      {/* Internal Design System Preview Floating Quick Switcher */}
      <button
        type="button"
        onClick={() => {
          setShowDesignSystem(true);
          window.history.pushState({}, '', '/design-system');
        }}
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          backgroundColor: '#141310',
          color: '#35B84B',
          border: '1px solid rgba(53, 184, 75, 0.4)',
          borderRadius: '9999px',
          padding: '0.45rem 0.95rem',
          fontSize: '0.78rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          cursor: 'pointer'
        }}
        title="Open Module 1 Design System Preview (/design-system)"
      >
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#35B84B' }} />
        <span>Design System Preview</span>
      </button>
    </div>
  );
}
