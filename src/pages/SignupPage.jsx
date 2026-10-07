import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton } from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { TextInput, PasswordInput } from '../components/ui/Input';
import { InlineMessage } from '../components/ui/InlineMessage';
import { ArtworkArchitecturalPortal } from '../components/editorial/EditorialArtwork';
import { EditorialAsterisk } from '../components/editorial/EditorialDecorations';

export default function SignupPage({ onNavigate }) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim() || !validateEmail(email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsLoading(true);
    const result = await signup({ name, email, password });
    setIsLoading(false);

    if (result.success) {
      onNavigate('/onboarding');
    } else {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="quill-auth-split-layout">
      {/* LEFT / EDITORIAL CANVAS */}
      <aside className="quill-auth-editorial-panel" aria-label="Quill Editorial Welcome">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="brand-wordmark" style={{ color: 'var(--color-text-primary)' }}>
              quill<span style={{ color: 'var(--color-accent)' }}>.</span>
            </span>
            <EditorialAsterisk size={18} color="var(--color-accent)" />
          </div>

          <div style={{ marginTop: 'var(--space-10)' }}>
            <span className="text-eyebrow">START A NEW CHAPTER</span>
            <h1
              className="font-serif"
              style={{
                fontSize: 'clamp(2.3rem, 3.8vw, 3.4rem)',
                lineHeight: 1.12,
                letterSpacing: '-0.025em',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginTop: 'var(--space-3)'
              }}
            >
              Every perspective begins somewhere.
            </h1>
            <p
              className="text-body"
              style={{
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--space-3)',
                maxWidth: '420px'
              }}
            >
              Create your reading room, then make it your own.
            </p>
          </div>
        </div>

        <div style={{ margin: 'var(--space-6) 0', maxWidth: '360px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <ArtworkArchitecturalPortal />
        </div>

        <div className="quill-auth-quote-box">
          <p className="text-body-sm font-serif" style={{ fontStyle: 'italic', color: 'var(--color-text-primary)' }}>
            “You don’t start with a cathedral. You start with a quiet sentence and the patience to watch it build.”
          </p>
          <span className="text-meta" style={{ display: 'block', marginTop: 'var(--space-2)' }}>
            — The Writer’s Folio
          </span>
        </div>
      </aside>

      {/* RIGHT / SIGNUP FORM CANVAS */}
      <main className="quill-auth-form-panel">
        <div className="quill-auth-form-card">
          <header style={{ marginBottom: 'var(--space-6)' }}>
            <span className="text-eyebrow" style={{ color: 'var(--color-accent)' }}>NEW READER</span>
            <h2
              className="font-serif text-h1"
              style={{ color: 'var(--color-text-inverse, #1E1C1A)', marginTop: 'var(--space-1)' }}
            >
              Begin your collection.
            </h2>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
              Join independent writers and thoughtful observers.
            </p>
          </header>

          {errorMessage && (
            <InlineMessage type="error" className="mb-4">
              {errorMessage}
            </InlineMessage>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <FormField id="signup-name" label="Full name" required>
              <TextInput
                id="signup-name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Rostova"
                disabled={isLoading}
              />
            </FormField>

            <FormField id="signup-email" label="Email address" required>
              <TextInput
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@example.com"
                disabled={isLoading}
              />
            </FormField>

            <FormField id="signup-password" label="Password (8+ characters)" required>
              <PasswordInput
                id="signup-password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                disabled={isLoading}
              />
            </FormField>

            <FormField id="signup-confirm-password" label="Confirm password" required>
              <PasswordInput
                id="signup-confirm-password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                disabled={isLoading}
              />
            </FormField>

            <PrimaryButton
              type="submit"
              loading={isLoading}
              style={{ width: '100%', marginTop: 'var(--space-3)' }}
            >
              Create your account
            </PrimaryButton>
          </form>

          <footer style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Already reading with Quill?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                style={{
                  color: 'var(--color-text-inverse, #1E1C1A)',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Sign in
              </button>
            </p>

            <p className="quill-auth-prototype-note">
              This prototype keeps your account data in this browser.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
