import React, { useMemo } from 'react';
import CommunityHeader from '../components/community/CommunityHeader';
import CommunityLeftNav from '../components/community/CommunityLeftNav';
import StoryArtworkRenderer from '../components/editorial/StoryArtworkRenderer';
import { CURATED_COLLECTIONS, getCollectionBySlug } from '../data/collectionsData';
import { useReader } from '../hooks/useReader';
import Avatar from '../components/ui/Avatar';
import { Toast, ToastContainer } from '../components/ui/Toast';

export default function CollectionsPage({ slug, onNavigate }) {
  const { allPublishedStories, isBookmarked, toggleBookmark, toasts, dismissToast } = useReader();

  const collection = useMemo(() => {
    return getCollectionBySlug(slug) || CURATED_COLLECTIONS[0];
  }, [slug]);

  // Retrieve matching stories
  const matchedStories = useMemo(() => {
    if (!collection || !Array.isArray(collection.storyIds)) return [];
    return allPublishedStories.filter((s) => collection.storyIds.includes(s.id));
  }, [collection, allPublishedStories]);

  return (
    <div className="quill-app-shell" style={{ backgroundColor: 'var(--color-paper, #F8F5EE)', minHeight: '100vh' }}>
      {/* Community Header */}
      <CommunityHeader
        searchQuery=""
        onSearchChange={() => {}}
        onSearchClear={() => {}}
        onNavigate={onNavigate}
      />

      <div
        className="quill-dashboard-layout"
        style={{
          paddingTop: 'var(--space-8)',
          paddingBottom: 'var(--space-16)',
          alignItems: 'start'
        }}
      >
        {/* Left Nav */}
        <aside className="quill-dashboard-sidebar">
          <CommunityLeftNav
            activeRoute="/explore"
            onNavigate={onNavigate}
          />
        </aside>

        {/* Main Content Area */}
        <main className="quill-dashboard-main" style={{ minWidth: 0, gridColumn: 'span 2' }}>
          {/* Collection Hero Card */}
          <div
            className="quill-surface-card"
            style={{
              padding: 'var(--space-8)',
              backgroundColor: '#FFFDFA',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--space-8)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ maxWidth: '620px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <span className="text-eyebrow" style={{ color: 'var(--color-accent)' }}>
                  Curated Collection
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>·</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  {matchedStories.length} essays
                </span>
              </div>

              <h1 className="font-serif text-h1" style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
                {collection.title}
              </h1>

              <p className="text-body" style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.55 }}>
                {collection.description}
              </p>

              {collection.curatorNote && (
                <div
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderLeft: '3px solid var(--color-accent)',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    fontSize: '0.86rem',
                    color: 'var(--color-text-secondary)',
                    fontStyle: 'italic'
                  }}
                >
                  “{collection.curatorNote}”
                </div>
              )}
            </div>
          </div>

          {/* Stories Stream */}
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <h2 className="font-serif text-h3" style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)' }}>
              Essays in this collection
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {matchedStories.map((story) => {
                const bookmarked = isBookmarked(story.id);

                return (
                  <article
                    key={story.id}
                    className="quill-surface-card"
                    style={{
                      padding: 'var(--space-6)',
                      backgroundColor: '#FFFDFA',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      gap: 'var(--space-6)',
                      justifyContent: 'space-between',
                      alignItems: 'start'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                        <Avatar name={story.author?.name || 'Reader'} size="xs" />
                        <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                          {story.author?.name || 'Reader'}
                        </span>
                        <span>·</span>
                        <span>{story.date}</span>
                        <span>·</span>
                        <span className="quill-chip quill-chip-compact" style={{ padding: '0.1rem 0.5rem', fontSize: '0.74rem' }}>
                          {story.topic}
                        </span>
                      </div>

                      <h3
                        className="font-serif"
                        style={{
                          fontSize: '1.45rem',
                          color: 'var(--color-text-primary)',
                          cursor: 'pointer',
                          lineHeight: 1.3,
                          marginBottom: 'var(--space-2)'
                        }}
                        onClick={() => onNavigate(`/story/${story.slug}`)}
                      >
                        {story.title}
                      </h3>

                      <p style={{ fontSize: '0.94rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: 'var(--space-4)' }}>
                        {story.excerpt || story.subtitle}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <button
                          type="button"
                          onClick={() => onNavigate(`/story/${story.slug}`)}
                          className="quill-btn quill-btn-secondary"
                          style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', minHeight: '32px' }}
                        >
                          Read essay →
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleBookmark(story.id, story.title)}
                          className="quill-icon-btn quill-icon-btn-compact"
                          aria-label={bookmarked ? 'Remove from shelf' : 'Save to shelf'}
                          style={{
                            color: bookmarked ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                            backgroundColor: bookmarked ? 'var(--color-accent-soft)' : 'transparent'
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {story.artworkId && (
                      <div
                        style={{
                          width: '130px',
                          height: '110px',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: '1px solid var(--color-border)',
                          display: 'none'
                        }}
                        className="collection-story-artwork"
                      >
                        <StoryArtworkRenderer artworkId={story.artworkId} />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          {/* Other Curated Themes Directory */}
          <div
            style={{
              paddingTop: 'var(--space-8)',
              borderTop: '1px solid var(--color-border-subtle)'
            }}
          >
            <span className="text-eyebrow" style={{ color: 'var(--color-accent)' }}>
              Explore Other Themes
            </span>
            <h3 className="font-serif text-h3" style={{ color: 'var(--color-text-primary)', marginTop: '4px', marginBottom: 'var(--space-4)' }}>
              More Curated Collections
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
              {CURATED_COLLECTIONS.filter((c) => c.slug !== collection.slug).map((c) => (
                <div
                  key={c.slug}
                  className="quill-surface-card"
                  style={{
                    padding: 'var(--space-4)',
                    backgroundColor: '#FFFDFA',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onNavigate(`/collections/${c.slug}`)}
                >
                  <h4 className="font-serif" style={{ fontSize: '1.05rem', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    {c.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: '0 0 var(--space-3) 0' }}>
                    {c.subtitle}
                  </p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                    View collection →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

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
