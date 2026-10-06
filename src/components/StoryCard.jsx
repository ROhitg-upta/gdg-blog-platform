import React from 'react';
import {
  ArtworkLavenderBook,
  ArtworkArchitecturalPeach,
  ArtworkSunlitCorner
} from './ArtworkIllustrations';

export default function StoryCard({ story, onSelectStory }) {
  const { topic, title, author, readingTime, artworkType, rotationClass, isAnchor } = story;

  const renderArtwork = () => {
    switch (artworkType) {
      case 'book-lavender':
        return <ArtworkLavenderBook />;
      case 'architectural-peach':
        return <ArtworkArchitecturalPeach />;
      case 'sunlit-corner':
        return <ArtworkSunlitCorner />;
      default:
        return <ArtworkLavenderBook />;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectStory(story);
    }
  };

  return (
    <article
      className={`story-card ${rotationClass} ${isAnchor ? 'anchor-card' : ''}`}
      onClick={() => onSelectStory(story)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Read story preview: ${title} by ${author.name}`}
    >
      {/* Landscape Illustration */}
      <div className={`card-artwork-frame artwork-${artworkType.split('-')[1] || 'lavender'}`}>
        {renderArtwork()}
      </div>

      {/* Small uppercase topic label */}
      <span className="card-topic-tag">{topic}</span>

      {/* Editorial serif title */}
      <h3 className="card-title">{title}</h3>

      {/* Author & metadata row matching reference screenshot */}
      <div className="card-author-row">
        <div className="card-author-info">
          {author.avatarImage ? (
            <img
              src={author.avatarImage}
              alt={author.name}
              className="card-author-avatar-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div
              className="card-author-avatar"
              style={{
                backgroundColor: author.avatarBg || '#2B243D',
                color: author.avatarColor || '#E2DCEF'
              }}
              aria-hidden="true"
            >
              {/* Subtle minimal glyph in avatar */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <circle cx="6" cy="4" r="2.5" />
                <path d="M2 10.5 C2 8.5, 4 7.5, 6 7.5 C8 7.5, 10 8.5, 10 10.5 Z" />
              </svg>
            </div>
          )}

          {author.showDetails ? (
            <div className="card-author-text-group">
              <span className="card-author-name">{author.name}</span>
              <span className="card-author-dot">·</span>
              <span className="card-read-time">{readingTime}</span>
            </div>
          ) : (
            <span className="card-author-ellipsis" aria-hidden="true">
              ...
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
