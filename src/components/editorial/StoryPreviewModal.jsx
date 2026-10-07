import React from 'react';
import Modal from '../ui/Modal';
import { useReader } from '../../hooks/useReader';
import StoryArtworkRenderer from './StoryArtworkRenderer';
import Avatar from '../ui/Avatar';

export default function StoryPreviewModal({
  story,
  isOpen = false,
  onClose
}) {
  const { isBookmarked, toggleBookmark } = useReader();

  if (!story) return null;

  const authorName = story.author?.name || (typeof story.author === 'string' ? story.author : 'Quill Writer');
  const authorInitials = story.author?.initials || authorName.slice(0, 2).toUpperCase();
  const bookmarked = isBookmarked(story.id);

  const handleBookmarkClick = () => {
    toggleBookmark(story.id, story.title);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="680px"
      className="quill-story-preview-dialog"
    >
      <div className="story-preview-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <span className="quill-chip quill-chip-compact selected">
            {story.topic}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Story preview
          </span>
        </div>

        <h2
          className="font-serif"
          style={{
            fontSize: '1.75rem',
            lineHeight: 'var(--leading-snug)',
            color: 'var(--color-text-primary)',
            margin: 'var(--space-2) 0 var(--space-4) 0'
          }}
        >
          {story.title}
        </h2>

        {/* Author metadata row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 'var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
            marginBottom: 'var(--space-4)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Avatar name={authorName} size="sm" />
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {authorName}
              </span>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <span>{story.date || 'Curated essay'}</span>
                <span style={{ margin: '0 6px' }}>·</span>
                <span>{story.readingTime}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={bookmarked ? `Unsave ${story.title}` : `Save ${story.title}`}
            className={`quill-btn quill-btn-secondary ${bookmarked ? 'active' : ''}`}
            style={{
              padding: '0.45rem 0.95rem',
              minHeight: '34px',
              fontSize: '0.82rem',
              borderColor: bookmarked ? 'var(--color-accent)' : 'var(--color-border)',
              color: bookmarked ? 'var(--color-accent)' : 'var(--color-text-primary)',
              backgroundColor: bookmarked ? 'var(--color-accent-soft)' : 'var(--color-surface-card)'
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={bookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>{bookmarked ? 'Saved to shelf' : 'Save story'}</span>
          </button>
        </div>
      </div>

      {/* Artwork Banner */}
      {story.artworkId && (
        <div
          style={{
            width: '100%',
            height: '210px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: 'var(--space-5)',
            border: '1px solid var(--color-border)'
          }}
        >
          <StoryArtworkRenderer artworkId={story.artworkId} />
        </div>
      )}

      {/* Story Body Paragraphs */}
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1.02rem',
          lineHeight: '1.7',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}
      >
        {Array.isArray(story.previewContent) ? (
          story.previewContent.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))
        ) : Array.isArray(story.content) ? (
          story.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))
        ) : (
          <p>{story.excerpt || story.summary || 'A thoughtful essay curated for Quill readers.'}</p>
        )}
      </div>

      {/* Footer notice and close */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--color-border-subtle)'
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Full reading experience arrives in Module 4.
        </span>
        <button
          type="button"
          onClick={onClose}
          className="quill-btn quill-btn-secondary"
          style={{ padding: '0.45rem 1.1rem', minHeight: '36px', fontSize: '0.85rem' }}
        >
          Done reading
        </button>
      </div>
    </Modal>
  );
}
