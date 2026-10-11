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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Quill ErrorBoundary caught]:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8F5EE',
            color: '#1E1C1A',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#D85A35' }}>✦</div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
            A quiet pause in the margins.
          </h1>
          <p style={{ color: '#5A554E', maxWidth: '440px', lineHeight: 1.5, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            An unexpected error occurred while loading this view. You can reload the page or clear your local session cache.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#D85A35',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.6rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                backgroundColor: 'transparent',
                color: '#1E1C1A',
                border: '1px solid #DDD4C7',
                borderRadius: '8px',
                padding: '0.6rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Reset Session
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function normalizePath(rawPath) {
  if (!rawPath) return '/';
  let path = rawPath;
  // If hosted on GitHub Pages or custom repo subfolder, strip prefix
  path = path.replace(/^\/gdg-blog-platform(?:\/|$)/i, '/');
  // Strip trailing slashes (except root)
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path || '/';
}

function AppRouter() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Sync navigation on browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global keyboard shortcut for Ctrl+K or '/'
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }
      if (e.key === '/' && !commandPaletteOpen) {
        const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        const isEditable = document.activeElement ? document.activeElement.isContentEditable : false;
        if (tag !== 'input' && tag !== 'textarea' && !isEditable) {
          e.preventDefault();
          setCommandPaletteOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [commandPaletteOpen]);

  const navigate = (path, replace = false) => {
    const [pathname] = path.split('?');
    const clean = normalizePath(pathname);
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(clean);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Safe redirect for legacy authentication routes
  useEffect(() => {
    if (currentPath === '/login' || currentPath === '/signup' || currentPath === '/onboarding') {
      navigate('/', true);
    }
  }, [currentPath]);

  const renderCurrentPage = () => {
    // 1. Root route: ALWAYS renders approved warm ivory editorial landing page
    if (currentPath === '/' || currentPath === '/login' || currentPath === '/signup' || currentPath === '/onboarding') {
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
    <ErrorBoundary>
      <ReaderProvider>
        <AppRouter />
      </ReaderProvider>
    </ErrorBoundary>
  );
}
