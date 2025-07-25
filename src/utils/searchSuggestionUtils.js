/**
 * Utility functions for generating search suggestions
 */

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} - Edit distance between strings
 */
const levenshteinDistance = (a, b) => {
  const matrix = [];

  // Increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

/**
 * Generate "did you mean" suggestions for a query
 * @param {string} query - The search query
 * @param {Array} items - Available items to generate suggestions from
 * @param {Array} recentSearches - Recent search queries
 * @param {number} maxSuggestions - Maximum number of suggestions to return
 * @returns {Array} - "Did you mean" suggestions
 */
export const generateDidYouMeanSuggestions = (
  query,
  items,
  recentSearches = [],
  maxSuggestions = 3
) => {
  if (!query || query.length < 2 || !items || !Array.isArray(items)) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  const suggestions = new Set();
  const allWords = new Set();

  // Extract words from item names, descriptions, categories, etc.
  items.forEach((item) => {
    // Add words from name
    if (item.name) {
      item.name.split(/\s+/).forEach((word) => {
        if (word.length > 2) allWords.add(word.toLowerCase());
      });
    }

    // Add words from description
    if (item.description) {
      item.description.split(/\s+/).forEach((word) => {
        if (word.length > 2) allWords.add(word.toLowerCase());
      });
    }

    // Add category
    if (item.category) {
      allWords.add(item.category.toLowerCase());
    }

    // Add tags
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach((tag) => allWords.add(tag.toLowerCase()));
    }
  });

  // Add recent searches
  recentSearches.forEach((search) => {
    search.split(/\s+/).forEach((word) => {
      if (word.length > 2) allWords.add(word.toLowerCase());
    });
  });

  // Find similar words based on Levenshtein distance
  const words = Array.from(allWords);
  const similarWords = words
    .map((word) => ({
      word,
      distance: levenshteinDistance(lowerQuery, word),
    }))
    .filter(
      ({ distance }) =>
        distance > 0 &&
        distance <= Math.min(3, Math.floor(lowerQuery.length / 2))
    )
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxSuggestions)
    .map(({ word }) => word);

  // Generate suggestions by replacing similar words in the query
  const queryWords = lowerQuery.split(/\s+/);

  queryWords.forEach((queryWord, index) => {
    similarWords.forEach((similarWord) => {
      if (
        levenshteinDistance(queryWord, similarWord) <=
        Math.min(3, Math.floor(queryWord.length / 2))
      ) {
        const newQueryWords = [...queryWords];
        newQueryWords[index] = similarWord;
        suggestions.add(newQueryWords.join(" "));
      }
    });
  });

  // Add similar recent searches
  recentSearches.forEach((search) => {
    const distance = levenshteinDistance(lowerQuery, search.toLowerCase());
    if (
      distance > 0 &&
      distance <= Math.min(3, Math.floor(lowerQuery.length / 2))
    ) {
      suggestions.add(search);
    }
  });

  return Array.from(suggestions).slice(0, maxSuggestions);
};

/**
 * Generate related search suggestions based on query
 * @param {string} query - The search query
 * @param {Array} items - Available items to generate suggestions from
 * @param {number} maxSuggestions - Maximum number of suggestions to return
 * @returns {Array} - Related search suggestions
 */
export const generateRelatedSearches = (query, items, maxSuggestions = 5) => {
  if (!query || query.length < 2 || !items || !Array.isArray(items)) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  const suggestions = new Set();
  const queryWords = lowerQuery.split(/\s+/);

  // Find items that partially match the query
  const matchingItems = items.filter((item) => {
    if (item.name && item.name.toLowerCase().includes(lowerQuery)) return true;
    if (item.description && item.description.toLowerCase().includes(lowerQuery))
      return true;
    if (item.category && item.category.toLowerCase().includes(lowerQuery))
      return true;
    if (
      item.tags &&
      Array.isArray(item.tags) &&
      item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
      return true;
    return false;
  });

  // Extract categories from matching items
  const categories = new Set();
  matchingItems.forEach((item) => {
    if (item.category) categories.add(item.category);
  });

  // Generate category-based suggestions
  categories.forEach((category) => {
    suggestions.add(`${category} ${queryWords[0]}`);
  });

  // Extract tags from matching items
  const tags = new Set();
  matchingItems.forEach((item) => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach((tag) => tags.add(tag));
    }
  });

  // Generate tag-based suggestions
  tags.forEach((tag) => {
    if (!lowerQuery.includes(tag.toLowerCase())) {
      suggestions.add(`${tag} ${queryWords[0]}`);
    }
  });

  // Generate attribute-based suggestions
  suggestions.add(`${queryWords[0]} low stock`);
  suggestions.add(`${queryWords[0]} high price`);
  suggestions.add(`${queryWords[0]} recent`);

  return Array.from(suggestions).slice(0, maxSuggestions);
};

/**
 * Extract popular categories from items
 * @param {Array} items - Available items
 * @param {number} maxCategories - Maximum number of categories to return
 * @returns {Array} - Popular categories
 */
export const extractPopularCategories = (items, maxCategories = 5) => {
  if (!items || !Array.isArray(items)) return [];

  const categoryCounts = {};

  items.forEach((item) => {
    if (item.category) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  });

  return Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxCategories)
    .map(([category]) => category);
};

/**
 * Extract popular tags from items
 * @param {Array} items - Available items
 * @param {number} maxTags - Maximum number of tags to return
 * @returns {Array} - Popular tags
 */
export const extractPopularTags = (items, maxTags = 5) => {
  if (!items || !Array.isArray(items)) return [];

  const tagCounts = {};

  items.forEach((item) => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTags)
    .map(([tag]) => tag);
};

export default {
  generateDidYouMeanSuggestions,
  generateRelatedSearches,
  extractPopularCategories,
  extractPopularTags,
};
