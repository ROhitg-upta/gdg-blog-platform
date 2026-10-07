import React, { useState, useMemo, useEffect } from 'react';
import CommunityHeader from '../components/community/CommunityHeader';
import CommunityLeftNav from '../components/community/CommunityLeftNav';
import CommunityRightRail from '../components/community/CommunityRightRail';
import StoryArtworkRenderer from '../components/editorial/StoryArtworkRenderer';
import StoryPreviewModal from '../components/editorial/StoryPreviewModal';
import { getAllHydratedStories, TOPICS } from '../data/communityData';
import { useReader } from '../hooks/useReader';
import { Toast, ToastContainer } from '../components/ui/Toast';

export default function CommunityPage({ onNavigate, initialRoute = '/community' }) {
  const { bookmarks, followedWriterIds, isBookmarked, toggleBookmark, toasts, dismissToast, reader } = useReader();

  // Parse initial topic from URL query param if present
  const [selectedTopic, setSelectedTopic] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTopic = params.get('topic');
      if (urlTopic && TOPICS.includes(urlTopic)) {
        return urlTopic;
      }
    }
    return 'All topics';
  });

  const [activeTab, setActiveTab] = useState('for-you'); // 'for-you' | 'following' | 'latest'
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [selectedStory, setSelectedStory] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // All hydrated stories from community dataset
  const allStories = useMemo(() => getAllHydratedStories(), []);

  // Compute greeting based on local time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, reader.';
    if (hour < 18) return 'Good afternoon, reader.';
    return 'Good evening, reader.';
  }, []);

  // Reset pagination when search, tab, or topic filter changes
  useEffect(() => {
    setPageSize(5);
  }, [searchQuery, activeTab, selectedTopic]);

  // Sync topic from URL query params when location changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTopic = params.get('topic');
      if (urlTopic && TOPICS.includes(urlTopic)) {
        setSelectedTopic(urlTopic);
      }
    }
  }, []);

  // Filter and sort stories according to search, tab, and topic
  const filteredStories = useMemo(() => {
    return allStories.filter((story) => {
      // 1. Topic filter
      if (selectedTopic !== 'All topics' && story.topic !== selectedTopic) {
        return false;
      }

      // 2. Tab filter
      if (activeTab === 'following') {
        if (!followedWriterIds.includes(story.authorId)) {
          return false;
        }
      }

      // 3. Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = story.title.toLowerCase().includes(query);
        const matchExcerpt = story.excerpt.toLowerCase().includes(query);
        const matchAuthor = story.author.name.toLowerCase().includes(query);
        const matchTopic = story.topic.toLowerCase().includes(query);
        if (!matchTitle && !matchExcerpt && !matchAuthor && !matchTopic) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Tab sorting
      if (activeTab === 'latest') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return 0; // Default curated order
    });
  }, [allStories, selectedTopic, activeTab, followedWriterIds, searchQuery]);

  // Paginated visible slice
  const visibleStories = useMemo(() => {
    return filteredStories.slice(0, pageSize);
  }, [filteredStories, pageSize]);

  const hasMoreStories = visibleStories.length < filteredStories.length;

  // Restrained featured story (shown only when on 'For you', no active search query, and 'All topics')
  const featuredStory = useMemo(() => {
    if (searchQuery.trim() || selectedTopic !== 'All topics' || activeTab !== 'for-you') {
      return null;
    }
    return allStories.find((s) => s.featured) || allStories[0];
  }, [allStories, searchQuery, selectedTopic, activeTab]);

  // Stories for list (excluding featured story if displayed)
  const streamStories = useMemo(() => {
    if (featuredStory) {
      return visibleStories.filter((s) => s.id !== featuredStory.id);
    }
    return visibleStories;
  }, [visibleStories, featuredStory]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('All topics');
    setActiveTab('for-you');
  };

  const isExplorePage = initialRoute === '/explore';

  return (
    <div className="quill-app-shell" style={{ backgroundColor: 'var(--color-paper, #F8F5EE)', minHeight: '100vh' }}>
      {/* 1. Light Top Header */}
      <CommunityHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={() => setSearchQuery('')}
        onNavigate={onNavigate}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      {/* 2. Responsive 3-Column Dashboard Body */}
      <div
        className="quill-dashboard-layout"
        style={{
          paddingTop: 'var(--space-8)',
          paddingBottom: 'var(--space-16)',
          alignItems: 'start'
        }}
      >
        {/* Left Navigation Rail (~220px) */}
        <aside className="quill-dashboard-sidebar">
          <CommunityLeftNav
            activeRoute={initialRoute}
            selectedTopic={selectedTopic}
            onSelectTopic={(topic) => setSelectedTopic(topic)}
            onNavigate={onNavigate}
          />
        </aside>

        {/* Central Editorial Feed */}
        <main className="quill-dashboard-main" style={{ minWidth: 0 }}>
          {/* Greeting & Headline Section */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                {greeting}
              </span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="var(--color-accent)" aria-hidden="true">
                <path d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z" />
              </svg>
            </div>

            <h1 className="font-serif text-h1" style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              {isExplorePage ? 'Follow your curiosity.' : 'Your next great read.'}
            </h1>

            <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
              Ideas, experiences, and voices worth your time.
            </p>
          </div>

          {/* Feed Tabs: For you / Following / Latest */}
          <div className="quill-tab-list" role="tablist" aria-label="Feed segments" style={{ marginBottom: 'var(--space-5)' }}>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'for-you'}
              onClick={() => setActiveTab('for-you')}
              className={`quill-tab-btn ${activeTab === 'for-you' ? 'active' : ''}`}
            >
              For you
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'following'}
              onClick={() => setActiveTab('following')}
              className={`quill-tab-btn ${activeTab === 'following' ? 'active' : ''}`}
            >
              Following {followedWriterIds.length > 0 && `(${followedWriterIds.length})`}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'latest'}
              onClick={() => setActiveTab('latest')}
              className={`quill-tab-btn ${activeTab === 'latest' ? 'active' : ''}`}
            >
              Latest
            </button>
          </div>

          {/* Horizontal Topic Filter Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              overflowX: 'auto',
              paddingBottom: 'var(--space-4)',
              marginBottom: 'var(--space-4)',
              scrollbarWidth: 'none'
            }}
            role="toolbar"
            aria-label="Filter stories by topic"
          >
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`quill-chip ${isSelected ? 'selected' : ''}`}
                  style={{ flexShrink: 0 }}
                  aria-pressed={isSelected}
                >
                  {topic}
                </button>
              );
            })}
          </div>

          {/* Active Search Feedback Notice */}
          {searchQuery.trim() && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--color-surface-secondary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-6)',
                border: '1px solid var(--color-border)'
              }}
            >
              <span style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                Showing stories matching <strong>"{searchQuery}"</strong> ({filteredStories.length} found)
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="quill-btn-text"
                style={{ fontSize: '0.82rem', color: 'var(--color-accent)' }}
              >
                Clear search
              </button>
            </div>
          )}

          {/* 3. Featured Story Highlight (When available) */}
          {featuredStory && (
            <article className="quill-featured-story">
              <div
                className="quill-featured-story-cover"
                onClick={() => setSelectedStory(featuredStory)}
                style={{ cursor: 'pointer' }}
                aria-label={`Featured story: ${featuredStory.title}`}
              >
                <StoryArtworkRenderer artworkId={featuredStory.artworkId} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <span className="quill-chip quill-chip-compact selected">
                    {featuredStory.topic}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    {featuredStory.readingTime}
                  </span>
                </div>

                <h3
                  className="font-serif text-h2"
                  style={{
                    margin: 'var(--space-2) 0',
                    cursor: 'pointer',
                    color: 'var(--color-text-primary)',
                    lineHeight: 'var(--leading-snug)'
                  }}
                  onClick={() => setSelectedStory(featuredStory)}
                >
                  {featuredStory.title}
                </h3>

                <p
                  className="text-body-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--space-4)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {featuredStory.excerpt}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>
                    <span>By {featuredStory.author.name}</span>
                    <span style={{ margin: '0 6px' }}>·</span>
                    <span>{featuredStory.date}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleBookmark(featuredStory.id, featuredStory.title)}
                    className="quill-icon-btn quill-icon-btn-compact"
                    aria-label={isBookmarked(featuredStory.id) ? `Unsave ${featuredStory.title}` : `Save ${featuredStory.title}`}
                    style={{ color: isBookmarked(featuredStory.id) ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked(featuredStory.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* 4. Editorial Story Rows Stream */}
          {streamStories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {streamStories.map((story) => {
                const bookmarked = isBookmarked(story.id);
                return (
                  <article key={story.id} className="quill-feed-story">
                    <div className="quill-feed-story-content">
                      {/* Story Metadata */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                          {story.author.name}
                        </span>
                        <span>·</span>
                        <span>{story.date}</span>
                        <span>·</span>
                        <span className="quill-chip quill-chip-compact" style={{ padding: '0.1rem 0.5rem', fontSize: '0.74rem' }}>
                          {story.topic}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="quill-feed-story-title"
                        onClick={() => setSelectedStory(story)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedStory(story);
                          }
                        }}
                      >
                        {story.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="quill-feed-story-excerpt">
                        {story.excerpt}
                      </p>

                      {/* Footer Actions Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {story.readingTime}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedStory(story)}
                            className="quill-btn-text"
                            style={{ fontSize: '0.8rem', color: 'var(--color-accent)', padding: 0 }}
                          >
                            Read preview →
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleBookmark(story.id, story.title)}
                          className="quill-icon-btn quill-icon-btn-compact"
                          aria-label={bookmarked ? `Unsave ${story.title}` : `Save ${story.title}`}
                          style={{ color: bookmarked ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={bookmarked ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Artwork Cover Thumbnail */}
                    <div
                      className="quill-feed-story-artwork"
                      onClick={() => setSelectedStory(story)}
                      style={{ cursor: 'pointer' }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Preview story artwork: ${story.title}`}
                    >
                      <StoryArtworkRenderer artworkId={story.artworkId} />
                    </div>
                  </article>
                );
              })}

              {/* Load More Button */}
              {hasMoreStories && (
                <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
                  <button
                    type="button"
                    onClick={() => setPageSize((prev) => prev + 4)}
                    className="quill-btn quill-btn-secondary"
                    style={{ padding: '0.65rem 1.8rem', minHeight: '40px' }}
                  >
                    Load more stories ({filteredStories.length - visibleStories.length} remaining)
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="quill-empty-state">
              <svg className="quill-empty-art" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="48" cy="48" r="40" strokeDasharray="4 4" />
                <path d="M34 50 C38 42, 58 42, 62 50" strokeLinecap="round" />
                <circle cx="38" cy="38" r="3" fill="currentColor" />
                <circle cx="58" cy="38" r="3" fill="currentColor" />
              </svg>

              <h3 className="quill-empty-title">
                {activeTab === 'following'
                  ? 'No stories from followed writers yet'
                  : 'No stories found'}
              </h3>

              <p className="quill-empty-desc">
                {activeTab === 'following'
                  ? 'You aren’t following any writers yet. Explore recommended writers on the right to curate your stream.'
                  : 'Try another keyword, explore a different topic, or reset your filters.'}
              </p>

              <button
                type="button"
                onClick={handleResetFilters}
                className="quill-btn quill-btn-primary"
              >
                Reset filters
              </button>
            </div>
          )}
        </main>

        {/* Right Community Rail (~280px) */}
        <div className="quill-dashboard-rail">
          <CommunityRightRail
            onSelectStory={(story) => setSelectedStory(story)}
            onSelectTopic={(topic) => setSelectedTopic(topic)}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* Mobile Navigation Drawer Modal */}
      {mobileMenuOpen && (
        <div
          className="quill-modal-overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{ justifyContent: 'flex-start', padding: 0 }}
        >
          <div
            style={{
              backgroundColor: '#FFFDFA',
              width: '280px',
              height: '100%',
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                <span className="brand-wordmark" style={{ fontSize: '1.5rem' }}>
                  quill<span className="brand-dot">.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="quill-icon-btn quill-icon-btn-compact"
                  aria-label="Close menu"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="3" x2="13" y2="13" />
                    <line x1="3" y1="13" x2="13" y2="3" />
                  </svg>
                </button>
              </div>

              <CommunityLeftNav
                activeRoute={initialRoute}
                selectedTopic={selectedTopic}
                onSelectTopic={(t) => {
                  setSelectedTopic(t);
                  setMobileMenuOpen(false);
                }}
                onNavigate={(route) => {
                  setMobileMenuOpen(false);
                  onNavigate(route);
                }}
              />
            </div>

            <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Quill Editorial Community
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Story Preview Modal */}
      <StoryPreviewModal
        story={selectedStory}
        isOpen={Boolean(selectedStory)}
        onClose={() => setSelectedStory(null)}
      />

      {/* Toast Feedback Notifications */}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </div>
  );
}
