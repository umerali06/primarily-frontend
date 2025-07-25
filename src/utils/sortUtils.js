/**
 * Utility functions for sorting
 */

/**
 * Compare two values for sorting
 *
 * @param {any} a - First value
 * @param {any} b - Second value
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {number} - Comparison result (-1, 0, or 1)
 */
export const compareValues = (a, b, order = "asc") => {
  // Handle null/undefined values
  if (a === null || a === undefined) {
    return order === "asc" ? -1 : 1;
  }
  if (b === null || b === undefined) {
    return order === "asc" ? 1 : -1;
  }

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return order === "asc" ? a - b : b - a;
  }

  // Handle date strings
  if (typeof a === "string" && typeof b === "string") {
    // Try to parse as dates if they look like dates
    const datePattern = /^\d{4}-\d{2}-\d{2}|^\d{1,2}\/\d{1,2}\/\d{4}/;
    if (datePattern.test(a) && datePattern.test(b)) {
      const dateA = new Date(a);
      const dateB = new Date(b);
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
    }

    // Regular string comparison
    return order === "asc" ? a.localeCompare(b) : b.localeCompare(a);
  }

  // Handle numbers
  if (typeof a === "number" && typeof b === "number") {
    return order === "asc" ? a - b : b - a;
  }

  // Handle booleans
  if (typeof a === "boolean" && typeof b === "boolean") {
    return order === "asc"
      ? a === b
        ? 0
        : a
        ? 1
        : -1
      : a === b
      ? 0
      : a
      ? -1
      : 1;
  }

  // Handle mixed types - convert to string
  const strA = String(a);
  const strB = String(b);
  return order === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
};

/**
 * Apply multi-level sorting to an array of items
 *
 * @param {Array} items - Array of items to sort
 * @param {Object} sortConfig - Sort configuration object
 * @returns {Array} - Sorted array
 */
export const applySorting = (items, sortConfig) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return [];
  }

  // Create a copy of the items array
  const itemsToSort = [...items];

  // Sort the items based on the sort configuration
  return itemsToSort.sort((a, b) => {
    // Primary sort
    const primaryField = sortConfig.primary.field;
    const primaryOrder = sortConfig.primary.order;

    // Compare primary field
    const primaryComparison = compareValues(
      a[primaryField],
      b[primaryField],
      primaryOrder
    );

    // If primary fields are equal, use secondary sorts
    if (primaryComparison === 0 && sortConfig.secondary.length > 0) {
      // Loop through secondary sorts
      for (const secondarySort of sortConfig.secondary) {
        const secondaryField = secondarySort.field;
        const secondaryOrder = secondarySort.order;

        // Compare secondary field
        const secondaryComparison = compareValues(
          a[secondaryField],
          b[secondaryField],
          secondaryOrder
        );

        // If secondary fields are not equal, return the comparison
        if (secondaryComparison !== 0) {
          return secondaryComparison;
        }
      }
    }

    // Return primary comparison if no secondary sorts or all secondary fields are equal
    return primaryComparison;
  });
};

/**
 * Get sort parameters for API requests
 *
 * @param {Object} sortConfig - Sort configuration object
 * @returns {Object} - Sort parameters for API request
 */
export const getSortParams = (sortConfig) => {
  const params = {};

  // Add primary sort
  params.sortBy = sortConfig.primary.field;
  params.sortOrder = sortConfig.primary.order;

  // Add secondary sorts if supported by API
  if (sortConfig.secondary.length > 0) {
    params.secondarySorts = sortConfig.secondary.map((sort) => ({
      field: sort.field,
      order: sort.order,
    }));
  }

  return params;
};

/**
 * Create a sort function for use with Array.sort()
 *
 * @param {Object} sortConfig - Sort configuration object
 * @returns {Function} - Sort function
 */
export const createSortFunction = (sortConfig) => {
  return (a, b) => {
    // Primary sort
    const primaryField = sortConfig.primary.field;
    const primaryOrder = sortConfig.primary.order;

    // Compare primary field
    const primaryComparison = compareValues(
      a[primaryField],
      b[primaryField],
      primaryOrder
    );

    // If primary fields are equal, use secondary sorts
    if (primaryComparison === 0 && sortConfig.secondary.length > 0) {
      // Loop through secondary sorts
      for (const secondarySort of sortConfig.secondary) {
        const secondaryField = secondarySort.field;
        const secondaryOrder = secondarySort.order;

        // Compare secondary field
        const secondaryComparison = compareValues(
          a[secondaryField],
          b[secondaryField],
          secondaryOrder
        );

        // If secondary fields are not equal, return the comparison
        if (secondaryComparison !== 0) {
          return secondaryComparison;
        }
      }
    }

    // Return primary comparison if no secondary sorts or all secondary fields are equal
    return primaryComparison;
  };
};

export default {
  compareValues,
  applySorting,
  getSortParams,
  createSortFunction,
};
