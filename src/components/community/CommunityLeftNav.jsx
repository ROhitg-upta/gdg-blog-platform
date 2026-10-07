import React from 'react';
import { useReader } from '../../hooks/useReader';

export default function CommunityLeftNav({
  activeRoute = '/community',
  selectedTopic = 'All topics',
  onSelectTopic,
  onNavigate
}) {
  const { bookmarks } = useReader();

  const TOPIC_LIST = [
    'Technology',
    'Design',
    'AI',
    'Personal Growth',
    'Culture'
  ];

  return (
    <nav aria-label="Community navigation" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Primary Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button
          type="button"
          onClick={() => {
            if (onSelectTopic) onSelectTopic('All topics');
            onNavigate('/community');
          }}
          className={`quill-sidebar-nav-item ${activeRoute === '/community' && selectedTopic === 'All topics' ? 'active' : ''}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/explore')}
          className={`quill-sidebar-nav-item ${activeRoute === '/explore' ? 'active' : ''}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          <span>Explore</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/bookmarks')}
          className={`quill-sidebar-nav-item ${activeRoute === '/bookmarks' ? 'active' : ''}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span>Bookmarks</span>
            {bookmarks.length > 0 && (
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                  fontWeight: 600
                }}
              >
                {bookmarks.length}
              </span>
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/my-stories')}
          className={`quill-sidebar-nav-item ${activeRoute === '/my-stories' ? 'active' : ''}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span>My stories</span>
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)' }} />

      {/* Topics Section */}
      <div>
        <span className="quill-section-label">Your topics</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {TOPIC_LIST.map((topic) => {
            const isTopicActive = selectedTopic === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  if (onSelectTopic) onSelectTopic(topic);
                  if (activeRoute !== '/community') onNavigate(`/community?topic=${encodeURIComponent(topic)}`);
                }}
                className={`quill-sidebar-nav-item ${isTopicActive ? 'active' : ''}`}
                style={{ fontSize: '0.9rem', padding: '0.5rem 0.85rem' }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isTopicActive ? 'var(--color-accent)' : 'var(--color-border-strong)',
                    marginRight: '4px'
                  }}
                />
                <span>{topic}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Writing Invitation Box */}
      <div
        className="quill-surface-card"
        style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-4)',
          backgroundColor: 'var(--color-surface-secondary)',
          border: '1px solid var(--color-border)'
        }}
      >
        <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--color-accent)' }}>
          Write on Quill
        </span>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 var(--space-3) 0', lineHeight: 1.45 }}>
          Have something to share? Your perspective belongs here.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/write')}
          className="quill-btn quill-btn-secondary"
          style={{ width: '100%', minHeight: '34px', fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}
        >
          Start drafting →
        </button>
      </div>
    </nav>
  );
}
