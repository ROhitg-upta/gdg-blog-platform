import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USER_CREDENTIALS } from '../utils/authStorage';
import { PrimaryButton } from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { TextInput, PasswordInput } from '../components/ui/Input';
import { InlineMessage } from '../components/ui/InlineMessage';
import { ArtworkGeometricManuscript } from '../components/editorial/EditorialArtwork';
import { EditorialAsterisk } from '../components/editorial/EditorialDecorations';

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const emailInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    const result = await login({ email, password });
    setIsLoading(false);

    if (result.success) {
      if (result.user && !result.user.onboardingComplete) {
        onNavigate('/onboarding');
      } else {
        onNavigate('/community');
      }
    } else {
      setErrorMessage(result.error);
      emailInputRef.current?.focus();
    }
  };

  const handleFillDemo = () => {
    setEmail(DEMO_USER_CREDENTIALS.email);
    setPassword(DEMO_USER_CREDENTIALS.password);
    setErrorMessage('');
  };

  return (
    <div className="quill-auth-split-layout">
      {/* LEFT / EDITORIAL CANVAS */}
      <aside className="quill-auth-editorial-panel" aria-label="Quill Editorial Welcome">
        <div>
          {/* Brand Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="brand-wordmark" style={{ color: 'var(--color-text-primary)' }}>
              quill<span style={{ color: 'var(--color-accent)' }}>.</span>
            </span>
            <EditorialAsterisk size={18} color="var(--color-accent)" />
          </div>

          {/* Eyebrow & Headline */}
          <div style={{ marginTop: 'var(--space-10)' }}>
            <span className="text-eyebrow">A HOME FOR CURIOUS MINDS</span>
            <h1
              className="font-serif"
              style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.5rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginTop: 'var(--space-3)',
                whiteSpace: 'pre-line'
              }}
            >
              Come in.{"\n"}There’s more to read.
            </h1>
            <p
              className="text-body"
              style={{
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--space-3)',
                maxWidth: '400px'
              }}
            >
              A quiet place for curious minds and unfinished ideas.
            </p>
          </div>
        </div>

        {/* Abstract Manuscript Illustration */}
        <div style={{ margin: 'var(--space-6) 0', maxWidth: '360px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <ArtworkGeometricManuscript />
        </div>

        {/* Static Editorial Excerpt Box */}
        <div className="quill-auth-quote-box">
          <p className="text-body-sm font-serif" style={{ fontStyle: 'italic', color: 'var(--color-text-primary)' }}>
            “A thought worth keeping. A voice you have not met yet. A better way to see things.”
          </p>
          <span className="text-meta" style={{ display: 'block', marginTop: 'var(--space-2)' }}>
            — Notes from the Reading Room
          </span>
        </div>
      </aside>

      {/* RIGHT / AUTH FORM CANVAS */}
      <main className="quill-auth-form-panel">
        <div className="quill-auth-form-card">
          <header style={{ marginBottom: 'var(--space-6)' }}>
            <span className="text-eyebrow" style={{ color: 'var(--color-accent)' }}>WELCOME BACK</span>
            <h2
              className="font-serif text-h1"
              style={{ color: 'var(--color-text-inverse, #1E1C1A)', marginTop: 'var(--space-1)' }}
            >
              Continue your reading.
            </h2>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
              Sign in to return to your reading room.
            </p>
          </header>

          {errorMessage && (
            <InlineMessage type="error" className="mb-4">
              {errorMessage}
            </InlineMessage>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <FormField id="login-email" label="Email address" required>
              <TextInput
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@quill.local"
                ref={emailInputRef}
                disabled={isLoading}
              />
            </FormField>

            <FormField id="login-password" label="Password" required>
              <PasswordInput
                id="login-password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </FormField>

            <PrimaryButton
              type="submit"
              loading={isLoading}
              style={{ width: '100%', marginTop: 'var(--space-3)' }}
            >
              Continue reading
            </PrimaryButton>
          </form>

          <div className="quill-auth-divider">or</div>

          {/* Discreet Working Prototype Demo Action */}
          <button
            type="button"
            className="quill-auth-demo-action"
            onClick={handleFillDemo}
            disabled={isLoading}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="3" width="12" height="10" rx="2" />
              <circle cx="8" cy="8" r="2" />
            </svg>
            <span>Use prototype demo account (Vishal Gupta)</span>
          </button>

          <footer style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
              New to Quill?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/signup')}
                style={{
                  color: 'var(--color-text-inverse, #1E1C1A)',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Create an account
              </button>
            </p>

            <p className="quill-auth-prototype-note">
              Prototype mode — this session is saved only in this browser.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
