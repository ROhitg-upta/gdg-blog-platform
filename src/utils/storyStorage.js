/**
 * ============================================================================
 * QUILL USER STORY STORAGE & LIFECYCLE ENGINE
 * Browser-local storage layer for reader-authored stories, drafts, and archives.
 *
 * NOTE & HONESTY STATEMENT:
 * This prototype persists stories only within the local browser using localStorage.
 * No server backend, cloud sync, or multi-user publishing is implied or simulated.
 * Publishing makes stories part of the local Quill collection on this device.
 * ============================================================================
 */

import { STORIES as STATIC_STORIES } from '../data/communityData';

export const USER_STORIES_STORAGE_KEY = 'quill.user-stories.v1';

/**
 * Safely parse array of user stories from local storage.
 * Recovers gracefully from malformed or missing data.
 */
export function getUserStories() {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(USER_STORIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Validate basic schema for each item
    return parsed.filter(
      (item) => item && typeof item === 'object' && typeof item.id === 'string'
    );
  } catch (err) {
    console.warn('[Quill Story Storage] Failed to parse user stories:', err);
    return [];
  }
}

/**
 * Persist array of user stories safely without touching unrelated keys.
 * Never calls localStorage.clear().
 */
export function saveUserStories(stories) {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    window.localStorage.setItem(
      USER_STORIES_STORAGE_KEY,
      JSON.stringify(Array.isArray(stories) ? stories : [])
    );
    return true;
  } catch (err) {
    console.warn('[Quill Story Storage] Failed to write user stories:', err);
    return false;
  }
}

/**
 * Generate a unique collision-safe story ID.
 */
export function generateStoryId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `story-${timestamp}-${randomPart}`;
}

/**
 * Generate a clean, URL-safe slug from a story title.
 * Automatically resolves collisions against static sample stories and existing user stories.
 */
export function generateSlug(title = '', existingSlugs = []) {
  let base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!base) {
    base = 'untitled-story';
  }

  // Gather static story slugs to prevent collisions with curated stories
  const staticSlugs = STATIC_STORIES.map((s) => s.slug.toLowerCase());
  const allKnownSlugs = new Set([
    ...staticSlugs,
    ...existingSlugs.map((s) => (s ? s.toLowerCase() : ''))
  ]);

  let candidate = base;
  let counter = 2;

  while (allKnownSlugs.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter++;
  }

  return candidate;
}

/**
 * Compute total words and estimated reading time across title, excerpt, and content blocks.
 */
export function calculateReadingMetrics(title = '', excerpt = '', content = []) {
  let textCorpus = `${title} ${excerpt} `;

  if (Array.isArray(content)) {
    content.forEach((block) => {
      if (typeof block === 'string') {
        textCorpus += ` ${block}`;
      } else if (block && typeof block === 'object') {
        if (block.text) textCorpus += ` ${block.text}`;
        if (block.attribution) textCorpus += ` ${block.attribution}`;
        if (Array.isArray(block.items)) {
          textCorpus += ` ${block.items.join(' ')}`;
        }
      }
    });
  }

  const words = textCorpus.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return {
    wordCount: words,
    readingTime: minutes,
    readTime: `${minutes} min read`
  };
}

/**
 * Factory creating a fresh blank draft model with honest local defaults.
 */
export function createEmptyStory() {
  const id = generateStoryId();
  return {
    id,
    slug: '',
    title: '',
    subtitle: '',
    excerpt: '',
    content: [
      {
        type: 'paragraph',
        text: ''
      }
    ],
    topic: 'Writing',
    artworkId: 'portal',
    coverVariant: 'portal',
    status: 'draft', // 'draft' | 'published' | 'archived'
    authorId: 'local-reader',
    authorName: 'Reader',
    authorInitials: 'R',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: null,
    readingTime: 1,
    readTime: '1 min read',
    isUserStory: true
  };
}

/**
 * Validate story fields before publishing.
 * Returns { valid: boolean, errors: Record<string, string> }
 */
export function validateStoryForPublish(story) {
  const errors = {};

  if (!story.title || !story.title.trim()) {
    errors.title = 'Please provide a title for your story.';
  } else if (story.title.trim().length > 120) {
    errors.title = 'Title must be 120 characters or fewer.';
  }

  const excerptText = story.excerpt || story.subtitle || '';
  if (!excerptText.trim()) {
    errors.excerpt = 'Please provide a short excerpt or summary.';
  } else if (excerptText.trim().length > 240) {
    errors.excerpt = 'Excerpt must be 240 characters or fewer.';
  }

  if (!story.topic || !story.topic.trim()) {
    errors.topic = 'Please select a topic.';
  }

  if (!story.artworkId || !story.artworkId.trim()) {
    errors.artworkId = 'Please select a cover artwork.';
  }

  // Validate that content contains at least one non-empty block
  let hasValidContent = false;
  if (Array.isArray(story.content)) {
    hasValidContent = story.content.some((block) => {
      if (typeof block === 'string') return block.trim().length > 0;
      if (block.type === 'paragraph' || block.type === 'heading') {
        return block.text && block.text.trim().length > 0;
      }
      if (block.type === 'quote') {
        return block.text && block.text.trim().length > 0;
      }
      if (block.type === 'list') {
        return Array.isArray(block.items) && block.items.some((i) => i && i.trim().length > 0);
      }
      return false;
    });
  }

  if (!hasValidContent) {
    errors.content = 'Please add at least one paragraph or section to your story body.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Hydrates a user story with author object and formatted display dates
 * so it behaves identically to static sample stories across the app.
 */
export function hydrateUserStory(story) {
  if (!story) return null;

  const dateSource = story.publishedAt || story.updatedAt || story.createdAt;
  const dateObj = new Date(dateSource);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Extract preview paragraphs for feed previews
  const previewParagraphs = [];
  if (Array.isArray(story.content)) {
    story.content.forEach((block) => {
      if (typeof block === 'string' && block.trim()) {
        previewParagraphs.push(block.trim());
      } else if (block && block.type === 'paragraph' && block.text && block.text.trim()) {
        previewParagraphs.push(block.text.trim());
      }
    });
  }

  const fallbackExcerpt = previewParagraphs[0] || 'No excerpt provided.';

  return {
    ...story,
    excerpt: story.excerpt || story.subtitle || fallbackExcerpt,
    subtitle: story.subtitle || story.excerpt || fallbackExcerpt,
    previewContent: previewParagraphs.length > 0 ? previewParagraphs.slice(0, 3) : [story.excerpt || ''],
    date: formattedDate,
    readTime: story.readTime || `${story.readingTime || 1} min read`,
    author: {
      id: 'local-reader',
      name: story.authorName || 'Reader',
      initials: story.authorInitials || 'R',
      bio: 'Author on this local Quill reading desk.',
      avatarBg: '#F8E4D9',
      avatarColor: '#D85A35'
    }
  };
}
