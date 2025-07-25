import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing filter state with localStorage persistence
 *
 * @param {string} storageKey - Key for localStorage persistence
 * @param {Object} initialFilters - Initial filter state
 * @returns {Array} - [filters, setFilter, clearFilters, applyFilterPreset]
 */
const useFilters = (
  storageKey = "primarilyDashboardFilters",
  initialFilters = {}
) => {
  // Default filter structure
  const defaultFilters = {
    searchQuery: "",
    lowStock: false,
    outOfStock: false,
    hasImages: false,
    priceRange: { min: "", max: "" },
    tags: [],
    categories: [],
    locations: [],
    dateRange: { start: null, end: null },
    ...initialFilters,
  };

  // Initialize state from localStorage or default values
  const [filters, setFilters] = useState(() => {
    try {
      const storedFilters = localStorage.getItem(storageKey);
      if (storedFilters) {
        const parsedFilters = JSON.parse(storedFilters);

        // Convert date strings back to Date objects
        if (parsedFilters.dateRange) {
          if (parsedFilters.dateRange.start) {
            parsedFilters.dateRange.start = new Date(
              parsedFilters.dateRange.start
            );
          }
          if (parsedFilters.dateRange.end) {
            parsedFilters.dateRange.end = new Date(parsedFilters.dateRange.end);
          }
        }

        return { ...defaultFilters, ...parsedFilters };
      }
    } catch (error) {
      console.error("Error loading filters from localStorage:", error);
    }
    return defaultFilters;
  });

  // Update localStorage when filters change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(filters));
    } catch (error) {
      console.error("Error saving filters to localStorage:", error);
    }
  }, [filters, storageKey]);

  // Set a specific filter value
  const setFilter = useCallback((name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  // Apply a filter preset
  const applyFilterPreset = useCallback(
    (preset) => {
      // Convert date strings to Date objects if needed
      const processedPreset = { ...preset };

      if (preset.dateRange) {
        if (
          preset.dateRange.start &&
          typeof preset.dateRange.start === "string"
        ) {
          processedPreset.dateRange = {
            ...preset.dateRange,
            start: new Date(preset.dateRange.start),
          };
        }

        if (preset.dateRange.end && typeof preset.dateRange.end === "string") {
          processedPreset.dateRange = {
            ...processedPreset.dateRange,
            end: new Date(preset.dateRange.end),
          };
        }
      }

      setFilters((prevFilters) => ({
        ...defaultFilters,
        ...processedPreset,
      }));
    },
    [defaultFilters]
  );

  return [filters, setFilter, clearFilters, applyFilterPreset];
};

export default useFilters;
