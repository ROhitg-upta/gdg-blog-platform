import React from 'react';
import { WRITERS, COMMUNITY_PICKS, WEEKLY_PROMPT, getAllHydratedStories } from '../../data/communityData';
import { useReader } from '../../hooks/useReader';
import Avatar from '../ui/Avatar';

export default function CommunityRightRail({
  onSelectStory,
  onSelectTopic,
  onNavigate
}) {
  const { isFollowing, followWriter, unfollowWriter } = useReader();
  const hydratedStories = getAllHydratedStories();

  const handlePickClick = (pickId) => {
    const fullStory = hydratedStories.find((s) => s.id === pickId);
    if (fullStory && onNavigate && fullStory.slug) {
      onNavigate(`/story/${fullStory.slug}`);
    } else if (fullStory && onSelectStory) {
      onSelectStory(fullStory);
    }
  };

  const TOPIC_PILLS = ['Technology', 'Design', 'AI', 'Personal Growth', 'Culture'];

  return (
    <div aria-label="Community highlights and recommendations" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* 1. Community Picks */}
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-6)' }}>
        <span className="quill-section-label">Community Picks</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {COMMUNITY_PICKS.map((pick, index) => (
            <div
              key={pick.id}
              className="quill-compact-story"
              onClick={() => handlePickClick(pick.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePickClick(pick.id);
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-accent)' }}>
                  0{index + 1}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                  {pick.authorName}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  · {pick.readingTime}
                </span>
              </div>
              <h4 className="quill-compact-story-title">
                {pick.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Explore Topics */}
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-6)' }}>
        <span className="quill-section-label">Explore Topics</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {TOPIC_PILLS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => onSelectTopic && onSelectTopic(topic)}
              className="quill-chip quill-chip-compact"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Writers to Follow */}
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-6)' }}>
        <span className="quill-section-label">Writers to Follow</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
          {WRITERS.slice(0, 3).map((writer) => {
            const following = isFollowing(writer.id);
            return (
              <div
                key={writer.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)'
                }}
              >
                <div style={{ display: 'flex', gap: 'var(--space-3)', minWidth: 0 }}>
                  <Avatar name={writer.name} size="sm" />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {writer.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {writer.bio}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (following) {
                      unfollowWriter(writer.id);
                    } else {
                      followWriter(writer.id);
                    }
                  }}
                  className={`quill-btn quill-btn-secondary ${following ? 'active' : ''}`}
                  style={{
                    padding: '0.28rem 0.75rem',
                    minHeight: '28px',
                    fontSize: '0.76rem',
                    flexShrink: 0,
                    borderColor: following ? 'var(--color-accent)' : 'var(--color-border)',
                    backgroundColor: following ? 'var(--color-accent-soft)' : 'var(--color-surface-card)',
                    color: following ? 'var(--color-accent)' : 'var(--color-text-primary)'
                  }}
                  aria-label={following ? `Unfollow ${writer.name}` : `Follow ${writer.name}`}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Writing Invitation */}
      <div
        className="quill-surface-card"
        style={{
          padding: 'var(--space-5)',
          backgroundColor: 'var(--color-accent-soft, #F8E4D9)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="var(--color-accent)" aria-hidden="true">
            <path d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z" />
          </svg>
          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--color-accent)' }}>
            For Writers
          </span>
        </div>
        <h4
          className="font-serif"
          style={{
            fontSize: '1.08rem',
            lineHeight: 1.4,
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--space-2) 0'
          }}
        >
          Your perspective belongs here.
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, marginBottom: 'var(--space-4)' }}>
          Share an essay, observation, or craft insight with thoughtful readers.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/write')}
          className="quill-btn quill-btn-secondary"
          style={{ width: '100%', minHeight: '34px', fontSize: '0.82rem', padding: '0.35rem 0.85rem', backgroundColor: '#FFFDFA' }}
        >
          Write your first story →
        </button>
      </div>
    </div>
  );
}
