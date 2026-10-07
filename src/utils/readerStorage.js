/**
 * ============================================================================
 * QUILL LIGHTWEIGHT READER STORAGE
 * Browser-local storage layer for client-side reader preferences.
 * 
 * DISCLAIMER:
 * This is a frontend prototype context for saving personal reading shelf
 * preferences (bookmarks, followed writers, and topic interests) within
 * the local browser. It is NOT authentication and NOT multi-user security.
 * ============================================================================
 */

export const STORAGE_KEYS = {
  READER: 'quill.reader.v1',
  BOOKMARKS: 'quill.bookmarks.v1',
  FOLLOWS: 'quill.follows.v1'
};

// Legacy auth keys to safely purge once (without touching any unrelated data)
const LEGACY_AUTH_KEYS = [
  'quill.prototype.users',
  'quill.prototype.session'
];

/**
 * Perform a targeted one-time removal of obsolete credential keys.
 * NEVER calls localStorage.clear().
 */
export function purgeObsoleteAuthStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    LEGACY_AUTH_KEYS.forEach((key) => {
      if (window.localStorage.getItem(key) !== null) {
        window.localStorage.removeItem(key);
      }
    });
  } catch (err) {
    // Graceful fallback for restricted storage environments
  }
}

/**
 * Safely parse JSON from localStorage with default fallback
 */
export function safeGetItem(key, fallback = null) {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[Quill Storage] Failed to parse key "${key}", using fallback:`, err);
    return fallback;
  }
}

/**
 * Safely serialize JSON to localStorage
 */
export function safeSetItem(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[Quill Storage] Failed to write key "${key}":`, err);
    return false;
  }
}

export function createDefaultReader() {
  return {
    id: 'local-reader',
    displayName: 'Reader',
    interests: [],
    followedWriterIds: [],
    enteredAt: new Date().toISOString()
  };
}
