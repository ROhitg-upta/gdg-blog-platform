/**
 * ============================================================================
 * QUILL ADVANCED STORAGE ENGINE (LOCAL-FIRST)
 * Browser-local storage layer for reader highlights, margin notes, reading history,
 * reactions, responses, search history, bookmark collections, and version snapshots.
 *
 * NOTE & HONESTY STATEMENT:
 * This data is stored strictly in the local browser via localStorage.
 * No remote server, cloud synchronization, or multi-user backend is used.
 * ============================================================================
 */

export const ADVANCED_STORAGE_KEYS = {
  HIGHLIGHTS: 'quill.highlights.v1',
  NOTES: 'quill.notes.v1',
  READING_HISTORY: 'quill.reading-history.v1',
  REACTIONS: 'quill.reactions.v1',
  RESPONSES: 'quill.responses.v1',
  SEARCH_HISTORY: 'quill.search-history.v1',
  BOOKMARK_COLLECTIONS: 'quill.bookmark-collections.v1',
  STORY_VERSIONS: 'quill.story-versions.v1',
  WRITING_GOALS: 'quill.writing-goals.v1',
  PROFILE_PREFERENCES: 'quill.profile-preferences.v1'
};

function safeGet(key, fallback) {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn(`[Quill Advanced Storage] Failed parsing ${key}:`, err);
    return fallback;
  }
}

function safeSet(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[Quill Advanced Storage] Failed writing ${key}:`, err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// 1. HIGHLIGHTS & QUOTES
// -----------------------------------------------------------------------------
export function getStoredHighlights(storyId = null) {
  const all = safeGet(ADVANCED_STORAGE_KEYS.HIGHLIGHTS, []);
  if (!Array.isArray(all)) return [];
  if (!storyId) return all;
  return all.filter((h) => h && h.storyId === storyId);
}

export function saveHighlight({ storyId, text, blockIndex = 0, color = 'terracotta' }) {
  if (!storyId || !text || !text.trim()) return null;
  const all = getStoredHighlights();
  const newHighlight = {
    id: `hl-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    storyId,
    text: text.trim(),
    blockIndex,
    color,
    createdAt: new Date().toISOString()
  };
  const updated = [newHighlight, ...all];
  safeSet(ADVANCED_STORAGE_KEYS.HIGHLIGHTS, updated);
  return newHighlight;
}

export function removeHighlight(highlightId) {
  if (!highlightId) return false;
  const all = getStoredHighlights();
  const updated = all.filter((h) => h.id !== highlightId);
  safeSet(ADVANCED_STORAGE_KEYS.HIGHLIGHTS, updated);
  return true;
}

// -----------------------------------------------------------------------------
// 2. MARGIN NOTES
// -----------------------------------------------------------------------------
export function getStoredNotes(storyId = null) {
  const all = safeGet(ADVANCED_STORAGE_KEYS.NOTES, []);
  if (!Array.isArray(all)) return [];
  if (!storyId) return all;
  return all.filter((n) => n && n.storyId === storyId);
}

export function saveNote({ storyId, text, id = null, quote = '' }) {
  if (!storyId || !text || !text.trim()) return null;
  const all = getStoredNotes();
  const now = new Date().toISOString();

  if (id) {
    const updated = all.map((n) => {
      if (n.id === id) {
        return { ...n, text: text.trim(), updatedAt: now };
      }
      return n;
    });
    safeSet(ADVANCED_STORAGE_KEYS.NOTES, updated);
    return updated.find((n) => n.id === id);
  }

  const newNote = {
    id: `note-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    storyId,
    quote: quote ? quote.trim() : '',
    text: text.trim(),
    createdAt: now,
    updatedAt: now
  };
  safeSet(ADVANCED_STORAGE_KEYS.NOTES, [newNote, ...all]);
  return newNote;
}

export function deleteNote(noteId) {
  if (!noteId) return false;
  const all = getStoredNotes();
  const updated = all.filter((n) => n.id !== noteId);
  safeSet(ADVANCED_STORAGE_KEYS.NOTES, updated);
  return true;
}

// -----------------------------------------------------------------------------
// 3. READING HISTORY & PROGRESS
// -----------------------------------------------------------------------------
export function getReadingHistory() {
  const all = safeGet(ADVANCED_STORAGE_KEYS.READING_HISTORY, []);
  if (!Array.isArray(all)) return [];
  return all.filter((entry) => entry && entry.storyId);
}

export function updateReadingProgress({ storyId, slug, title, authorName, progress = 0 }) {
  if (!storyId) return;
  const all = getReadingHistory();
  const now = new Date().toISOString();
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const existingIdx = all.findIndex((entry) => entry.storyId === storyId);
  let updated;

  const entryData = {
    storyId,
    slug: slug || '',
    title: title || 'Untitled Story',
    authorName: authorName || 'Writer',
    progress: clampedProgress,
    lastReadAt: now
  };

  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = {
      ...updated[existingIdx],
      ...entryData
    };
  } else {
    updated = [entryData, ...all];
  }

  // Keep latest 25 history entries
  safeSet(ADVANCED_STORAGE_KEYS.READING_HISTORY, updated.slice(0, 25));
}

export function removeReadingHistoryEntry(storyId) {
  if (!storyId) return;
  const all = getReadingHistory();
  const updated = all.filter((e) => e.storyId !== storyId);
  safeSet(ADVANCED_STORAGE_KEYS.READING_HISTORY, updated);
}

export function clearReadingHistory() {
  safeSet(ADVANCED_STORAGE_KEYS.READING_HISTORY, []);
}

export function getMostRecentIncompleteStory() {
  const all = getReadingHistory();
  // An incomplete story has progress between 5% and 88%
  return all.find((entry) => entry.progress >= 5 && entry.progress <= 88) || null;
}

// -----------------------------------------------------------------------------
// 4. STORY REACTIONS
// -----------------------------------------------------------------------------
export function getStoredReactions() {
  const map = safeGet(ADVANCED_STORAGE_KEYS.REACTIONS, {});
  return typeof map === 'object' && map !== null ? map : {};
}

export function getStoryReaction(storyId) {
  if (!storyId) return null;
  const map = getStoredReactions();
  return map[storyId] || null;
}

export function toggleStoryReaction(storyId, reactionType = 'applaud') {
  if (!storyId) return null;
  const map = { ...getStoredReactions() };
  const current = map[storyId];

  if (current === reactionType) {
    delete map[storyId];
    safeSet(ADVANCED_STORAGE_KEYS.REACTIONS, map);
    return null;
  }

  map[storyId] = reactionType;
  safeSet(ADVANCED_STORAGE_KEYS.REACTIONS, map);
  return reactionType;
}

// -----------------------------------------------------------------------------
// 5. LOCAL STORY RESPONSES ("Leave a thought")
// -----------------------------------------------------------------------------
export function getStoredResponses(storyId = null) {
  const all = safeGet(ADVANCED_STORAGE_KEYS.RESPONSES, []);
  if (!Array.isArray(all)) return [];
  if (!storyId) return all;
  return all.filter((r) => r && r.storyId === storyId);
}

export function saveResponse({ storyId, text, authorName = 'Reader', id = null }) {
  if (!storyId || !text || !text.trim()) return null;
  const all = getStoredResponses();
  const now = new Date().toISOString();

  if (id) {
    const updated = all.map((r) => {
      if (r.id === id) {
        return { ...r, text: text.trim(), updatedAt: now };
      }
      return r;
    });
    safeSet(ADVANCED_STORAGE_KEYS.RESPONSES, updated);
    return updated.find((r) => r.id === id);
  }

  const newResponse = {
    id: `resp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    storyId,
    text: text.trim(),
    authorName: authorName || 'Reader',
    createdAt: now,
    updatedAt: now
  };
  safeSet(ADVANCED_STORAGE_KEYS.RESPONSES, [newResponse, ...all]);
  return newResponse;
}

export function deleteResponse(responseId) {
  if (!responseId) return false;
  const all = getStoredResponses();
  const updated = all.filter((r) => r.id !== responseId);
  safeSet(ADVANCED_STORAGE_KEYS.RESPONSES, updated);
  return true;
}

// -----------------------------------------------------------------------------
// 6. SEARCH HISTORY
// -----------------------------------------------------------------------------
export function getRecentSearches() {
  const list = safeGet(ADVANCED_STORAGE_KEYS.SEARCH_HISTORY, []);
  return Array.isArray(list) ? list.slice(0, 5) : [];
}

export function addRecentSearch(query) {
  if (!query || !query.trim()) return;
  const trimmed = query.trim();
  const list = getRecentSearches().filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
  const updated = [trimmed, ...list].slice(0, 5);
  safeSet(ADVANCED_STORAGE_KEYS.SEARCH_HISTORY, updated);
}

export function clearRecentSearches() {
  safeSet(ADVANCED_STORAGE_KEYS.SEARCH_HISTORY, []);
}

// -----------------------------------------------------------------------------
// 7. BOOKMARK SHELVES / CUSTOM COLLECTIONS
// -----------------------------------------------------------------------------
export function getBookmarkCollections() {
  const list = safeGet(ADVANCED_STORAGE_KEYS.BOOKMARK_COLLECTIONS, []);
  if (Array.isArray(list) && list.length > 0) return list;

  // Initial starter shelves
  const initial = [
    {
      id: 'shelf-weekend-reads',
      name: 'Weekend reads',
      description: 'Longer contemplative essays for unhurried mornings.',
      storyIds: ['story-cathedrals-silicon'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'shelf-craft-notes',
      name: 'Design & Craft',
      description: 'Typography, physical space, and aesthetic systems.',
      storyIds: ['story-silence-margins'],
      createdAt: new Date().toISOString()
    }
  ];
  safeSet(ADVANCED_STORAGE_KEYS.BOOKMARK_COLLECTIONS, initial);
  return initial;
}

export function createBookmarkCollection(name, description = '') {
  if (!name || !name.trim()) return null;
  const list = getBookmarkCollections();
  const newCollection = {
    id: `shelf-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    description: description ? description.trim() : '',
    storyIds: [],
    createdAt: new Date().toISOString()
  };
  const updated = [...list, newCollection];
  safeSet(ADVANCED_STORAGE_KEYS.BOOKMARK_COLLECTIONS, updated);
  return newCollection;
}

export function updateBookmarkCollection(id, updates) {
  if (!id) return;
  const list = getBookmarkCollections();
  const updated = list.map((c) => (c.id === id ? { ...c, ...updates } : c));
  safeSet(ADVANCED_STORAGE_KEYS.BOOKMARK_COLLECTIONS, updated);
}

export function deleteBookmarkCollection(id) {
  if (!id) return;
  const list = getBookmarkCollections();
  const updated = list.filter((c) => c.id !== id);
  safeSet(ADVANCED_STORAGE_KEYS.BOOKMARK_COLLECTIONS, updated);
}

export function toggleStoryInCollection(collectionId, storyId) {
  if (!collectionId || !storyId) return false;
  const list = getBookmarkCollections();
  let isInShelf = false;
  const updated = list.map((col) => {
    if (col.id === collectionId) {
      const exists = col.storyIds.includes(storyId);
      isInShelf = !exists;
      const storyIds = exists
        ? col.storyIds.filter((id) => id !== storyId)
        : [...col.storyIds, storyId];
      return { ...col, storyIds };
    }
    return col;
  });
  safeSet(ADVANCED_STORAGE_KEYS.BOOKMARK_COLLECTIONS, updated);
  return isInShelf;
}

// -----------------------------------------------------------------------------
// 8. WRITER STORY VERSION SNAPSHOTS
// -----------------------------------------------------------------------------
export function getStoryVersions(storyId = null) {
  const all = safeGet(ADVANCED_STORAGE_KEYS.STORY_VERSIONS, []);
  if (!Array.isArray(all)) return [];
  if (!storyId) return all;
  return all.filter((v) => v && v.storyId === storyId);
}

export const getStorySnapshots = getStoryVersions;

export function createStorySnapshot(story, note = 'Manual snapshot') {
  if (!story || !story.id) return null;
  const all = getStoryVersions();
  const storySnapshots = all.filter((v) => v.storyId === story.id);

  const snapshot = {
    id: `ver-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    storyId: story.id,
    timestamp: new Date().toISOString(),
    title: story.title || 'Untitled',
    subtitle: story.subtitle || story.excerpt || '',
    content: Array.isArray(story.content) ? JSON.parse(JSON.stringify(story.content)) : [],
    topic: story.topic || 'Writing',
    artworkId: story.artworkId || 'portal',
    wordCount: story.wordCount || 0,
    status: story.status || 'draft',
    note
  };

  // Keep maximum 10 versions per story
  const updatedForStory = [snapshot, ...storySnapshots].slice(0, 10);
  const otherStories = all.filter((v) => v.storyId !== story.id);
  safeSet(ADVANCED_STORAGE_KEYS.STORY_VERSIONS, [...updatedForStory, ...otherStories]);
  return snapshot;
}

// -----------------------------------------------------------------------------
// 9. WRITING GOALS
// -----------------------------------------------------------------------------
export function getWritingGoal() {
  const saved = safeGet(ADVANCED_STORAGE_KEYS.WRITING_GOALS, null);
  if (saved && typeof saved === 'object') return saved;
  return {
    enabled: true,
    targetWords: 500,
    period: 'daily' // 'daily' | 'weekly'
  };
}

export function saveWritingGoal(goal) {
  safeSet(ADVANCED_STORAGE_KEYS.WRITING_GOALS, goal);
}

// -----------------------------------------------------------------------------
// 10. PROFILE PREFERENCES (ACCENT & AMBIENCE)
// -----------------------------------------------------------------------------
export function getProfilePreferences() {
  const saved = safeGet(ADVANCED_STORAGE_KEYS.PROFILE_PREFERENCES, null);
  const validAccents = ['terracotta', 'lavender', 'sage', 'ochre'];
  const validAmbiences = ['paper', 'sepia', 'studio'];

  if (saved && typeof saved === 'object') {
    return {
      accent: validAccents.includes(saved.accent) ? saved.accent : 'terracotta',
      ambience: validAmbiences.includes(saved.ambience) ? saved.ambience : 'paper',
      penName: saved.penName || 'Reader'
    };
  }
  return {
    accent: 'terracotta',
    ambience: 'paper',
    penName: 'Reader'
  };
}

export function saveProfilePreferences(prefs) {
  safeSet(ADVANCED_STORAGE_KEYS.PROFILE_PREFERENCES, prefs);
}

// -----------------------------------------------------------------------------
// 11. CASCADING DATA CLEANUP ON STORY DELETION
// -----------------------------------------------------------------------------
/**
 * Permanently cleans up all user-created records associated with a deleted story.
 * Never calls localStorage.clear().
 */
export function cleanupStoryUserData(storyId) {
  if (!storyId) return;

  // 1. Remove Highlights
  const highlights = getStoredHighlights().filter((h) => h.storyId !== storyId);
  safeSet(ADVANCED_STORAGE_KEYS.HIGHLIGHTS, highlights);

  // 2. Remove Margin Notes
  const notes = getStoredNotes().filter((n) => n.storyId !== storyId);
  safeSet(ADVANCED_STORAGE_KEYS.NOTES, notes);

  // 3. Remove Reading History
  removeReadingHistoryEntry(storyId);

  // 4. Remove Reactions
  const reactions = { ...getStoredReactions() };
  if (reactions[storyId]) {
    delete reactions[storyId];
    safeSet(ADVANCED_STORAGE_KEYS.REACTIONS, reactions);
  }

  // 5. Remove Responses
  const responses = getStoredResponses().filter((r) => r.storyId !== storyId);
  safeSet(ADVANCED_STORAGE_KEYS.RESPONSES, responses);

  // 6. Remove Versions
  const versions = getStoryVersions().filter((v) => v.storyId !== storyId);
  safeSet(ADVANCED_STORAGE_KEYS.STORY_VERSIONS, versions);

  // 7. Remove story from all Custom Bookmark Shelves
  const collections = getBookmarkCollections().map((col) => ({
    ...col,
    storyIds: col.storyIds.filter((id) => id !== storyId)
  }));
  safeSet(ADVANCED_STORAGE_KEYS.BOOKMARK_COLLECTIONS, collections);
}
