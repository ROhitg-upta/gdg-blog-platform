import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredUsers,
  saveStoredUsers,
  getStoredSession,
  saveStoredSession,
  clearStoredSession,
  sanitizeUser,
  initDemoSeed
} from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);

  // Hydrate session on application mount before routes evaluate
  useEffect(() => {
    initDemoSeed();
    const session = getStoredSession();
    if (session && session.userId) {
      const users = getStoredUsers();
      const matchedUser = users.find((u) => u.id === session.userId);
      if (matchedUser) {
        setUser(sanitizeUser(matchedUser));
      } else {
        clearStoredSession();
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsHydrating(false);
  }, []);

  /**
   * Prototype Login action
   */
  const login = async ({ email, password }) => {
    // Small natural delay for realistic form submission
    await new Promise((r) => setTimeout(r, 250));

    const cleanEmail = (email || '').trim().toLowerCase();
    const users = getStoredUsers();

    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u._protoPassword === password
    );

    if (!matchedUser) {
      return {
        success: false,
        error: "We couldn’t find a matching account. Check your details or create a new account."
      };
    }

    // Create session
    const session = {
      userId: matchedUser.id,
      createdAt: new Date().toISOString(),
      isAuthenticated: true
    };

    saveStoredSession(session);
    const safeUser = sanitizeUser(matchedUser);
    setUser(safeUser);

    return {
      success: true,
      user: safeUser
    };
  };

  /**
   * Prototype Signup action
   */
  const signup = async ({ name, email, password }) => {
    await new Promise((r) => setTimeout(r, 300));

    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = getStoredUsers();

    // Prevent duplicate email registrations
    const emailExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return {
        success: false,
        error: "An account with this email address already exists. Please sign in instead."
      };
    }

    const firstName = cleanName.split(/\s+/)[0] || 'Reader';
    const username = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || `user${Date.now().toString().slice(-4)}`;

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: cleanName,
      firstName,
      username,
      email: cleanEmail,
      _protoPassword: password,
      avatar: null,
      interests: [],
      joinedAt: new Date().toISOString(),
      onboardingComplete: false
    };

    // Save into local prototype repository
    const updatedUsers = [...users, newUser];
    saveStoredUsers(updatedUsers);

    // Persist new session
    const session = {
      userId: newUser.id,
      createdAt: new Date().toISOString(),
      isAuthenticated: true
    };
    saveStoredSession(session);

    const safeUser = sanitizeUser(newUser);
    setUser(safeUser);

    return {
      success: true,
      user: safeUser
    };
  };

  /**
   * Complete onboarding interest selection
   */
  const completeOnboarding = (interests = []) => {
    if (!user) return { success: false };

    const users = getStoredUsers();
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          interests: interests.length > 0 ? interests : ['Technology', 'Design'],
          onboardingComplete: true
        };
      }
      return u;
    });

    saveStoredUsers(updatedUsers);

    const updatedUser = {
      ...user,
      interests: interests.length > 0 ? interests : ['Technology', 'Design'],
      onboardingComplete: true
    };

    setUser(updatedUser);
    return { success: true, user: updatedUser };
  };

  /**
   * Logout: Clears active session safely
   */
  const logout = () => {
    clearStoredSession();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isHydrating,
    login,
    signup,
    completeOnboarding,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
