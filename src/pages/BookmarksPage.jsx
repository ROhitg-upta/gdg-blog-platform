import React, { useState, useMemo } from 'react';
import CommunityHeader from '../components/community/CommunityHeader';
import CommunityLeftNav from '../components/community/CommunityLeftNav';
import StoryArtworkRenderer from '../components/editorial/StoryArtworkRenderer';
import StoryPreviewModal from '../components/editorial/StoryPreviewModal';
import { getAllHydratedStories } from '../data/communityData';
import { useReader } from '../hooks/useReader';
import { Toast, ToastContainer } from '../components/ui/Toast';

export default function BookmarksPage({ onNavigate }) {
  const { bookmarks, toggleBookmark, toasts, dismissToast } = useReader();
  const [selectedStory, setSelectedStory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allStories = useMemo(() => getAllHydratedStories(), []);

  // Filter bookmarked stories
  const bookmarkedStories = useMemo(() => {
    return allStories.filter((story) => bookmarks.includes(story.id));
  }, [allStories, bookmarks]);

  // Optional search query inside bookmarks
  const filteredBookmarkedStories = useMemo(() => {
    if (!searchQuery.trim()) return bookmarkedStories;
    const q = searchQuery.toLowerCase().trim();
    return bookmarkedStories.filter((s) =>
      s.title.toLowerCase().includes(q) ||
      s.excerpt.toLowerCase().includes(q) ||
      s.author.name.toLowerCase().includes(q) ||
      s.topic.toLowerCase().includes(q)
    );
  }, [bookmarkedStories, searchQuery]);

  return (
    <div className="quill-app-shell" style={{ backgroundColor: 'var(--color-paper, #F8F5EE)', minHeight: '100vh' }}>
      {/* Light Top Header */}
      <CommunityHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={() => setSearchQuery('')}
        onNavigate={onNavigate}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      {/* Main Content Layout */}
      <div
        className="quill-dashboard-layout"
        style={{
          paddingTop: 'var(--space-8)',
          paddingBottom: 'var(--space-16)',
          alignItems: 'start'
        }}
      >
        {/* Left Navigation Rail */}
        <aside className="quill-dashboard-sidebar">
          <CommunityLeftNav
            activeRoute="/bookmarks"
            onNavigate={onNavigate}
          />
        </aside>

        {/* Bookmarks Stream */}
        <main className="quill-dashboard-main" style={{ minWidth: 0, gridColumn: 'span 2' }}>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <span className="text-eyebrow" style={{ color: 'var(--color-accent)' }}>
              Reading Shelf
            </span>
            <h1 className="font-serif text-h1" style={{ color: 'var(--color-text-primary)', marginTop: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
              Your Saved Bookmarks
            </h1>
            <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
              Essays and stories saved for focused contemplation.
            </p>
          </div>

          {filteredBookmarkedStories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredBookmarkedStories.map((story) => (
                <article key={story.id} className="quill-feed-story">
                  <div className="quill-feed-story-content">
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

                    <p className="quill-feed-story-excerpt">
                      {story.excerpt}
                    </p>

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
                        className="quill-btn quill-btn-secondary"
                        style={{
                          padding: '0.35rem 0.8rem',
                          minHeight: '30px',
                          fontSize: '0.78rem',
                          color: 'var(--color-accent)'
                        }}
                        aria-label={`Remove ${story.title} from bookmarks`}
                      >
                        Remove from shelf
                      </button>
                    </div>
                  </div>

                  <div
                    className="quill-feed-story-artwork"
                    onClick={() => setSelectedStory(story)}
                    style={{ cursor: 'pointer' }}
                  >
                    <StoryArtworkRenderer artworkId={story.artworkId} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="quill-empty-state">
              <svg className="quill-empty-art" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M28 20 C28 16, 32 12, 36 12 L68 12 C72 12, 76 16, 76 20 L76 84 L52 70 L28 84 Z" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="40" y1="32" x2="64" y2="32" strokeLinecap="round" />
                <line x1="40" y1="44" x2="56" y2="44" strokeLinecap="round" />
              </svg>

              <h3 className="quill-empty-title">
                Your reading shelf is empty
              </h3>

              <p className="quill-empty-desc">
                Save stories using the bookmark icon on any essay to build your personal reading list.
              </p>

              <button
                type="button"
                onClick={() => onNavigate('/community')}
                className="quill-btn quill-btn-primary"
              >
                Explore stories in Community →
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
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
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
              activeRoute="/bookmarks"
              onNavigate={(route) => {
                setMobileMenuOpen(false);
                onNavigate(route);
              }}
            />
          </div>
        </div>
      )}

      {/* Story Preview Modal */}
      <StoryPreviewModal
        story={selectedStory}
        isOpen={Boolean(selectedStory)}
        onClose={() => setSelectedStory(null)}
      />

      {/* Toasts */}
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
