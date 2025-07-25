/**
 * Utility functions for search operations
 */

/**
 * Calculate relevance score for an item based on search query
 * @param {Object} item - The item to calculate relevance for
 * @param {string} query - The search query
 * @returns {number} - Relevance score (higher is more relevant)
 */
export const calculateRelevance = (item, query) => {
  if (!item || !query) return 0;

  let score = 0;
  const lowerQuery = query.toLowerCase().trim();

  // Exact name match gets highest score
  if (item.name?.toLowerCase() === lowerQuery) {
    score += 100;
  }
  // Name starts with query
  else if (item.name?.toLowerCase().startsWith(lowerQuery)) {
    score += 80;
  }
  // Name contains query
  else if (item.name?.toLowerCase().includes(lowerQuery)) {
    score += 50;
  }

  // Description contains query
  if (item.description?.toLowerCase().includes(lowerQuery)) {
    score += 30;
  }

  // Tags contain query
  if (item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
    score += 40;
  }

  // Category contains query
  if (item.category?.toLowerCase().includes(lowerQuery)) {
    score += 35;
  }

  // Location contains query
  if (item.location?.toLowerCase().includes(lowerQuery)) {
    score += 25;
  }

  // SKU/Barcode exact match
  if (
    item.sku?.toLowerCase() === lowerQuery ||
    item.barcode?.toLowerCase() === lowerQuery
  ) {
    score += 90;
  }

  // SKU/Barcode contains query
  if (
    item.sku?.toLowerCase().includes(lowerQuery) ||
    item.barcode?.toLowerCase().includes(lowerQuery)
  ) {
    score += 45;
  }

  // Recently updated items get a boost
  if (item.updatedAt) {
    const daysSinceUpdate =
      (new Date() - new Date(item.updatedAt)) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 7) {
      score += 10;
    }
  }

  // Low stock items might be more important
  if (item.lowStock) {
    score += 5;
  }

  return score;
};

/**
 * Highlight search terms in text
 * @param {string} text - The text to highlight
 * @param {string} query - The search query
 * @returns {Array|string} - Array of React elements or original text
 */
export const highlightText = (text, query) => {
  if (!query || !text) return text;

  try {
    // Escape special regex characters in the query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Split by the query pattern (case insensitive)
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));

    // If using in React, return array of elements
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  } catch (error) {
    // If there's an error (like in non-React environments), return the original text
    console.error("Error highlighting text:", error);
    return text;
  }
};

/**
 * Group search results by a specified field
 * @param {Array} results - The search results to group
 * @param {string|null} groupBy - The field to group by (null for no grouping)
 * @returns {Object} - Grouped results
 */
export const groupSearchResults = (results, groupBy) => {
  if (!groupBy) return { ungrouped: results };

  return results.reduce((groups, item) => {
    const groupValue = item[groupBy];

    // Handle arrays (like tags)
    if (Array.isArray(groupValue)) {
      groupValue.forEach((value) => {
        if (!groups[value]) groups[value] = [];
        groups[value].push(item);
      });
    } else {
      const key = groupValue || "Other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }

    return groups;
  }, {});
};

/**
 * Sort search results by specified criteria
 * @param {Array} results - The search results to sort
 * @param {string} sortBy - Sort criteria (relevance, name, date, price)
 * @param {string} sortDirection - Sort direction (asc, desc)
 * @param {string} query - The search query (for relevance sorting)
 * @returns {Array} - Sorted results
 */
export const sortSearchResults = (results, sortBy, sortDirection, query) => {
  if (!results || !Array.isArray(results)) return [];

  const sortedResults = [...results];

  switch (sortBy) {
    case "relevance":
      sortedResults.forEach((item) => {
        item.relevanceScore = calculateRelevance(item, query);
      });
      sortedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
      break;

    case "name":
      sortedResults.sort((a, b) => {
        const nameA = a.name?.toLowerCase() || "";
        const nameB = b.name?.toLowerCase() || "";
        return sortDirection === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
      break;

    case "date":
      sortedResults.sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
        const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });
      break;

    case "price":
      sortedResults.sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return sortDirection === "asc" ? priceA - priceB : priceB - priceA;
      });
      break;

    case "quantity":
      sortedResults.sort((a, b) => {
        const qtyA = a.quantity || 0;
        const qtyB = b.quantity || 0;
        return sortDirection === "asc" ? qtyA - qtyB : qtyB - qtyA;
      });
      break;

    default:
      // Default to sorting by name ascending
      sortedResults.sort((a, b) => {
        const nameA = a.name?.toLowerCase() || "";
        const nameB = b.name?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      });
  }

  return sortedResults;
};

/**
 * Generate search suggestions based on query and available items
 * @param {string} query - The search query
 * @param {Array} items - Available items to generate suggestions from
 * @param {number} maxSuggestions - Maximum number of suggestions to return
 * @returns {Array} - Search suggestions
 */
export const generateSearchSuggestions = (query, items, maxSuggestions = 5) => {
  if (!query || query.length < 2 || !items || !Array.isArray(items)) return [];

  const lowerQuery = query.toLowerCase().trim();
  const suggestions = new Set();

  // Add suggestions from item names
  items.forEach((item) => {
    if (
      item.name?.toLowerCase().includes(lowerQuery) &&
      !suggestions.has(item.name)
    ) {
      suggestions.add(item.name);
    }
  });

  // Add suggestions from categories
  items.forEach((item) => {
    if (
      item.category?.toLowerCase().includes(lowerQuery) &&
      !suggestions.has(item.category)
    ) {
      suggestions.add(item.category);
    }
  });

  // Add suggestions from tags
  items.forEach((item) => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(lowerQuery) && !suggestions.has(tag)) {
          suggestions.add(tag);
        }
      });
    }
  });

  // Add common search patterns
  if (suggestions.size < maxSuggestions) {
    const patterns = [
      `${query} in stock`,
      `${query} low stock`,
      `${query} category`,
    ];

    patterns.forEach((pattern) => {
      if (suggestions.size < maxSuggestions) {
        suggestions.add(pattern);
      }
    });
  }

  return Array.from(suggestions).slice(0, maxSuggestions);
};

export default {
  calculateRelevance,
  highlightText,
  groupSearchResults,
  sortSearchResults,
  generateSearchSuggestions,
};
