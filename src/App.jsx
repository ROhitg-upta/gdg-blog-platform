import React, { useState, useEffect } from 'react';
import { ReaderProvider } from './context/ReaderContext';
import LandingPage from './pages/LandingPage';
import CommunityPage from './pages/CommunityPage';
import BookmarksPage from './pages/BookmarksPage';
import WriterStudioPage from './pages/WriterStudioPage';
import StoryPreviewPage from './pages/StoryPreviewPage';
import MyStoriesPage from './pages/MyStoriesPage';
import StoryReaderPage from './pages/StoryReaderPage';
import CollectionsPage from './pages/CollectionsPage';
import ProfilePage from './pages/ProfilePage';
import DesignSystemPreview from './pages/DesignSystemPreview';
import NotFoundPage from './pages/NotFoundPage';
import CommandPaletteModal from './components/navigation/CommandPaletteModal';

function AppRouter() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Sync navigation on browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global keyboard shortcut for ⌘K / Ctrl+K
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
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

  const renderCurrentPage = () => {
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
      return (
        <CommunityPage
          onNavigate={navigate}
          initialRoute="/community"
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
      );
    }

    // 3. Explore route (reuses community dashboard shell with exploration focus)
    if (currentPath === '/explore') {
      return (
        <CommunityPage
          onNavigate={navigate}
          initialRoute="/explore"
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
      );
    }

    // 4. Saved Bookmarks Shelf route
    if (currentPath === '/bookmarks') {
      return <BookmarksPage onNavigate={navigate} />;
    }

    // 5. Curated Themed Essay Collections routes (/collections or /collections/:slug)
    if (currentPath.startsWith('/collections')) {
      const slug = currentPath.startsWith('/collections/')
        ? currentPath.slice('/collections/'.length).split('/')[0]
        : 'craft-of-attention';
      return <CollectionsPage slug={slug} onNavigate={navigate} />;
    }

    // 6. Personal Reading Room & Preferences route (/profile)
    if (currentPath === '/profile') {
      return <ProfilePage onNavigate={navigate} />;
    }

    // 7. Full Story Reader route (/story/:slug)
    if (currentPath.startsWith('/story/')) {
      const slug = currentPath.slice('/story/'.length).split('/')[0];
      return <StoryReaderPage slug={slug} onNavigate={navigate} />;
    }

    // 8. Writer Studio & Publishing Workflow routes
    if (currentPath === '/write') {
      return <WriterStudioPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/write/')) {
      const subPath = currentPath.slice('/write/'.length);
      if (subPath.endsWith('/preview')) {
        const storyId = subPath.replace('/preview', '').replace(/\//g, '');
        return <StoryPreviewPage storyId={storyId} onNavigate={navigate} />;
      }
      if (subPath.endsWith('/edit')) {
        const storyId = subPath.replace('/edit', '').replace(/\//g, '');
        return <WriterStudioPage storyId={storyId} onNavigate={navigate} />;
      }
      // Direct /write/:id fallback
      const storyId = subPath.split('/')[0];
      return <WriterStudioPage storyId={storyId} onNavigate={navigate} />;
    }

    // 9. Personal Story Management route
    if (currentPath === '/my-stories') {
      return <MyStoriesPage onNavigate={navigate} />;
    }

    // 10. Internal Design System Showcase
    if (currentPath === '/design-system') {
      return <DesignSystemPreview onBackToApp={() => navigate('/community')} />;
    }

    // 11. 404 Fallback
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <>
      {renderCurrentPage()}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={navigate}
      />
    </>
  );
}

export default function App() {
  return (
    <ReaderProvider>
      <AppRouter />
    </ReaderProvider>
  );
}
