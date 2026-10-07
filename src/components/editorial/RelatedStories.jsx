import React from 'react';
import StoryArtworkRenderer from './StoryArtworkRenderer';

export default function RelatedStories({
  stories = [],
  onNavigate
}) {
  if (!stories || stories.length === 0) return null;

  return (
    <section
      aria-label="Related stories"
      style={{
        marginTop: 'var(--space-12)',
        paddingTop: 'var(--space-10)',
        borderTop: '1px solid var(--color-border)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
        <div>
          <span className="text-eyebrow" style={{ color: 'var(--color-accent)' }}>
            Continue wandering
          </span>
          <h3 className="font-serif text-h3" style={{ color: 'var(--color-text-primary)', marginTop: '2px' }}>
            More to spend time with
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/community')}
          className="quill-btn quill-btn-secondary"
          style={{ padding: '0.4rem 0.95rem', minHeight: '34px', fontSize: '0.82rem' }}
        >
          All community stories →
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        {stories.map((story) => (
          <article
            key={story.id}
            className="quill-surface-card"
            style={{
              padding: 'var(--space-4)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#FFFDFA',
              border: '1px solid var(--color-border)'
            }}
            onClick={() => onNavigate(`/story/${story.slug}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate(`/story/${story.slug}`);
              }
            }}
            aria-label={`Read ${story.title} by ${story.author?.name}`}
          >
            <div>
              {/* Cover Thumbnail */}
              <div
                style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  marginBottom: 'var(--space-3)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <StoryArtworkRenderer artworkId={story.artworkId} />
              </div>

              {/* Topic & Read Time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                <span className="quill-chip quill-chip-compact" style={{ padding: '0.1rem 0.5rem', fontSize: '0.72rem' }}>
                  {story.topic}
                </span>
                <span>·</span>
                <span>{story.readingTime}</span>
              </div>

              {/* Title */}
              <h4
                className="font-serif"
                style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.4',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-2)',
                  fontWeight: 600
                }}
              >
                {story.title}
              </h4>
            </div>

            {/* Author */}
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-subtle)' }}>
              <span>By {story.author?.name}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
