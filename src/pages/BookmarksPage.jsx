import React, { useState, useMemo } from 'react';
import CommunityHeader from '../components/community/CommunityHeader';
import CommunityLeftNav from '../components/community/CommunityLeftNav';
import StoryArtworkRenderer from '../components/editorial/StoryArtworkRenderer';
import StoryPreviewModal from '../components/editorial/StoryPreviewModal';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useReader } from '../hooks/useReader';
import { Toast, ToastContainer } from '../components/ui/Toast';

export default function BookmarksPage({ onNavigate }) {
  const {
    bookmarks,
    toggleBookmark,
    bookmarkCollections,
    createShelf,
    deleteShelf,
    toggleStoryInShelf,
    toasts,
    dismissToast,
    showToast,
    allPublishedStories
  } = useReader();

  const [activeShelfId, setActiveShelfId] = useState('all'); // 'all' | shelfId
  const [selectedStory, setSelectedStory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // New Shelf Modal state
  const [newShelfModalOpen, setNewShelfModalOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState('');
  const [newShelfDesc, setNewShelfDesc] = useState('');

  // Delete shelf state
  const [shelfToDelete, setShelfToDelete] = useState(null);

  // Organize story in shelves modal
  const [organizeStory, setOrganizeStory] = useState(null);

  const allStories = allPublishedStories || [];

  // Active collection object if custom shelf selected
  const activeCustomShelf = useMemo(() => {
    if (activeShelfId === 'all') return null;
    return bookmarkCollections.find((c) => c.id === activeShelfId) || null;
  }, [activeShelfId, bookmarkCollections]);

  // Base list of stories for current shelf
  const currentShelfStories = useMemo(() => {
    if (activeShelfId === 'all') {
      return allStories.filter((story) => bookmarks.includes(story.id));
    }
    if (activeCustomShelf) {
      return allStories.filter((story) => (activeCustomShelf.storyIds || []).includes(story.id));
    }
    return [];
  }, [allStories, bookmarks, activeShelfId, activeCustomShelf]);

  // Optional search query inside current shelf
  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) return currentShelfStories;
    const q = searchQuery.toLowerCase().trim();
    return currentShelfStories.filter((s) =>
      (s.title || '').toLowerCase().includes(q) ||
      (s.excerpt || s.subtitle || '').toLowerCase().includes(q) ||
      (s.author?.name || 'Reader').toLowerCase().includes(q) ||
      (s.topic || '').toLowerCase().includes(q)
    );
  }, [currentShelfStories, searchQuery]);

  const handleCreateShelf = (e) => {
    e.preventDefault();
    if (!newShelfName.trim()) return;

    const created = createShelf(newShelfName, newShelfDesc);
    if (created) {
      setNewShelfModalOpen(false);
      setNewShelfName('');
      setNewShelfDesc('');
      setActiveShelfId(created.id);
    }
  };

  const handleConfirmDeleteShelf = () => {
    if (shelfToDelete) {
      deleteShelf(shelfToDelete.id);
      setActiveShelfId('all');
      setShelfToDelete(null);
    }
  };

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
          {/* Header Banner */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <span className="text-eyebrow" style={{ color: 'var(--color-accent)' }}>
              Personal Reading Desk
            </span>
            <h1 className="font-serif text-h1" style={{ color: 'var(--color-text-primary)', marginTop: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
              Reading Shelves
            </h1>
            <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
              Organize essays and reflections into custom personal collections.
            </p>
          </div>

          {/* Shelves Tabs Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: 'var(--space-6)',
              overflowX: 'auto',
              gap: 'var(--space-4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button
                type="button"
                onClick={() => setActiveShelfId('all')}
                className={`quill-tab-btn ${activeShelfId === 'all' ? 'active' : ''}`}
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.88rem' }}
              >
                All Saved ({bookmarks.length})
              </button>

              {bookmarkCollections.map((col) => {
                const isSelected = activeShelfId === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setActiveShelfId(col.id)}
                    className={`quill-tab-btn ${isSelected ? 'active' : ''}`}
                    style={{ padding: '0.5rem 0.9rem', fontSize: '0.88rem' }}
                  >
                    {col.name} ({(col.storyIds || []).length})
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setNewShelfModalOpen(true)}
              className="quill-btn quill-btn-secondary"
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', minHeight: '30px', flexShrink: 0 }}
            >
              + New shelf
            </button>
          </div>

          {/* Active Shelf Metadata Banner (if viewing a custom shelf) */}
          {activeCustomShelf && (
            <div
              style={{
                padding: 'var(--space-4) var(--space-5)',
                backgroundColor: 'var(--color-surface-secondary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-6)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-3)'
              }}
            >
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', margin: '0 0 2px 0' }}>
                  {activeCustomShelf.name}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {activeCustomShelf.description || 'Personal reading shelf in this browser.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShelfToDelete(activeCustomShelf)}
                className="quill-btn-text"
                style={{ fontSize: '0.78rem', color: 'var(--color-error)' }}
              >
                Delete this shelf
              </button>
            </div>
          )}

          {/* Stories List */}
          {filteredStories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredStories.map((story) => (
                <article key={story.id} className="quill-feed-story">
                  <div className="quill-feed-story-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
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
                      className="quill-feed-story-title"
                      onClick={() => onNavigate(`/story/${story.slug}`)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onNavigate(`/story/${story.slug}`);
                        }
                      }}
                    >
                      {story.title}
                    </h3>

                    <p className="quill-feed-story-excerpt">
                      {story.excerpt || story.subtitle}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {story.readingTime || story.readTime}
                        </span>
                        <button
                          type="button"
                          onClick={() => onNavigate(`/story/${story.slug}`)}
                          className="quill-btn-text"
                          style={{ fontSize: '0.8rem', color: 'var(--color-accent)', padding: 0 }}
                        >
                          Read story →
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedStory(story)}
                          className="quill-btn-text"
                          style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', padding: '0 4px' }}
                        >
                          Preview
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <button
                          type="button"
                          onClick={() => setOrganizeStory(story)}
                          className="quill-btn quill-btn-secondary"
                          style={{
                            padding: '0.3rem 0.75rem',
                            minHeight: '28px',
                            fontSize: '0.76rem'
                          }}
                        >
                          Organize in shelves...
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleBookmark(story.id, story.title)}
                          className="quill-btn quill-btn-secondary"
                          style={{
                            padding: '0.3rem 0.75rem',
                            minHeight: '28px',
                            fontSize: '0.76rem',
                            color: 'var(--color-accent)'
                          }}
                          aria-label={`Remove ${story.title} from bookmarks`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {story.artworkId && (
                    <div
                      className="quill-feed-story-artwork"
                      onClick={() => onNavigate(`/story/${story.slug}`)}
                      style={{ cursor: 'pointer' }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Read story: ${story.title}`}
                    >
                      <StoryArtworkRenderer artworkId={story.artworkId} />
                    </div>
                  )}
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
                {activeCustomShelf ? `"${activeCustomShelf.name}" is empty` : 'Your reading shelf is empty'}
              </h3>

              <p className="quill-empty-desc">
                {activeCustomShelf
                  ? 'Add stories to this custom shelf by clicking "Organize in shelves..." on any saved essay.'
                  : 'Save stories using the bookmark icon on any essay to build your personal reading list.'}
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

      {/* Modal: Create New Shelf */}
      <Modal
        isOpen={newShelfModalOpen}
        onClose={() => setNewShelfModalOpen(false)}
        title="Create personal reading shelf"
      >
        <form onSubmit={handleCreateShelf} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              Shelf name *
            </label>
            <input
              type="text"
              value={newShelfName}
              onChange={(e) => setNewShelfName(e.target.value)}
              placeholder="e.g. Weekend reads, Design ideas, Deep focus"
              required
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-card)',
                color: 'var(--color-text-primary)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              Description (optional)
            </label>
            <textarea
              value={newShelfDesc}
              onChange={(e) => setNewShelfDesc(e.target.value)}
              placeholder="A short note explaining what belongs in this collection..."
              rows={3}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-card)',
                color: 'var(--color-text-primary)',
                fontSize: '0.9rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <button
              type="button"
              onClick={() => setNewShelfModalOpen(false)}
              className="quill-btn quill-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newShelfName.trim()}
              className="quill-btn quill-btn-primary"
            >
              Create shelf
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Organize Story in Shelves */}
      {organizeStory && (
        <Modal
          isOpen={Boolean(organizeStory)}
          onClose={() => setOrganizeStory(null)}
          title={`Organize "${organizeStory.title}"`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Select which reading shelves this essay belongs to:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {bookmarkCollections.map((shelf) => {
                const isInShelf = (shelf.storyIds || []).includes(organizeStory.id);
                return (
                  <label
                    key={shelf.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3)',
                      backgroundColor: 'var(--color-surface-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isInShelf}
                      onChange={() => toggleStoryInShelf(shelf.id, organizeStory.id, organizeStory.title)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent)' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {shelf.name}
                      </div>
                      {shelf.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {shelf.description}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
              <button
                type="button"
                onClick={() => setOrganizeStory(null)}
                className="quill-btn quill-btn-primary"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Shelf Dialog */}
      <ConfirmDialog
        isOpen={Boolean(shelfToDelete)}
        title={`Delete shelf "${shelfToDelete?.name}"?`}
        message="This will remove the collection shelf. The stories and bookmarks inside will not be deleted."
        confirmLabel="Delete shelf"
        cancelLabel="Keep shelf"
        isDestructive={true}
        onConfirm={handleConfirmDeleteShelf}
        onCancel={() => setShelfToDelete(null)}
      />

      {/* Story Preview Modal */}
      <StoryPreviewModal
        story={selectedStory}
        isOpen={Boolean(selectedStory)}
        onClose={() => setSelectedStory(null)}
        onNavigate={onNavigate}
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
