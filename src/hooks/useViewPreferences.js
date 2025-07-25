import { useState, useEffect } from "react";

/**
 * Custom hook for managing user view preferences with localStorage persistence
 *
 * @param {string} key - The localStorage key to use for storing preferences
 * @param {Object} defaultPreferences - Default preferences object
 * @returns {[Object, Function]} - Current preferences and update function
 */
const useViewPreferences = (key, defaultPreferences) => {
  // Initialize state from localStorage or default values
  const [preferences, setPreferences] = useState(() => {
    try {
      const storedPreferences = localStorage.getItem(key);
      return storedPreferences
        ? JSON.parse(storedPreferences)
        : defaultPreferences;
    } catch (error) {
      console.error("Error loading preferences from localStorage:", error);
      return defaultPreferences;
    }
  });

  // Update localStorage when preferences change
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(preferences));
    } catch (error) {
      console.error("Error saving preferences to localStorage:", error);
    }
  }, [preferences, key]);

  // Function to update preferences
  const updatePreferences = (newPreferences) => {
    if (typeof newPreferences === "function") {
      setPreferences((prev) => {
        const updated = newPreferences(prev);
        return updated;
      });
    } else {
      setPreferences((prev) => ({
        ...prev,
        ...newPreferences,
      }));
    }
  };

  return [preferences, updatePreferences];
};

export default useViewPreferences;
