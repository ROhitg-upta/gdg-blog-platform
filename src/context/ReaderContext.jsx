import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  STORAGE_KEYS,
  purgeObsoleteAuthStorage,
  safeGetItem,
  safeSetItem,
  createDefaultReader
} from '../utils/readerStorage';

const ReaderContext = createContext(null);

export function ReaderProvider({ children }) {
  // Purge legacy prototype auth credentials on initial mount
  useEffect(() => {
    purgeObsoleteAuthStorage();
  }, []);

  // Reader state
  const [reader, setReader] = useState(() => {
    const saved = safeGetItem(STORAGE_KEYS.READER);
    return saved || createDefaultReader();
  });

  // Bookmarks array of story IDs
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = safeGetItem(STORAGE_KEYS.BOOKMARKS);
    return Array.isArray(saved) ? saved : [];
  });

  // Followed writers array of writer IDs
  const [followedWriterIds, setFollowedWriterIds] = useState(() => {
    const saved = safeGetItem(STORAGE_KEYS.FOLLOWS);
    return Array.isArray(saved) ? saved : [];
  });

  // Ephemeral toast notification state
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Enter as reader (one-click entry action)
  const enterAsReader = useCallback(() => {
    const current = safeGetItem(STORAGE_KEYS.READER) || createDefaultReader();
    const updated = {
      ...current,
      enteredAt: new Date().toISOString()
    };
    safeSetItem(STORAGE_KEYS.READER, updated);
    setReader(updated);
    return updated;
  }, []);

  // Update reader topic interests
  const updateInterests = useCallback((interests) => {
    setReader((prev) => {
      const updated = { ...prev, interests };
      safeSetItem(STORAGE_KEYS.READER, updated);
      return updated;
    });
  }, []);

  // Follow writer
  const followWriter = useCallback((writerId) => {
    if (!writerId) return;
    setFollowedWriterIds((prev) => {
      if (prev.includes(writerId)) return prev;
      const next = [...prev, writerId];
      safeSetItem(STORAGE_KEYS.FOLLOWS, next);
      return next;
    });
  }, []);

  // Unfollow writer
  const unfollowWriter = useCallback((writerId) => {
    if (!writerId) return;
    setFollowedWriterIds((prev) => {
      const next = prev.filter((id) => id !== writerId);
      safeSetItem(STORAGE_KEYS.FOLLOWS, next);
      return next;
    });
  }, []);

  const isFollowing = useCallback((writerId) => {
    return followedWriterIds.includes(writerId);
  }, [followedWriterIds]);

  // Toggle bookmark
  const toggleBookmark = useCallback((storyId, storyTitle = '') => {
    if (!storyId) return false;
    let isNowSaved = false;
    setBookmarks((prev) => {
      const exists = prev.includes(storyId);
      isNowSaved = !exists;
      const next = exists ? prev.filter((id) => id !== storyId) : [...prev, storyId];
      safeSetItem(STORAGE_KEYS.BOOKMARKS, next);
      return next;
    });

    if (isNowSaved) {
      showToast(storyTitle ? `Saved "${storyTitle}" to your shelf.` : 'Story saved to your bookmarks.', 'success');
    } else {
      showToast(storyTitle ? `Removed "${storyTitle}" from your shelf.` : 'Story removed from bookmarks.', 'info');
    }

    return isNowSaved;
  }, [showToast]);

  const isBookmarked = useCallback((storyId) => {
    return bookmarks.includes(storyId);
  }, [bookmarks]);

  const value = {
    reader,
    bookmarks,
    followedWriterIds,
    toasts,
    showToast,
    dismissToast,
    enterAsReader,
    updateInterests,
    followWriter,
    unfollowWriter,
    isFollowing,
    toggleBookmark,
    isBookmarked
  };

  return (
    <ReaderContext.Provider value={value}>
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReader must be used within a ReaderProvider');
  }
  return context;
}
