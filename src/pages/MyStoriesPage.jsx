import React, { useState, useMemo } from 'react';
import CommunityHeader from '../components/community/CommunityHeader';
import CommunityLeftNav from '../components/community/CommunityLeftNav';
import StoryArtworkRenderer from '../components/editorial/StoryArtworkRenderer';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useReader } from '../hooks/useReader';
import { Toast, ToastContainer } from '../components/ui/Toast';

export default function MyStoriesPage({ onNavigate }) {
  const {
    userStories,
    archiveStory,
    restoreStory,
    deleteStory,
    toasts,
    dismissToast
  } = useReader();

  const [activeTab, setActiveTab] = useState('drafts'); // 'drafts' | 'published' | 'archived'
  const [searchQuery, setSearchQuery] = useState('');
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Group stories by status
  const drafts = useMemo(() => {
    return userStories.filter((s) => s.status === 'draft');
  }, [userStories]);

  const published = useMemo(() => {
    return userStories.filter((s) => s.status === 'published');
  }, [userStories]);

  const archived = useMemo(() => {
    return userStories.filter((s) => s.status === 'archived');
  }, [userStories]);

  // Current tab items
  const currentTabStories = useMemo(() => {
    let list = [];
    if (activeTab === 'drafts') list = drafts;
    else if (activeTab === 'published') list = published;
    else if (activeTab === 'archived') list = archived;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (s) =>
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.excerpt && s.excerpt.toLowerCase().includes(q)) ||
        (s.topic && s.topic.toLowerCase().includes(q))
    );
  }, [activeTab, drafts, published, archived, searchQuery]);

  const handleDeleteConfirm = () => {
    if (storyToDelete) {
      deleteStory(storyToDelete.id);
      setStoryToDelete(null);
    }
  };

  return (
    <div
      className="quill-app-shell"
      style={{ backgroundColor: 'var(--color-paper, #F8F5EE)', minHeight: '100vh' }}
    >
      {/* Light Top Header */}
      <CommunityHeader
        searchQuery=""
        onSearchChange={() => {}}
        onSearchClear={() => {}}
        onNavigate={onNavigate}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

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
            activeRoute="/my-stories"
            onNavigate={onNavigate}
          />
        </aside>

        {/* Main Content Area */}
        <main
          className="quill-dashboard-main"
          style={{ minWidth: 0, gridColumn: 'span 2' }}
        >
          {/* Header Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-8)'
            }}
          >
            <div>
              <span className="text-eyebrow" style={{ color: 'var(--color-accent)' }}>
                Personal Library
              </span>
              <h1
                className="font-serif text-h1"
                style={{
                  color: 'var(--color-text-primary)',
                  marginTop: 'var(--space-1)',
                  marginBottom: 'var(--space-2)'
                }}
              >
                Your words, gathered here.
              </h1>
              <p
                className="text-body"
                style={{ color: 'var(--color-text-secondary)', maxWidth: '540px' }}
              >
                Draft, refine, and keep the stories that are yours. Persisted safely on this device.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/write')}
              className="quill-btn quill-btn-primary"
              style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem' }}
            >
              + Write a new story
            </button>
          </div>

          {/* Tabs and Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: 'var(--space-2)',
              marginBottom: 'var(--space-6)',
              flexWrap: 'wrap',
              gap: 'var(--space-4)'
            }}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 'var(--space-2)' }} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'drafts'}
                onClick={() => setActiveTab('drafts')}
                className={`quill-feed-tab ${activeTab === 'drafts' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: '0.95rem',
                  fontWeight: activeTab === 'drafts' ? 600 : 500,
                  color: activeTab === 'drafts' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  borderBottom: activeTab === 'drafts' ? '2px solid var(--color-accent)' : '2px solid transparent'
                }}
              >
                <span>Drafts</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: activeTab === 'drafts' ? 'var(--color-accent-soft)' : 'var(--color-surface-secondary)',
                    color: activeTab === 'drafts' ? 'var(--color-accent)' : 'var(--color-text-muted)'
                  }}
                >
                  {drafts.length}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'published'}
                onClick={() => setActiveTab('published')}
                className={`quill-feed-tab ${activeTab === 'published' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: '0.95rem',
                  fontWeight: activeTab === 'published' ? 600 : 500,
                  color: activeTab === 'published' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  borderBottom: activeTab === 'published' ? '2px solid var(--color-accent)' : '2px solid transparent'
                }}
              >
                <span>Published</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: activeTab === 'published' ? 'var(--color-accent-soft)' : 'var(--color-surface-secondary)',
                    color: activeTab === 'published' ? 'var(--color-accent)' : 'var(--color-text-muted)'
                  }}
                >
                  {published.length}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'archived'}
                onClick={() => setActiveTab('archived')}
                className={`quill-feed-tab ${activeTab === 'archived' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: '0.95rem',
                  fontWeight: activeTab === 'archived' ? 600 : 500,
                  color: activeTab === 'archived' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  borderBottom: activeTab === 'archived' ? '2px solid var(--color-accent)' : '2px solid transparent'
                }}
              >
                <span>Archived</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: activeTab === 'archived' ? 'var(--color-accent-soft)' : 'var(--color-surface-secondary)',
                    color: activeTab === 'archived' ? 'var(--color-accent)' : 'var(--color-text-muted)'
                  }}
                >
                  {archived.length}
                </span>
              </button>
            </div>

            {/* Quick Filter Input */}
            <div style={{ maxWidth: '240px', width: '100%' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter stories..."
                className="quill-input"
                style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
              />
            </div>
          </div>

          {/* Story Cards List */}
          {currentTabStories.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFDFA',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-12) var(--space-4)',
                textAlign: 'center'
              }}
            >
              {activeTab === 'drafts' && (
                <>
                  <h2 className="font-serif text-h3" style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                    No drafts yet.
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: '420px', margin: '0 auto var(--space-6) auto' }}>
                    A small beginning is still a beginning. Your drafts are autosaved locally as you type.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('/write')}
                    className="quill-btn quill-btn-primary"
                  >
                    Write your first story
                  </button>
                </>
              )}

              {activeTab === 'published' && (
                <>
                  <h2 className="font-serif text-h3" style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                    Nothing published yet.
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: '420px', margin: '0 auto var(--space-6) auto' }}>
                    When you are ready, your words can live here and across the Community feed.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('/write')}
                    className="quill-btn quill-btn-primary"
                  >
                    Start writing
                  </button>
                </>
              )}

              {activeTab === 'archived' && (
                <>
                  <h2 className="font-serif text-h3" style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                    Your archive is quiet.
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
                    Stories you set aside will appear here. You can restore them whenever you wish.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {currentTabStories.map((story) => {
                const updatedDate = new Date(story.updatedAt || story.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <article
                    key={story.id}
                    className="quill-surface-card"
                    style={{
                      padding: 'var(--space-5)',
                      display: 'grid',
                      gridTemplateColumns: '140px minmax(0, 1fr)',
                      gap: 'var(--space-5)',
                      alignItems: 'start',
                      transition: 'border-color var(--transition-fast)'
                    }}
                  >
                    {/* Cover Thumbnail */}
                    <div
                      style={{
                        width: '140px',
                        height: '110px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        backgroundColor: 'var(--color-surface-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <div style={{ width: '100%', height: '100%', transform: 'scale(0.85)', transformOrigin: 'center' }}>
                        <StoryArtworkRenderer artworkId={story.artworkId || 'portal'} />
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                      <div>
                        {/* Header Row: Topic & Status Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                          <span className="quill-chip quill-chip-compact selected">
                            {story.topic || 'Writing'}
                          </span>

                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              padding: '1px 7px',
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor:
                                story.status === 'published'
                                  ? 'var(--color-success-soft)'
                                  : story.status === 'archived'
                                  ? 'var(--color-surface-secondary)'
                                  : 'var(--color-warning-soft)',
                              color:
                                story.status === 'published'
                                  ? 'var(--color-success)'
                                  : story.status === 'archived'
                                  ? 'var(--color-text-muted)'
                                  : 'var(--color-warning)'
                            }}
                          >
                            {story.status}
                          </span>

                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                            Updated {updatedDate} · {story.readTime || `${story.readingTime || 1} min read`}
                          </span>
                        </div>

                        {/* Title */}
                        <h2
                          className="font-serif"
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                            marginBottom: 'var(--space-1)',
                            lineHeight: 1.3
                          }}
                        >
                          {story.title || 'Untitled Draft'}
                        </h2>

                        {/* Excerpt */}
                        <p
                          style={{
                            fontSize: '0.88rem',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.45,
                            marginBottom: 'var(--space-4)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {story.excerpt || story.subtitle || 'No excerpt provided.'}
                        </p>
                      </div>

                      {/* Action Bar */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          flexWrap: 'wrap',
                          paddingTop: 'var(--space-3)',
                          borderTop: '1px solid var(--color-border-subtle)'
                        }}
                      >
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => onNavigate(`/write/${story.id}/edit`)}
                          className="quill-btn quill-btn-secondary"
                          style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem', minHeight: '32px' }}
                        >
                          {story.status === 'draft' ? 'Continue writing' : 'Edit story'}
                        </button>

                        {/* Public Link (if published) */}
                        {story.status === 'published' && (
                          <button
                            type="button"
                            onClick={() => onNavigate(`/story/${story.slug}`)}
                            className="quill-btn quill-btn-secondary"
                            style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem', minHeight: '32px' }}
                          >
                            View published story ↗
                          </button>
                        )}

                        {/* Preview Button */}
                        <button
                          type="button"
                          onClick={() => onNavigate(`/write/${story.id}/preview`)}
                          className="quill-btn quill-btn-ghost"
                          style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem', minHeight: '32px' }}
                        >
                          Preview
                        </button>

                        {/* Archive / Restore Button */}
                        {story.status !== 'archived' ? (
                          <button
                            type="button"
                            onClick={() => archiveStory(story.id)}
                            className="quill-btn quill-btn-ghost"
                            style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem', minHeight: '32px' }}
                          >
                            Archive
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => restoreStory(story.id, story.publishedAt ? 'published' : 'draft')}
                            className="quill-btn quill-btn-ghost"
                            style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem', minHeight: '32px' }}
                          >
                            Restore
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setStoryToDelete(story)}
                          className="quill-btn quill-btn-text"
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--color-error)',
                            marginLeft: 'auto',
                            padding: '0.35rem 0.65rem'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex'
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(30, 28, 26, 0.45)',
              backdropFilter: 'blur(2px)'
            }}
          />

          {/* Drawer Sheet */}
          <div
            style={{
              position: 'relative',
              width: '82%',
              maxWidth: '300px',
              height: '100%',
              backgroundColor: '#FFFDFA',
              boxShadow: 'var(--shadow-lg)',
              padding: 'var(--space-6) var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: 1
            }}
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
                  aria-label="Close navigation"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="3" x2="13" y2="13" />
                    <line x1="3" y1="13" x2="13" y2="3" />
                  </svg>
                </button>
              </div>

              <CommunityLeftNav
                activeRoute="/my-stories"
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

      {/* Named Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(storyToDelete)}
        onClose={() => setStoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={storyToDelete ? `Delete "${storyToDelete.title || 'Untitled Story'}"?` : 'Delete story?'}
        description="This will permanently remove this story from your browser's local library. This action cannot be undone."
        confirmLabel="Permanently delete"
        cancelLabel="Keep story"
        destructive={true}
      />

      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </ToastContainer>
    </div>
  );
}
