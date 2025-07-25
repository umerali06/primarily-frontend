/**
 * Utility functions for handling loading states
 */

/**
 * Creates a loading state handler
 *
 * @param {Function} setState - Function to update the loading state
 * @returns {Object} - Object containing loading state functions
 */
export const createLoadingStateHandler = (setState) => {
  return {
    /**
     * Start loading for a specific field
     * @param {string} field - The field to start loading for
     */
    startLoading: (field) => {
      setState((prev) => ({
        ...prev,
        [field]: true,
      }));
    },

    /**
     * Stop loading for a specific field
     * @param {string} field - The field to stop loading for
     */
    stopLoading: (field) => {
      setState((prev) => ({
        ...prev,
        [field]: false,
      }));
    },

    /**
     * Check if a field is loading
     * @param {string} field - The field to check
     * @param {Object} state - The current loading state
     * @returns {boolean} - Whether the field is loading
     */
    isLoading: (field, state) => {
      return !!state[field];
    },

    /**
     * Start loading for multiple fields
     * @param {Array<string>} fields - The fields to start loading for
     */
    startLoadingMultiple: (fields) => {
      setState((prev) => {
        const newState = { ...prev };
        fields.forEach((field) => {
          newState[field] = true;
        });
        return newState;
      });
    },

    /**
     * Stop loading for multiple fields
     * @param {Array<string>} fields - The fields to stop loading for
     */
    stopLoadingMultiple: (fields) => {
      setState((prev) => {
        const newState = { ...prev };
        fields.forEach((field) => {
          newState[field] = false;
        });
        return newState;
      });
    },

    /**
     * Reset all loading states
     */
    resetLoading: () => {
      setState({});
    },
  };
};

/**
 * Creates an error state handler
 *
 * @param {Function} setState - Function to update the error state
 * @returns {Object} - Object containing error state functions
 */
export const createErrorStateHandler = (setState) => {
  return {
    /**
     * Set an error for a specific field
     * @param {string} field - The field to set the error for
     * @param {string} error - The error message
     */
    setError: (field, error) => {
      setState((prev) => ({
        ...prev,
        [field]: error,
      }));
    },

    /**
     * Clear the error for a specific field
     * @param {string} field - The field to clear the error for
     */
    clearError: (field) => {
      setState((prev) => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });
    },

    /**
     * Check if a field has an error
     * @param {string} field - The field to check
     * @param {Object} state - The current error state
     * @returns {string|null} - The error message or null if no error
     */
    getError: (field, state) => {
      return state[field] || null;
    },

    /**
     * Reset all error states
     */
    resetErrors: () => {
      setState({});
    },
  };
};
