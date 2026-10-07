import { useState, useCallback } from 'react';
import {
  getStoredPreferences,
  saveStoredPreferences,
  createDefaultPreferences
} from '../utils/readerStorage';

export function useReaderPreferences() {
  const [preferences, setPreferences] = useState(() => getStoredPreferences());

  const setTextSize = useCallback((textSize) => {
    setPreferences((prev) => {
      const next = { ...prev, textSize };
      saveStoredPreferences(next);
      return next;
    });
  }, []);

  const setReadingWidth = useCallback((readingWidth) => {
    setPreferences((prev) => {
      const next = { ...prev, readingWidth };
      saveStoredPreferences(next);
      return next;
    });
  }, []);

  const setLineSpacing = useCallback((lineSpacing) => {
    setPreferences((prev) => {
      const next = { ...prev, lineSpacing };
      saveStoredPreferences(next);
      return next;
    });
  }, []);

  const resetPreferences = useCallback(() => {
    const defaults = createDefaultPreferences();
    saveStoredPreferences(defaults);
    setPreferences(defaults);
  }, []);

  return {
    preferences,
    setTextSize,
    setReadingWidth,
    setLineSpacing,
    resetPreferences
  };
}
