import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import StoryMosaic from '../components/StoryMosaic';
import ExploreTopics from '../components/ExploreTopics';
import EditorialInfo from '../components/EditorialInfo';
import Footer from '../components/Footer';
import StoryPreviewModal from '../components/editorial/StoryPreviewModal';
import { useReader } from '../hooks/useReader';

export default function LandingPage({ onNavigate }) {
  const { enterAsReader } = useReader();
  const [selectedStory, setSelectedStory] = useState(null);

  // Smooth scroll handler for anchor sections
  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // One-click entry into Community as a reader
  const handleContinueAsReader = () => {
    enterAsReader();
    onNavigate('/community');
  };

  // Navigate to community with an active topic filter
  const handleTopicNavigation = (topicName) => {
    enterAsReader();
    onNavigate(`/community?topic=${encodeURIComponent(topicName)}`);
  };

  return (
    <div className="quill-app-root">
      {/* Top Header with "Continue as reader" CTA */}
      <Header
        onNavClick={handleScrollToSection}
        onContinueReader={handleContinueAsReader}
        onStartWritingClick={() => onNavigate('/write')}
        onExploreClick={handleContinueAsReader}
      />

      {/* Main Landing Content Container */}
      <main className="quill-container">
        {/* Editorial Hero with Hand-drawn Underline */}
        <Hero
          onExploreClick={handleContinueAsReader}
          onShareStoryClick={() => onNavigate('/write')}
        />

        {/* 3-Card Editorial Story Mosaic with Local SVG Illustrations */}
        <StoryMosaic
          onSelectStory={(story) => setSelectedStory(story)}
        />

        {/* Topic Strip with Functional Direct Links to Community */}
        <ExploreTopics
          onSelectStory={(story) => setSelectedStory(story)}
          onNavigateTopic={handleTopicNavigation}
        />

        {/* Supporting Editorial Information ("Our Story" & "For Writers") */}
        <EditorialInfo
          onStartWritingClick={() => onNavigate('/write')}
          onExploreClick={handleContinueAsReader}
        />
      </main>

      {/* Site Footer */}
      <Footer onNavClick={handleScrollToSection} />

      {/* Accessible Reading Preview Dialog */}
      <StoryPreviewModal
        story={selectedStory}
        isOpen={Boolean(selectedStory)}
        onClose={() => setSelectedStory(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
