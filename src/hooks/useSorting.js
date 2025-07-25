import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing sorting state with localStorage persistence
 * Supports multi-level sorting
 *
 * @param {string} storageKey - Key for localStorage persistence
 * @param {Object} initialSortState - Initial sort state
 * @returns {Array} - [sortConfig, setSortField, clearSorting, toggleSortOrder, addSortField, removeSortField]
 */
const useSorting = (
  storageKey = "primarilyDashboardSorting",
  initialSortState = {}
) => {
  // Default sort structure
  const defaultSortState = {
    // Primary sort field and order
    primary: {
      field: "updatedAt",
      order: "desc",
    },
    // Secondary sort fields and orders (for multi-level sorting)
    secondary: [],
    ...initialSortState,
  };

  // Initialize state from localStorage or default values
  const [sortConfig, setSortConfig] = useState(() => {
    try {
      const storedSortConfig = localStorage.getItem(storageKey);
      if (storedSortConfig) {
        return { ...defaultSortState, ...JSON.parse(storedSortConfig) };
      }
    } catch (error) {
      console.error("Error loading sort config from localStorage:", error);
    }
    return defaultSortState;
  });

  // Update localStorage when sort config changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(sortConfig));
    } catch (error) {
      console.error("Error saving sort config to localStorage:", error);
    }
  }, [sortConfig, storageKey]);

  // Set primary sort field and order
  const setSortField = useCallback((field, order = null) => {
    setSortConfig((prevConfig) => {
      // If sorting by the same field, toggle order unless explicitly specified
      const newOrder =
        order !== null
          ? order
          : prevConfig.primary.field === field &&
            prevConfig.primary.order === "asc"
          ? "desc"
          : "asc";

      return {
        ...prevConfig,
        primary: {
          field,
          order: newOrder,
        },
      };
    });
  }, []);

  // Toggle sort order for primary field
  const toggleSortOrder = useCallback(() => {
    setSortConfig((prevConfig) => ({
      ...prevConfig,
      primary: {
        ...prevConfig.primary,
        order: prevConfig.primary.order === "asc" ? "desc" : "asc",
      },
    }));
  }, []);

  // Add a secondary sort field
  const addSortField = useCallback((field, order = "asc") => {
    setSortConfig((prevConfig) => {
      // Don't add if it's already the primary sort field
      if (prevConfig.primary.field === field) {
        return prevConfig;
      }

      // Don't add if it's already in the secondary sort fields
      const existingIndex = prevConfig.secondary.findIndex(
        (sort) => sort.field === field
      );
      if (existingIndex >= 0) {
        // Update the order if it already exists
        const newSecondary = [...prevConfig.secondary];
        newSecondary[existingIndex] = { field, order };
        return {
          ...prevConfig,
          secondary: newSecondary,
        };
      }

      // Add as a new secondary sort field
      return {
        ...prevConfig,
        secondary: [...prevConfig.secondary, { field, order }],
      };
    });
  }, []);

  // Remove a secondary sort field
  const removeSortField = useCallback((field) => {
    setSortConfig((prevConfig) => ({
      ...prevConfig,
      secondary: prevConfig.secondary.filter((sort) => sort.field !== field),
    }));
  }, []);

  // Clear all sorting and reset to default
  const clearSorting = useCallback(() => {
    setSortConfig(defaultSortState);
  }, [defaultSortState]);

  // Promote a secondary sort field to primary
  const promoteToPrimary = useCallback((index) => {
    setSortConfig((prevConfig) => {
      if (index < 0 || index >= prevConfig.secondary.length) {
        return prevConfig;
      }

      const newPrimary = prevConfig.secondary[index];
      const newSecondary = [...prevConfig.secondary];
      newSecondary.splice(index, 1);

      // Add the old primary to the beginning of secondary
      newSecondary.unshift({
        field: prevConfig.primary.field,
        order: prevConfig.primary.order,
      });

      return {
        primary: newPrimary,
        secondary: newSecondary,
      };
    });
  }, []);

  return [
    sortConfig,
    setSortField,
    clearSorting,
    toggleSortOrder,
    addSortField,
    removeSortField,
    promoteToPrimary,
  ];
};

export default useSorting;
