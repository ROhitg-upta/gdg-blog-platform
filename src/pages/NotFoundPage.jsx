import React from 'react';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { EditorialAsterisk } from '../components/editorial/EditorialDecorations';

export default function NotFoundPage({ onNavigate }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-paper, #F8F5EE)',
        color: 'var(--color-text-primary, #1E1C1A)',
        padding: 'var(--space-6)',
        textAlign: 'center'
      }}
    >
      <EditorialAsterisk size={28} color="var(--color-accent)" />

      <span className="text-eyebrow" style={{ marginTop: 'var(--space-4)', color: 'var(--color-accent)' }}>
        404 — NOT FOUND
      </span>

      <h1
        className="font-serif text-h1"
        style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-3)' }}
      >
        This page slipped between the lines.
      </h1>

      <p className="text-body" style={{ color: 'var(--color-text-secondary)', maxWidth: '420px', marginBottom: 'var(--space-6)' }}>
        The passage you are looking for has been moved, archived, or does not exist.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <PrimaryButton onClick={() => onNavigate('/community')}>
          Return to community
        </PrimaryButton>
        <SecondaryButton onClick={() => onNavigate('/')}>
          Return to landing
        </SecondaryButton>
      </div>
    </div>
  );
}
