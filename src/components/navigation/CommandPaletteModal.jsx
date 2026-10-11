import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useReader } from '../../hooks/useReader';
import { getAllHydratedStories } from '../../data/communityData';

function CommandIcon({ type }) {
  const props = {
    width: 15,
    height: 15,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  switch (type) {
    case 'home':
      return (
        <svg {...props}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'explore':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    case 'bookmark':
      return (
        <svg {...props}>
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'write':
      return (
        <svg {...props}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );
    case 'stories':
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case 'profile':
      return (
        <svg {...props}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'collection':
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 'ambience-paper':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
    case 'ambience-sepia':
      return (
        <svg {...props}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case 'ambience-studio':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      );
    case 'essay':
    default:
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
  }
}

export default function CommandPaletteModal({ isOpen, onClose, onNavigate }) {
  const { profilePreferences, updateProfilePreferences, userStories } = useReader();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input when opened and reset query
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Combine static and user stories
  const allStories = useMemo(() => {
    const staticList = getAllHydratedStories() || [];
    const userList = (userStories || []).filter((s) => s.status === 'published');
    return [...userList, ...staticList];
  }, [userStories]);

  // Command items
  const commands = useMemo(() => {
    const baseCommands = [
      {
        id: 'nav-home',
        category: 'Navigation',
        title: 'Community Dashboard',
        subtitle: 'Editorial home, curated feed, and active discussions',
        iconType: 'home',
        action: () => onNavigate('/community')
      },
      {
        id: 'nav-explore',
        category: 'Navigation',
        title: 'Explore Topics',
        subtitle: 'Filter essays across Technology, Design, AI, and Culture',
        iconType: 'explore',
        action: () => onNavigate('/explore')
      },
      {
        id: 'nav-bookmarks',
        category: 'Navigation',
        title: 'Reading Shelves & Bookmarks',
        subtitle: 'Your organized custom shelves and saved essays',
        iconType: 'bookmark',
        action: () => onNavigate('/bookmarks')
      },
      {
        id: 'nav-write',
        category: 'Navigation',
        title: 'Writer Studio',
        subtitle: 'Draft a new essay with structured block editor & outline',
        iconType: 'write',
        action: () => onNavigate('/write')
      },
      {
        id: 'nav-my-stories',
        category: 'Navigation',
        title: 'My Stories & Drafts',
        subtitle: 'Manage local drafts, published essays, and archives',
        iconType: 'stories',
        action: () => onNavigate('/my-stories')
      },
      {
        id: 'nav-profile',
        category: 'Navigation',
        title: 'Reading Room & Stats',
        subtitle: 'Reading pace, visual atmosphere, and local data export',
        iconType: 'profile',
        action: () => onNavigate('/profile')
      },
      {
        id: 'nav-collection-attention',
        category: 'Collections',
        title: 'Collection: The Craft of Attention',
        subtitle: 'Curated essays on focus, quiet craft, and digital stillness',
        iconType: 'collection',
        action: () => onNavigate('/collections/craft-of-attention')
      },
      {
        id: 'nav-collection-minds',
        category: 'Collections',
        title: 'Collection: Architects of Quiet Minds',
        subtitle: 'Design, ergonomics, and serene human interfaces',
        iconType: 'collection',
        action: () => onNavigate('/collections/architects-of-quiet-minds')
      },
      {
        id: 'action-ambience-paper',
        category: 'Atmosphere',
        title: 'Atmosphere: Paper (Warm Ivory)',
        subtitle: 'Warm ivory linen surface with deep ink typography',
        iconType: 'ambience-paper',
        action: () => {
          updateProfilePreferences?.({ ambience: 'paper' });
          onClose();
        }
      },
      {
        id: 'action-ambience-sepia',
        category: 'Atmosphere',
        title: 'Atmosphere: Sepia (Sunlit Parchment)',
        subtitle: 'Golden sunlit parchment for comfortable reading',
        iconType: 'ambience-sepia',
        action: () => {
          updateProfilePreferences?.({ ambience: 'sepia' });
          onClose();
        }
      },
      {
        id: 'action-ambience-studio',
        category: 'Atmosphere',
        title: 'Atmosphere: Studio (Cool Gray)',
        subtitle: 'Neutral cool gray paper for crisp editorial focus',
        iconType: 'ambience-studio',
        action: () => {
          updateProfilePreferences?.({ ambience: 'studio' });
          onClose();
        }
      }
    ];

    if (!query.trim()) {
      return baseCommands;
    }

    const q = query.toLowerCase().trim();

    // Matching base commands
    const matchedCommands = baseCommands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );

    // Matching stories
    const matchedStories = allStories
      .filter(
        (s) =>
          (s.title && s.title.toLowerCase().includes(q)) ||
          (s.topic && s.topic.toLowerCase().includes(q)) ||
          (s.author?.name && s.author.name.toLowerCase().includes(q))
      )
      .slice(0, 6)
      .map((s) => ({
        id: `story-${s.id || s.slug}`,
        category: 'Essays',
        title: s.title,
        subtitle: `${s.author?.name || 'Local Author'} · ${s.topic || 'Essay'}`,
        iconType: 'essay',
        action: () => onNavigate(`/story/${s.slug}`)
      }));

    return [...matchedCommands, ...matchedStories];
  }, [query, allStories, onNavigate, onClose, updateProfilePreferences]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (commands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (commands.length || 1)) % (commands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (commands[selectedIndex]) {
          commands[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, commands, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.children[selectedIndex];
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="quill-modal-overlay"
      style={{
        zIndex: 1300,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh'
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="quill-command-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="quill-command-search-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, essay, collection, or atmosphere..."
            className="quill-command-search-input"
          />

          <kbd className="quill-cmd-kbd" style={{ cursor: 'pointer' }} onClick={onClose}>
            ESC
          </kbd>
        </div>

        {/* Command Items List */}
        <div ref={listRef} className="quill-command-list">
          {commands.length === 0 ? (
            <div style={{ padding: 'var(--space-8) var(--space-4)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>No matching commands or essays found for "{query}".</p>
            </div>
          ) : (
            commands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`quill-command-item ${isSelected ? 'selected' : ''}`}
                >
                  <div className="quill-command-item-icon-box">
                    <CommandIcon type={cmd.iconType} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cmd.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        {cmd.category}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>
                      {cmd.subtitle}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Command Palette Footer Tips */}
        <div
          style={{
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: 'var(--color-surface-secondary)',
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--color-text-muted)'
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <span><kbd className="quill-cmd-kbd">↑</kbd> <kbd className="quill-cmd-kbd">↓</kbd> navigate</span>
            <span><kbd className="quill-cmd-kbd">↵</kbd> select</span>
          </div>
          <span>Quill Command Center</span>
        </div>
      </div>
    </div>
  );
}
