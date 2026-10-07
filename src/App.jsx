import React, { useState, useEffect } from 'react';
import { ReaderProvider } from './context/ReaderContext';
import LandingPage from './pages/LandingPage';
import CommunityPage from './pages/CommunityPage';
import BookmarksPage from './pages/BookmarksPage';
import WriterStudioComingSoonPage from './pages/WriterStudioComingSoonPage';
import DesignSystemPreview from './pages/DesignSystemPreview';
import NotFoundPage from './pages/NotFoundPage';

function AppRouter() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Sync navigation on browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path, replace = false) => {
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    // Extract pathname in case path includes query parameters like /community?topic=Design
    const [pathname] = path.split('?');
    setCurrentPath(pathname);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Legacy authentication routes: redirect with replace to '/'
  if (currentPath === '/login' || currentPath === '/signup' || currentPath === '/onboarding') {
    navigate('/', true);
    return <LandingPage onNavigate={navigate} />;
  }

  // 1. Root route: ALWAYS renders approved warm ivory editorial landing page
  if (currentPath === '/') {
    return <LandingPage onNavigate={navigate} />;
  }

  // 2. Community Dashboard route
  if (currentPath === '/community') {
    return <CommunityPage onNavigate={navigate} initialRoute="/community" />;
  }

  // 3. Explore route (reuses community dashboard shell with exploration focus)
  if (currentPath === '/explore') {
    return <CommunityPage onNavigate={navigate} initialRoute="/explore" />;
  }

  // 4. Saved Bookmarks Shelf route
  if (currentPath === '/bookmarks') {
    return <BookmarksPage onNavigate={navigate} />;
  }

  // 5. Future Writer Studio & Story Management destinations
  if (currentPath === '/write') {
    return <WriterStudioComingSoonPage onNavigate={navigate} route="/write" />;
  }

  if (currentPath === '/my-stories') {
    return <WriterStudioComingSoonPage onNavigate={navigate} route="/my-stories" />;
  }

  // 6. Internal Design System Showcase
  if (currentPath === '/design-system') {
    return <DesignSystemPreview onBackToApp={() => navigate('/community')} />;
  }

  // 7. 404 Fallback
  return <NotFoundPage onNavigate={navigate} />;
}

export default function App() {
  return (
    <ReaderProvider>
      <AppRouter />
    </ReaderProvider>
  );
}
