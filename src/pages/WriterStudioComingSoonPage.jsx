import React from 'react';
import CommunityHeader from '../components/community/CommunityHeader';
import CommunityLeftNav from '../components/community/CommunityLeftNav';
import { EditorialAsterisk } from '../components/editorial/EditorialDecorations';

export default function WriterStudioComingSoonPage({ onNavigate, route = '/write' }) {
  const isMyStories = route === '/my-stories';

  return (
    <div className="quill-app-shell" style={{ backgroundColor: 'var(--color-paper, #F8F5EE)', minHeight: '100vh' }}>
      {/* Light Top Header */}
      <CommunityHeader
        searchQuery=""
        onSearchChange={() => {}}
        onSearchClear={() => {}}
        onNavigate={onNavigate}
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
            activeRoute={route}
            onNavigate={onNavigate}
          />
        </aside>

        {/* Coming Next Canvas */}
        <main
          className="quill-dashboard-main"
          style={{
            minWidth: 0,
            gridColumn: 'span 2',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-4)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-accent-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-6)',
              color: 'var(--color-accent)'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>

          <span className="text-eyebrow" style={{ color: 'var(--color-accent)' }}>
            {isMyStories ? 'Story Management' : 'Writer Studio'}
          </span>

          <h1
            className="font-serif text-h1"
            style={{
              color: 'var(--color-text-primary)',
              maxWidth: '560px',
              marginTop: 'var(--space-2)',
              marginBottom: 'var(--space-4)'
            }}
          >
            {isMyStories
              ? 'Your drafts and story archive will live here.'
              : 'The distraction-free writing studio is arriving in the next module.'}
          </h1>

          <p
            className="text-body"
            style={{
              color: 'var(--color-text-secondary)',
              maxWidth: '520px',
              marginBottom: 'var(--space-8)',
              lineHeight: 1.6
            }}
          >
            We are crafting a typography-first composition space with live markdown previews, draft autosaving, and seamless publishing. In this current reading phase, exploring and bookmarking curated stories is fully live.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => onNavigate('/community')}
              className="quill-btn quill-btn-primary"
            >
              Back to Community feed
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="quill-btn quill-btn-secondary"
            >
              Return to landing
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
