import React from 'react';
import StoryMeta from './StoryMeta';
import IconButton from '../ui/IconButton';

/**
 * FeedStoryItem:
 * Horizontal feed card designed for the central editorial community stream.
 */
export default function FeedStoryItem({
  story,
  onStoryClick,
  onBookmarkClick,
  isBookmarked = false,
  artwork = null,
  actions = null,
  className = ''
}) {
  const { title, excerpt, author, date, topic, readingTime } = story;

  return (
    <article className={`quill-feed-story ${className}`}>
      <div className="quill-feed-story-content">
        <StoryMeta
          author={author}
          date={date}
          topic={topic}
          readingTime={readingTime}
        />

        <h3
          className="quill-feed-story-title"
          onClick={() => onStoryClick && onStoryClick(story)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onStoryClick && onStoryClick(story);
            }
          }}
          role="link"
        >
          {title}
        </h3>

        {excerpt && (
          <p className="quill-feed-story-excerpt">
            {excerpt}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {actions}
          </div>

          {onBookmarkClick && (
            <IconButton
              label={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
              active={isBookmarked}
              size="compact"
              onClick={() => onBookmarkClick(story)}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              }
            />
          )}
        </div>
      </div>

      {artwork && (
        <div
          className="quill-feed-story-artwork"
          onClick={() => onStoryClick && onStoryClick(story)}
          style={{ cursor: onStoryClick ? 'pointer' : 'default' }}
        >
          {artwork}
        </div>
      )}
    </article>
  );
}
