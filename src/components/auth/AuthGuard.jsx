import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Quiet loading state during auth hydration to prevent wrong-page flash
 */
export function AuthHydrationLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-paper, #F8F5EE)',
        color: 'var(--color-text-inverse, #1E1C1A)'
      }}
      role="status"
      aria-live="polite"
    >
      <div
        className="quill-btn-spinner"
        style={{ width: '28px', height: '28px', color: 'var(--color-accent)' }}
        aria-hidden="true"
      />
      <span className="text-meta" style={{ marginTop: 'var(--space-3)' }}>
        Preparing your reading room...
      </span>
    </div>
  );
}

/**
 * ProtectedRoute:
 * Restricts access to authenticated users only.
 */
export function ProtectedRoute({ children, onNavigate }) {
  const { isAuthenticated, isHydrating, user } = useAuth();

  if (isHydrating) {
    return <AuthHydrationLoading />;
  }

  if (!isAuthenticated) {
    onNavigate('/login');
    return null;
  }

  // If user has not completed onboarding and is attempting another protected page
  if (user && !user.onboardingComplete && window.location.pathname !== '/onboarding') {
    onNavigate('/onboarding');
    return null;
  }

  return children;
}

/**
 * PublicOnlyRoute:
 * Redirects authenticated users away from /login and /signup to /community.
 */
export function PublicOnlyRoute({ children, onNavigate }) {
  const { isAuthenticated, isHydrating, user } = useAuth();

  if (isHydrating) {
    return <AuthHydrationLoading />;
  }

  if (isAuthenticated) {
    if (user && !user.onboardingComplete) {
      onNavigate('/onboarding');
    } else {
      onNavigate('/community');
    }
    return null;
  }

  return children;
}
