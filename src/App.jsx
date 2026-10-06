import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StoryMosaic from './components/StoryMosaic';
import ExploreTopics from './components/ExploreTopics';
import EditorialInfo from './components/EditorialInfo';
import Footer from './components/Footer';
import ReadingModal from './components/ReadingModal';
import ActionNoticeModal from './components/ActionNoticeModal';

export default function App() {
  const [readingStory, setReadingStory] = useState(null);
  const [actionModalType, setActionModalType] = useState(null); // 'signin' | 'write' | 'share' | null

  // Smooth scroll handler for anchor sections
  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    </div>
  );
}
