import React from 'react';
import { EditorialAsterisk } from './EditorialDecorations';

export default function StoryUnavailable({ onNavigate }) {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-8) var(--space-4)',
        maxWidth: '540px',
        margin: '0 auto'
      }}
    >
      {/* Decorative Asterisk */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <EditorialAsterisk size={32} color="var(--color-accent)" />
      </div>

      <span className="text-eyebrow" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>
        Story Unavailable
      </span>

      <h1
        className="font-serif text-h1"
        style={{
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-4)',
          lineHeight: 'var(--leading-snug)'
        }}
      >
        This story slipped between the lines.
      </h1>

      <p
        className="text-body"
        style={{
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          marginBottom: 'var(--space-8)'
        }}
      >
        It may have moved, or it may not be part of this local reading collection. You can return to your community feed or browse our full editorial archive.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => onNavigate('/community')}
          className="quill-btn quill-btn-primary"
        >
          Back to community
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/explore')}
          className="quill-btn quill-btn-secondary"
        >
          Explore stories
        </button>
      </div>
    </div>
  );
}
