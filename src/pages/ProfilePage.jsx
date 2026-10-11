import React, { useState, useEffect, useMemo } from 'react';
import CommunityHeader from '../components/community/CommunityHeader';
import CommunityLeftNav from '../components/community/CommunityLeftNav';
import Avatar from '../components/ui/Avatar';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useReader } from '../hooks/useReader';
import {
  getReadingHistory,
  clearReadingHistory,
  getStoredHighlights,
  getStoredNotes,
  getStoredReactions,
  getStoredResponses,
  ADVANCED_STORAGE_KEYS
} from '../utils/advancedStorage';
import { USER_STORIES_STORAGE_KEY } from '../utils/storyStorage';
import { STORAGE_KEYS } from '../utils/readerStorage';
import { Toast, ToastContainer } from '../components/ui/Toast';

const ACCENT_OPTIONS = [
  { id: 'terracotta', name: 'Terracotta', color: '#D85A35', description: 'Warm editorial clay' },
  { id: 'lavender', name: 'Lavender', color: '#8A7BA5', description: 'Gentle contemplative violet' },
  { id: 'sage', name: 'Sage', color: '#6B8E7D', description: 'Calm herbal green' },
  { id: 'ochre', name: 'Ochre', color: '#C28E38', description: 'Rich sun-baked gold' }
];

const AMBIENCE_OPTIONS = [
  {
    id: 'paper',
    name: 'Paper',
    badge: 'Default',
    bg: '#F8F5EE',
    border: '#DDD4C7',
    description: 'Warm linen ivory with deep ink typography.'
  },
  {
    id: 'sepia',
    name: 'Sepia',
    badge: 'Sunlit',
    bg: '#FAF3E0',
    border: '#E2D5BE',
    description: 'Golden parchment designed to soften eyes during long reads.'
  },
  {
    id: 'studio',
    name: 'Studio',
    badge: 'Modern',
    bg: '#F2F4F7',
    border: '#D3DAE2',
    description: 'Neutral cool gray-toned paper for analytical clarity.'
  }
];

export default function ProfilePage({ onNavigate }) {
  const {
    profilePreferences,
    updateProfilePreferences,
    bookmarks,
    bookmarkCollections,
    userStories,
    toasts,
    showToast,
    dismissToast
  } = useReader();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [penNameInput, setPenNameInput] = useState(profilePreferences?.penName || 'Reader');
  const [isEditingPenName, setIsEditingPenName] = useState(false);
  const [readingTrail, setReadingTrail] = useState([]);
  const [confirmClearHistoryOpen, setConfirmClearHistoryOpen] = useState(false);
  const [confirmResetAllOpen, setConfirmResetAllOpen] = useState(false);

  // Sync pen name if preference updates externally
  useEffect(() => {
    if (profilePreferences?.penName) {
      setPenNameInput(profilePreferences.penName);
    }
  }, [profilePreferences?.penName]);

  // Load reading history
  const refreshHistory = () => {
    setReadingTrail(getReadingHistory());
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  // Compute aggregate statistics
  const stats = useMemo(() => {
    const storiesExplored = readingTrail.length;
    // Approximated word count based on reading trail progress & estimated length
    const totalWordsRead = readingTrail.reduce((acc, item) => {
      const estimatedWords = 900; // Average editorial essay length
      const progressFraction = (item.progressPercent || 50) / 100;
      return acc + Math.round(estimatedWords * progressFraction);
    }, 0);

    const publishedCount = userStories.filter((s) => s.status === 'published').length;
    const draftsCount = userStories.filter((s) => s.status === 'draft').length;

    const highlightsCount = getStoredHighlights().length;
    const notesCount = getStoredNotes().length;
    const reactionsCount = Object.keys(getStoredReactions()).length;
    const responsesCount = getStoredResponses().length;

    return {
      storiesExplored,
      totalWordsRead,
      bookmarksCount: bookmarks.length,
      shelvesCount: bookmarkCollections.length,
      publishedCount,
      draftsCount,
      highlightsCount,
      notesCount,
      reactionsCount,
      responsesCount
    };
  }, [readingTrail, bookmarks, bookmarkCollections, userStories]);

  // Save updated pen name
  const handleSavePenName = (e) => {
    e.preventDefault();
    const trimmed = penNameInput.trim();
    if (!trimmed) {
      showToast('Pen name cannot be empty.', 'warning');
      return;
    }
    updateProfilePreferences({ penName: trimmed });
    setIsEditingPenName(false);
    showToast(`Pen name updated to "${trimmed}".`, 'success');
  };

  // Change accent tone
  const handleSelectAccent = (accentId) => {
    updateProfilePreferences({ accent: accentId });
    showToast(`Accent tone set to ${accentId}.`, 'info');
  };

  // Change reading ambience
  const handleSelectAmbience = (ambienceId) => {
    updateProfilePreferences({ ambience: ambienceId });
    showToast(`Reading ambience set to ${ambienceId}.`, 'info');
  };

  // Clear reading trail
  const handleClearHistory = () => {
    clearReadingHistory();
    refreshHistory();
    setConfirmClearHistoryOpen(false);
    showToast('Reading history cleared from this browser.', 'info');
  };

  // Export full JSON backup
  const handleExportFullBackup = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        application: 'Quill Editorial Platform',
        profilePreferences,
        bookmarks,
        bookmarkCollections,
        userStories,
        readingHistory: getReadingHistory(),
        highlights: getStoredHighlights(),
        notes: getStoredNotes(),
        reactions: getStoredReactions(),
        responses: getStoredResponses()
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quill-reading-room-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Exported complete Quill library backup.', 'success');
    } catch (err) {
      console.warn('Backup export error:', err);
      showToast('Failed to generate export file.', 'error');
    }
  };

  // Reset all local Quill data
  const handleResetAllData = () => {
    try {
      // Remove all namespaced keys safely
      Object.values(ADVANCED_STORAGE_KEYS).forEach((k) => {
        try { window.localStorage.removeItem(k); } catch (e) {}
      });
      Object.values(STORAGE_KEYS).forEach((k) => {
        try { window.localStorage.removeItem(k); } catch (e) {}
      });
      try { window.localStorage.removeItem(USER_STORIES_STORAGE_KEY); } catch (e) {}

      setConfirmResetAllOpen(false);
      showToast('Local Quill storage reset. Refreshing session...', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      console.warn('Reset error:', err);
      showToast('Could not reset local storage.', 'error');
    }
  };

  const currentAccent = profilePreferences?.accent || 'terracotta';
  const currentAmbience = profilePreferences?.ambience || 'paper';
  const currentPenName = profilePreferences?.penName || 'Reader';

  return (
    <div
      className="quill-app-shell"
      style={{ backgroundColor: 'var(--color-paper, #F8F5EE)', minHeight: '100vh' }}
    >
      {/* Light Top Navigation Header */}
      <CommunityHeader
        searchQuery=""
        onSearchChange={() => {}}
        onSearchClear={() => {}}
        onNavigate={onNavigate}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      <div
        className="quill-dashboard-layout"
        style={{
          paddingTop: 'var(--space-8)',
          paddingBottom: 'var(--space-16)',
          alignItems: 'start'
        }}
      >
        {/* Left Navigation Rail */}
        <aside className="quill-dashboard-sidebar">
          <CommunityLeftNav
            activeRoute="/profile"
            onNavigate={onNavigate}
          />
        </aside>

        {/* Main Content Area */}
        <main
          className="quill-dashboard-main"
          style={{ minWidth: 0, gridColumn: 'span 2' }}
        >
          {/* Page Header */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <span className="text-eyebrow" style={{ color: 'var(--color-accent)' }}>
              Personal Reading Room
            </span>
            <h1
              className="font-serif text-h1"
              style={{
                color: 'var(--color-text-primary)',
                marginTop: 'var(--space-1)',
                marginBottom: 'var(--space-2)'
              }}
            >
              Your Space & Identity
            </h1>
            <p
              className="text-body"
              style={{ color: 'var(--color-text-secondary)', maxWidth: '580px' }}
            >
              Adjust your reading ambiance, review your reading journey, and retain total control over your local library.
            </p>
          </div>

          {/* 1. Reader Identity Card */}
          <section
            className="quill-surface-card"
            style={{
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-6)',
              backgroundColor: '#FFFDFA',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
              <Avatar name={currentPenName} size="lg" />

              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
                  {isEditingPenName ? (
                    <form onSubmit={handleSavePenName} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={penNameInput}
                        onChange={(e) => setPenNameInput(e.target.value)}
                        className="quill-input"
                        autoFocus
                        maxLength={40}
                        style={{ fontSize: '1.1rem', fontWeight: 600, padding: '0.35rem 0.65rem', width: '200px' }}
                      />
                      <button type="submit" className="quill-btn quill-btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPenNameInput(currentPenName);
                          setIsEditingPenName(false);
                        }}
                        className="quill-btn quill-btn-ghost"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <h2 className="font-serif" style={{ fontSize: '1.45rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                        {currentPenName}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setIsEditingPenName(true)}
                        className="quill-btn quill-btn-ghost"
                        style={{ fontSize: '0.78rem', padding: '0.2rem 0.5rem', minHeight: '26px' }}
                      >
                        Edit pen name
                      </button>
                    </>
                  )}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-2) 0' }}>
                  Your public signature on local comments and responses.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-success, #3E8A54)'
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Anonymous guest identity · Stored locally in this browser
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Reading Pace & Habits Statistics Grid */}
          <section style={{ marginBottom: 'var(--space-8)' }}>
            <h2
              className="text-eyebrow"
              style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}
            >
              Reading Habits & Momentum
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-4)'
              }}
            >
              {/* Stat 1: Stories Explored */}
              <div
                className="quill-surface-card"
                style={{
                  padding: 'var(--space-5)',
                  backgroundColor: '#FFFDFA',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  Stories Explored
                </span>
                <div className="font-serif" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-accent)', margin: '4px 0' }}>
                  {stats.storiesExplored}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  Tracked on your reading trail
                </span>
              </div>

              {/* Stat 2: Estimated Words Read */}
              <div
                className="quill-surface-card"
                style={{
                  padding: 'var(--space-5)',
                  backgroundColor: '#FFFDFA',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  Words Explored
                </span>
                <div className="font-serif" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '4px 0' }}>
                  {stats.totalWordsRead > 0 ? stats.totalWordsRead.toLocaleString() : '—'}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  Across essays and reflections
                </span>
              </div>

              {/* Stat 3: Bookmarks & Custom Shelves */}
              <div
                className="quill-surface-card"
                style={{
                  padding: 'var(--space-5)',
                  backgroundColor: '#FFFDFA',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  Saved & Organized
                </span>
                <div className="font-serif" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '4px 0' }}>
                  {stats.bookmarksCount}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  In {stats.shelvesCount} {stats.shelvesCount === 1 ? 'custom shelf' : 'custom shelves'}
                </span>
              </div>

              {/* Stat 4: Writer Studio Stories */}
              <div
                className="quill-surface-card"
                style={{
                  padding: 'var(--space-5)',
                  backgroundColor: '#FFFDFA',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  Your Words
                </span>
                <div className="font-serif" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '4px 0' }}>
                  {stats.publishedCount + stats.draftsCount}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  {stats.publishedCount} published · {stats.draftsCount} draft
                </span>
              </div>
            </div>
          </section>

          {/* 3. Visual Ambiance & Accent Customization */}
          <section
            className="quill-surface-card"
            style={{
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-8)',
              backgroundColor: '#FFFDFA',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <h2 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              Visual Atmosphere & Tone
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: '580px' }}>
              Tailor Quill to match your reading mood. Changes take effect instantly across every page and reader view.
            </p>

            {/* Accent Tone Selection */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-3)'
                }}
              >
                Editorial Accent Tone
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'var(--space-3)' }}>
                {ACCENT_OPTIONS.map((opt) => {
                  const isSelected = currentAccent === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectAccent(opt.id)}
                      className="quill-surface-card"
                      style={{
                        padding: 'var(--space-3) var(--space-4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? `2px solid ${opt.color}` : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-surface-secondary)' : '#FFFDFA',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: opt.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: isSelected ? `0 0 0 3px rgba(30, 28, 26, 0.08)` : 'none'
                        }}
                      >
                        {isSelected && (
                          <span style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: 'bold' }}>✓</span>
                        )}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {opt.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                          {opt.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reading Ambiance Selection */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-3)'
                }}
              >
                Reading Surface Ambiance
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                {AMBIENCE_OPTIONS.map((amb) => {
                  const isSelected = currentAmbience === amb.id;
                  return (
                    <button
                      key={amb.id}
                      type="button"
                      onClick={() => handleSelectAmbience(amb.id)}
                      className="quill-surface-card"
                      style={{
                        padding: 'var(--space-4)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                        backgroundColor: amb.bg,
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                        <span className="font-serif" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {amb.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: isSelected ? 'var(--color-accent)' : 'rgba(30, 28, 26, 0.08)',
                            color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)'
                          }}
                        >
                          {isSelected ? 'Active' : amb.badge}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                        {amb.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 4. Reading Trail Section */}
          <section
            className="quill-surface-card"
            style={{
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-8)',
              backgroundColor: '#FFFDFA',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <div>
                <h2 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                  Recent Reading Trail
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
                  Private record of stories you have browsed or read in this browser.
                </p>
              </div>

              {readingTrail.length > 0 && (
                <button
                  type="button"
                  onClick={() => setConfirmClearHistoryOpen(true)}
                  className="quill-btn quill-btn-ghost"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                >
                  Clear trail
                </button>
              )}
            </div>

            {readingTrail.length === 0 ? (
              <div style={{ padding: 'var(--space-8) var(--space-4)', textAlign: 'center', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                <p className="font-serif" style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-2) 0' }}>
                  Your reading trail is quiet.
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '0 0 var(--space-4) 0' }}>
                  As you open and read essays, your personal reading progress will be remembered here.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('/community')}
                  className="quill-btn quill-btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Explore community essays →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {readingTrail.slice(0, 5).map((item) => (
                  <div
                    key={item.storyId}
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-surface-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--space-4)'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title || 'Untitled Story'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {item.author ? `by ${item.author} · ` : ''}
                        {item.progressPercent ? `${Math.round(item.progressPercent)}% read` : 'Visited'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate(`/story/${item.slug || item.storyId}`)}
                      className="quill-btn quill-btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', flexShrink: 0 }}
                    >
                      Resume →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 5. Honest Privacy & Local Data Sovereignty */}
          <section
            className="quill-surface-card"
            style={{
              padding: 'var(--space-6)',
              backgroundColor: '#FFFDFA',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <h2 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              Data Sovereignty & Privacy
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-5)', maxWidth: '600px' }}>
              Quill is completely local-first. We do not track your reading habits, sell telemetry, or sync your private margin notes to an external cloud. Everything lives within your device’s browser storage.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleExportFullBackup}
                className="quill-btn quill-btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
              >
                Export All Library Data (.json)
              </button>

              <button
                type="button"
                onClick={() => setConfirmResetAllOpen(true)}
                className="quill-btn quill-btn-text"
                style={{ fontSize: '0.85rem', color: 'var(--color-error)', padding: '0.45rem 0.8rem' }}
              >
                Reset Local Storage…
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="quill-modal-overlay" style={{ zIndex: 1200 }} onClick={() => setMobileMenuOpen(false)}>
          <div
            style={{
              position: 'relative',
              width: '82%',
              maxWidth: '300px',
              height: '100%',
              backgroundColor: '#FFFDFA',
              boxShadow: 'var(--shadow-lg)',
              padding: 'var(--space-6) var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: 1
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                <span className="brand-wordmark" style={{ fontSize: '1.5rem' }}>
                  quill<span className="brand-dot">.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="quill-icon-btn quill-icon-btn-compact"
                  aria-label="Close navigation"
                >
                  ✕
                </button>
              </div>

              <CommunityLeftNav
                activeRoute="/profile"
                onNavigate={(route) => {
                  setMobileMenuOpen(false);
                  onNavigate(route);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Clear History Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmClearHistoryOpen}
        onClose={() => setConfirmClearHistoryOpen(false)}
        onConfirm={handleClearHistory}
        title="Clear reading trail?"
        description="This will clear your reading history entries and reading progress percentages from this device. Your bookmarks and stories will not be affected."
        confirmLabel="Clear reading trail"
        cancelLabel="Keep trail"
        destructive={true}
      />

      {/* Reset All Local Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmResetAllOpen}
        onClose={() => setConfirmResetAllOpen(false)}
        onConfirm={handleResetAllData}
        title="Reset all local Quill data?"
        description="This will permanently purge your local drafts, bookmarks, reading shelves, margin notes, highlights, and preferences from this browser. This cannot be undone."
        confirmLabel="Reset everything"
        cancelLabel="Keep my data"
        destructive={true}
      />

      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </ToastContainer>
    </div>
  );
}
