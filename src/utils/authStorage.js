/**
 * ============================================================================
 * QUILL PROTOTYPE AUTH STORAGE
 * Isolated local storage layer for managing client-side prototype sessions.
 * 
 * NOTE ON SECURITY:
 * This is a frontend-only prototype simulation. Sessions and user records
 * are stored in the user's browser localStorage and are NOT production security.
 * In a real production architecture, passwords must be securely salted and hashed
 * on a trusted server, with sessions issued as HTTP-only cookies or signed JWTs.
 * ============================================================================
 */

export const STORAGE_KEYS = {
  USERS: 'quill.prototype.users',
  SESSION: 'quill.prototype.session'
};

export const DEMO_USER_CREDENTIALS = {
  name: 'Vishal Gupta',
  email: 'demo@quill.local',
  password: 'QuillDemo2026!'
};

/**
 * Safely parse JSON from localStorage with fallback
 */
function safeJsonParse(jsonString, fallback = null) {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.warn('[Quill Auth] Failed to parse local storage payload, recovering gracefully:', err);
    return fallback;
  }
}

/**
 * Initialize demo account seed if no user repository exists yet
 */
export function initDemoSeed() {
  if (typeof window === 'undefined') return;

  try {
    const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const existingUsers = safeJsonParse(rawUsers, null);

    // Only seed if no user repository has been created yet
    if (!existingUsers || !Array.isArray(existingUsers) || existingUsers.length === 0) {
      const demoUser = {
        id: 'usr_demo_vishal',
        name: DEMO_USER_CREDENTIALS.name,
        firstName: 'Vishal',
        username: 'vishalgupta',
        email: DEMO_USER_CREDENTIALS.email,
        // In prototype simulation, store simulated hash/comparison token
        _protoPassword: DEMO_USER_CREDENTIALS.password,
        avatar: null,
        interests: ['Technology', 'Design', 'AI'],
        joinedAt: new Date().toISOString(),
        onboardingComplete: true
      };

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([demoUser]));
    }
  } catch (err) {
    console.warn('[Quill Auth] Local storage inaccessible for demo seed:', err);
  }
}

/**
 * Retrieve all prototype user records
 */
export function getStoredUsers() {
  if (typeof window === 'undefined') return [];
  initDemoSeed();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    const users = safeJsonParse(data, []);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

/**
 * Save updated user records to prototype repository
 */
export function saveStoredUsers(users) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.warn('[Quill Auth] Failed to save users to local storage:', err);
  }
}

/**
 * Retrieve active prototype session
 */
export function getStoredSession() {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    const session = safeJsonParse(data, null);
    if (session && session.userId && session.isAuthenticated) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save active session
 */
export function saveStoredSession(session) {
  if (typeof window === 'undefined') return;
  try {
    // Session object strictly avoids passwords
    const cleanSession = {
      userId: session.userId,
      createdAt: session.createdAt || new Date().toISOString(),
      isAuthenticated: true
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(cleanSession));
  } catch (err) {
    console.warn('[Quill Auth] Failed to persist session:', err);
  }
}

/**
 * Clear current session (logout) without destroying user records
 */
export function clearStoredSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (err) {
    console.warn('[Quill Auth] Failed to clear session:', err);
  }
}

/**
 * Strip internal simulation fields before presenting user object to public state
 */
export function sanitizeUser(user) {
  if (!user) return null;
  const { _protoPassword, ...safeUser } = user;
  return safeUser;
}
