import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthHydrationLoading } from './components/auth/AuthGuard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import CommunityPlaceholderPage from './pages/CommunityPlaceholderPage';
import NotFoundPage from './pages/NotFoundPage';
import DesignSystemPreview from './pages/DesignSystemPreview';

function AppContent() {
  const { user, isAuthenticated, isHydrating } = useAuth();
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  );

  // Sync navigation on browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Wait for initial session hydration to eliminate wrong-page flicker
  if (isHydrating) {
    return <AuthHydrationLoading />;
  }

  // Root path resolution
  if (currentPath === '/') {
    if (isAuthenticated) {
      if (user && !user.onboardingComplete) {
        navigate('/onboarding');
      } else {
        navigate('/community');
      }
    } else {
      navigate('/login');
    }
    return <AuthHydrationLoading />;
  }

  // /login route
  if (currentPath === '/login') {
    if (isAuthenticated) {
      if (user && !user.onboardingComplete) {
        navigate('/onboarding');
      } else {
        navigate('/community');
      }
      return <AuthHydrationLoading />;
    }
    return <LoginPage onNavigate={navigate} />;
  }

  // /signup route
  if (currentPath === '/signup') {
    if (isAuthenticated) {
      if (user && !user.onboardingComplete) {
        navigate('/onboarding');
      } else {
        navigate('/community');
      }
      return <AuthHydrationLoading />;
    }
    return <SignupPage onNavigate={navigate} />;
  }

  // /onboarding route
  if (currentPath === '/onboarding') {
    if (!isAuthenticated) {
      navigate('/login');
      return <AuthHydrationLoading />;
    }
    if (user && user.onboardingComplete) {
      navigate('/community');
      return <AuthHydrationLoading />;
    }
    return <OnboardingPage onNavigate={navigate} />;
  }

  // /community protected route (Module 2 placeholder)
  if (currentPath === '/community') {
    if (!isAuthenticated) {
      navigate('/login');
      return <AuthHydrationLoading />;
    }
    if (user && !user.onboardingComplete) {
      navigate('/onboarding');
      return <AuthHydrationLoading />;
    }
    return <CommunityPlaceholderPage onNavigate={navigate} />;
  }

  // /design-system internal preview route
  if (currentPath === '/design-system') {
    return (
      <DesignSystemPreview
        onBackToApp={() => navigate(isAuthenticated ? '/community' : '/login')}
      />
    );
  }

  // Unknown route
  return <NotFoundPage onNavigate={navigate} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
