import React from 'react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import TopicChip from '../components/ui/TopicChip';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { EditorialAsterisk } from '../components/editorial/EditorialDecorations';

export default function CommunityPlaceholderPage({ onNavigate }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Reader';
  const interests = user?.interests || ['Technology', 'Design'];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-paper, #F8F5EE)', color: 'var(--color-text-inverse, #1E1C1A)' }}>
      {/* Top Header Bar */}
      <header
        style={{
          borderBottom: '1px solid rgba(30, 28, 26, 0.1)',
          backgroundColor: '#FFFFFF',
          padding: '0 var(--gutter-desktop)',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span className="brand-wordmark" style={{ color: 'var(--color-text-inverse, #1E1C1A)' }}>
            quill<span style={{ color: 'var(--color-accent)' }}>.</span>
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-accent-soft)',
              color: 'var(--color-accent)',
              letterSpacing: '0.04em'
            }}
          >
            ● Authenticated Session
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Avatar name={user?.name || 'Reader'} size="sm" />
            <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-text-inverse, #1E1C1A)' }}>
              {user?.name || 'Reader'}
            </span>
          </div>

          <SecondaryButton
            onClick={handleLogout}
            style={{ minHeight: '36px', padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          >
            Sign out
          </SecondaryButton>
        </div>
      </header>

      {/* Main Protected Confirmation Card */}
      <main style={{ padding: 'var(--space-8) var(--space-4)' }}>
        <div className="quill-placeholder-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span className="text-eyebrow">MODULE 2 VERIFIED</span>
            <EditorialAsterisk size={14} color="var(--color-accent)" />
          </div>

          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(2.2rem, 3.5vw, 2.85rem)',
              marginTop: 'var(--space-2)',
              marginBottom: 'var(--space-2)',
              color: 'var(--color-text-inverse, #1E1C1A)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            Welcome, {firstName}.
          </h1>

          <h2
            className="font-serif text-h3"
            style={{ color: 'var(--color-text-muted)', fontWeight: 400, marginBottom: 'var(--space-4)' }}
          >
            Your reading room is ready.
          </h2>

          <p className="text-body" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: '580px' }}>
            You have successfully authenticated into Quill. The complete three-column Community dashboard, story feeds, search, and writer studio arrive in the next chapter.
          </p>

          <div style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)', backgroundColor: 'var(--color-paper, #F8F5EE)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(30, 28, 26, 0.08)' }}>
            <span className="text-meta" style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>
              Your Selected Topics:
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {interests.map((topic) => (
                <TopicChip
                  key={topic}
                  label={topic}
                  selected={true}
                  size="compact"
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <PrimaryButton onClick={() => onNavigate('/design-system')}>
              Explore the design system →
            </PrimaryButton>

            <SecondaryButton onClick={handleLogout}>
              Sign out of session
            </SecondaryButton>
          </div>
        </div>
      </main>
    </div>
  );
}
