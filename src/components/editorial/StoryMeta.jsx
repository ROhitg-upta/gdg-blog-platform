import React from 'react';
import Avatar from '../ui/Avatar';

/**
 * StoryMeta:
 * Reusable metadata row displaying author, publication date, topic, and reading duration.
 */
export default function StoryMeta({
  author = { name: 'Anonymous', avatar: '' },
  date = 'Oct 6',
  topic = '',
  readingTime = '4 min read',
  compact = false,
  className = ''
}) {
  return (
    <div className={`quill-story-meta ${className}`}>
      <Avatar
        src={author.avatar}
        name={author.name}
        size={compact ? 'xs' : 'sm'}
      />

      <span className="quill-story-meta-author">{author.name}</span>

      {date && (
        <>
          <span className="quill-story-meta-dot" aria-hidden="true">·</span>
          <span>{date}</span>
        </>
      )}

      {topic && (
        <>
          <span className="quill-story-meta-dot" aria-hidden="true">·</span>
          <span className="quill-story-meta-topic">{topic}</span>
        </>
      )}

      {readingTime && (
        <>
          <span className="quill-story-meta-dot" aria-hidden="true">·</span>
          <span>{readingTime}</span>
        </>
      )}
    </div>
  );
}
