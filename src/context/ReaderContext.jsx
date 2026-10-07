import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  STORAGE_KEYS,
  purgeObsoleteAuthStorage,
  safeGetItem,
  safeSetItem,
  createDefaultReader
} from '../utils/readerStorage';
import { getAllHydratedStories, getStoryBySlug as getStaticStoryBySlug } from '../data/communityData';
import {
  getUserStories,
  saveUserStories,
  hydrateUserStory,
  validateStoryForPublish,
  generateSlug,
  calculateReadingMetrics
} from '../utils/storyStorage';

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

  // ==========================================================================
  // USER STORIES STATE & LOCAL LIFECYCLE
  // ==========================================================================
  const [userStories, setUserStories] = useState(() => {
    return getUserStories();
  });

  /**
   * Save (create or update) a user story draft.
   */
  const saveStory = useCallback((storyData) => {
    if (!storyData || !storyData.id) return null;

    const existingSlugs = userStories
      .filter((s) => s.id !== storyData.id)
      .map((s) => s.slug);

    const metrics = calculateReadingMetrics(
      storyData.title,
      storyData.excerpt || storyData.subtitle,
      storyData.content
    );

    const slug = storyData.slug || generateSlug(storyData.title, existingSlugs);

    const normalizedStory = {
      ...storyData,
      slug,
      subtitle: storyData.subtitle || storyData.excerpt || '',
      excerpt: storyData.excerpt || storyData.subtitle || '',
      updatedAt: new Date().toISOString(),
      readingTime: metrics.readingTime,
      readTime: metrics.readTime,
      wordCount: metrics.wordCount
    };

    setUserStories((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === normalizedStory.id);
      let updated;
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = normalizedStory;
      } else {
        updated = [normalizedStory, ...prev];
      }
      saveUserStories(updated);
      return updated;
    });

    return normalizedStory;
  }, [userStories]);

  /**
   * Publish a user story. Validates completeness before marking status as published.
   */
  const publishStory = useCallback((storyId) => {
    const rawStory = userStories.find((s) => s.id === storyId);
    if (!rawStory) {
      return { success: false, errors: { general: 'Story could not be found.' } };
    }

    const validation = validateStoryForPublish(rawStory);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const otherSlugs = userStories
      .filter((s) => s.id !== storyId)
      .map((s) => s.slug);

    const slug = rawStory.slug || generateSlug(rawStory.title, otherSlugs);
    const now = new Date().toISOString();
    const metrics = calculateReadingMetrics(
      rawStory.title,
      rawStory.excerpt || rawStory.subtitle,
      rawStory.content
    );

    const publishedStory = {
      ...rawStory,
      slug,
      status: 'published',
      publishedAt: rawStory.publishedAt || now,
      updatedAt: now,
      readingTime: metrics.readingTime,
      readTime: metrics.readTime,
      wordCount: metrics.wordCount
    };

    setUserStories((prev) => {
      const updated = prev.map((s) => (s.id === storyId ? publishedStory : s));
      saveUserStories(updated);
      return updated;
    });

    showToast('Your story is now part of your local Quill collection.', 'success');
    return { success: true, story: publishedStory };
  }, [userStories, showToast]);

  /**
   * Archive a user story.
   */
  const archiveStory = useCallback((storyId) => {
    setUserStories((prev) => {
      const updated = prev.map((s) => {
        if (s.id === storyId) {
          return { ...s, status: 'archived', updatedAt: new Date().toISOString() };
        }
        return s;
      });
      saveUserStories(updated);
      return updated;
    });
    showToast('Story moved to your local archive.', 'info');
  }, [showToast]);

  /**
   * Restore an archived story to draft or published status.
   */
  const restoreStory = useCallback((storyId, targetStatus = 'draft') => {
    setUserStories((prev) => {
      const updated = prev.map((s) => {
        if (s.id === storyId) {
          return { ...s, status: targetStatus, updatedAt: new Date().toISOString() };
        }
        return s;
      });
      saveUserStories(updated);
      return updated;
    });
    showToast(
      targetStatus === 'published'
        ? 'Story restored to your published collection.'
        : 'Story restored to your drafts.',
      'success'
    );
  }, [showToast]);

  /**
   * Delete a user story permanently.
   * Also cleans up any bookmark for that story.
   */
  const deleteStory = useCallback((storyId) => {
    setUserStories((prev) => {
      const updated = prev.filter((s) => s.id !== storyId);
      saveUserStories(updated);
      return updated;
    });

    // Remove from bookmarks if bookmarked
    setBookmarks((prev) => {
      if (!prev.includes(storyId)) return prev;
      const next = prev.filter((id) => id !== storyId);
      safeSetItem(STORAGE_KEYS.BOOKMARKS, next);
      return next;
    });

    showToast('Story permanently removed from this device.', 'info');
  }, [showToast]);

  /**
   * Retrieve a user story by ID (for editing or preview).
   */
  const getUserStory = useCallback((storyId) => {
    if (!storyId) return null;
    const raw = userStories.find((s) => s.id === storyId);
    return raw ? hydrateUserStory(raw) : null;
  }, [userStories]);

  /**
   * Unified collection of all published stories:
   * Merges reader-authored published stories (at top/recent) with curated static stories.
   */
  const allPublishedStories = useMemo(() => {
    const staticStories = getAllHydratedStories();
    const publishedUserStories = userStories
      .filter((s) => s.status === 'published')
      .map(hydrateUserStory);

    // User published stories sorted latest first
    const sortedUserStories = [...publishedUserStories].sort((a, b) => {
      const timeA = new Date(a.publishedAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.publishedAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    });

    return [...sortedUserStories, ...staticStories];
  }, [userStories]);

  /**
   * Unified story lookup by slug across user published stories and static stories.
   */
  const findStoryBySlug = useCallback((slug) => {
    if (!slug) return null;
    const cleanSlug = slug.trim().toLowerCase();

    // Check user published stories first
    const publishedUserStory = userStories.find(
      (s) => s.status === 'published' && s.slug && s.slug.trim().toLowerCase() === cleanSlug
    );
    if (publishedUserStory) {
      return hydrateUserStory(publishedUserStory);
    }

    // Fallback to static sample stories
    return getStaticStoryBySlug(cleanSlug);
  }, [userStories]);

  /**
   * Unified story lookup by ID for preview (finds drafts, published, or static stories).
   */
  const findStoryById = useCallback((id) => {
    if (!id) return null;
    const userStory = userStories.find((s) => s.id === id);
    if (userStory) {
      return hydrateUserStory(userStory);
    }
    const allStatic = getAllHydratedStories();
    return allStatic.find((s) => s.id === id) || null;
  }, [userStories]);

  /**
   * Related stories helper respecting the unified story collection.
   */
  const getUnifiedRelatedStories = useCallback((currentStoryId, topic, authorId, limit = 3) => {
    const candidates = allPublishedStories.filter((s) => s.id !== currentStoryId);

    const sameTopic = candidates.filter((s) => s.topic === topic);
    const sameAuthor = candidates.filter(
      (s) => s.authorId === authorId && !sameTopic.some((t) => t.id === s.id)
    );
    const others = candidates.filter(
      (s) => !sameTopic.some((t) => t.id === s.id) && !sameAuthor.some((a) => a.id === s.id)
    );

    return [...sameTopic, ...sameAuthor, ...others].slice(0, limit);
  }, [allPublishedStories]);

  const value = {
    reader,
    bookmarks,
    followedWriterIds,
    toasts,
    userStories,
    allPublishedStories,
    showToast,
    dismissToast,
    enterAsReader,
    updateInterests,
    followWriter,
    unfollowWriter,
    isFollowing,
    toggleBookmark,
    isBookmarked,
    saveStory,
    publishStory,
    archiveStory,
    restoreStory,
    deleteStory,
    getUserStory,
    findStoryBySlug,
    findStoryById,
    getUnifiedRelatedStories
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
