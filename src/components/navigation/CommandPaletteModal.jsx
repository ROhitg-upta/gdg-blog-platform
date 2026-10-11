import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useReader } from '../../hooks/useReader';
import { getAllHydratedStories } from '../../data/communityData';

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
        icon: '🏠',
        action: () => onNavigate('/community')
      },
      {
        id: 'nav-explore',
        category: 'Navigation',
        title: 'Explore Topics',
        subtitle: 'Filter essays across Technology, Design, AI, and Culture',
        icon: '🧭',
        action: () => onNavigate('/explore')
      },
      {
        id: 'nav-bookmarks',
        category: 'Navigation',
        title: 'Reading Shelves & Bookmarks',
        subtitle: 'Your organized custom shelves and saved essays',
        icon: '🔖',
        action: () => onNavigate('/bookmarks')
      },
      {
        id: 'nav-write',
        category: 'Navigation',
        title: 'Writer Studio',
        subtitle: 'Draft a new essay with structured block editor & outline',
        icon: '✍️',
        action: () => onNavigate('/write')
      },
      {
        id: 'nav-my-stories',
        category: 'Navigation',
        title: 'My Stories & Drafts',
        subtitle: 'Manage local drafts, published essays, and archives',
        icon: '📂',
        action: () => onNavigate('/my-stories')
      },
      {
        id: 'nav-profile',
        category: 'Navigation',
        title: 'Reading Room & Stats',
        subtitle: 'Reading pace, visual atmosphere, and local data export',
        icon: '☕',
        action: () => onNavigate('/profile')
      },
      {
        id: 'nav-collection-attention',
        category: 'Navigation',
        title: 'Collection: The Craft of Attention',
        subtitle: 'Curated essays on focus, quiet craft, and digital stillness',
        icon: '📚',
        action: () => onNavigate('/collections/craft-of-attention')
      },
      {
        id: 'nav-collection-minds',
        category: 'Navigation',
        title: 'Collection: Architects of Quiet Minds',
        subtitle: 'Design, ergonomics, and serene human interfaces',
        icon: '📚',
        action: () => onNavigate('/collections/architects-of-quiet-minds')
      },
      {
        id: 'action-ambience-paper',
        category: 'Reading Ambiance',
        title: 'Ambiance: Paper (Default)',
        subtitle: 'Warm ivory linen surface with deep ink typography',
        icon: '📜',
        action: () => {
          updateProfilePreferences?.({ ambience: 'paper' });
          onClose();
        }
      },
      {
        id: 'action-ambience-sepia',
        category: 'Reading Ambiance',
        title: 'Ambiance: Sepia',
        subtitle: 'Golden sunlit parchment for comfortable reading',
        icon: '📖',
        action: () => {
          updateProfilePreferences?.({ ambience: 'sepia' });
          onClose();
        }
      },
      {
        id: 'action-ambience-studio',
        category: 'Reading Ambiance',
        title: 'Ambiance: Studio',
        subtitle: 'Neutral cool gray paper for crisp editorial focus',
        icon: '🖊️',
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
        icon: '📄',
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
        paddingTop: '12vh'
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="quill-surface-card"
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: '#FFFDFA',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '75vh',
          animation: 'fadeIn var(--transition-fast)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
            gap: 'var(--space-3)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands, topics, or essays..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '1rem',
              color: 'var(--color-text-primary)',
              fontFamily: 'inherit'
            }}
          />

          <kbd
            style={{
              fontSize: '0.72rem',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--color-surface-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)',
              fontFamily: 'inherit'
            }}
          >
            Esc
          </kbd>
        </div>

        {/* Command Items List */}
        <div
          ref={listRef}
          style={{
            overflowY: 'auto',
            padding: 'var(--space-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    textAlign: 'left',
                    width: '100%',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--color-surface-secondary)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--color-accent)' : '3px solid transparent',
                    transition: 'background-color var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{cmd.icon}</span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cmd.title}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
            <span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> select</span>
          </div>
          <span>Quill Fast Navigation</span>
        </div>
      </div>
    </div>
  );
}
