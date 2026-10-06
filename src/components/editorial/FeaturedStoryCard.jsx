import React from 'react';
import StoryMeta from './StoryMeta';

/**
 * FeaturedStoryCard:
 * Larger editorial highlight card with leading artwork and CTA slot.
 */
export function FeaturedStoryCard({
  story,
  artwork,
  action,
  onStoryClick,
  className = ''
}) {
  const { title, excerpt, author, date, topic, readingTime } = story;

  return (
    <article className={`quill-featured-story ${className}`}>
      {artwork && (
        <div
          className="quill-featured-story-cover"
          onClick={() => onStoryClick && onStoryClick(story)}
          style={{ cursor: onStoryClick ? 'pointer' : 'default' }}
        >
          {artwork}
        </div>
      )}

      <div>
        <StoryMeta
          author={author}
          date={date}
          topic={topic}
          readingTime={readingTime}
        />

        <h3
          className="text-h2 font-serif"
          style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-2)', cursor: 'pointer' }}
          onClick={() => onStoryClick && onStoryClick(story)}
        >
          {title}
        </h3>

        {excerpt && (
          <p className="text-body" style={{ marginBottom: 'var(--space-4)' }}>
            {excerpt}
          </p>
        )}

        {action && <div>{action}</div>}
      </div>
    </article>
  );
}

/**
 * CompactStoryLink:
 * Minimalist entry for sidebars and "Community Picks".
 */
export function CompactStoryLink({
  story,
  index = null,
  onStoryClick,
  className = ''
}) {
  const { title, author } = story;

  return (
    <div className={`quill-compact-story ${className}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {index !== null && (
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            0{index}
          </span>
        )}
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          {author.name}
        </span>
      </div>

      <h4
        className="quill-compact-story-title"
        onClick={() => onStoryClick && onStoryClick(story)}
        style={{ cursor: 'pointer' }}
      >
        {title}
      </h4>
    </div>
  );
}
