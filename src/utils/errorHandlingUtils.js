/**
 * Utility functions for error handling
 */

/**
 * Creates an error handler for API calls
 *
 * @param {Function} onError - Function to call when an error occurs
 * @returns {Function} - The error handler function
 */
export const createErrorHandler = (onError) => {
  return (error, context = {}) => {
    // Extract error message from different error formats
    let errorMessage = "An unknown error occurred";

    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    // Call the error callback with the error message and context
    onError(errorMessage, context);

    // Return the error message for convenience
    return errorMessage;
  };
};

/**
 * Wraps a function with error handling
 *
 * @param {Function} fn - The function to wrap
 * @param {Function} errorHandler - The error handler function
 * @returns {Function} - The wrapped function
 */
export const withErrorHandling = (fn, errorHandler) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler(error, { args });
      throw error;
    }
  };
};

/**
 * Creates a function that handles API errors and displays them to the user
 *
 * @param {Function} toastError - Function to display error messages
 * @param {Function} setError - Function to set error state
 * @returns {Function} - The API error handler function
 */
export const createApiErrorHandler = (toastError, setError = null) => {
  return (error, context = {}) => {
    const errorMessage = createErrorHandler(() => {})(error, context);

    // Display the error message
    toastError(errorMessage);

    // Set the error state if provided
    if (setError && context.field) {
      setError(context.field, errorMessage);
    }

    // Log the error for debugging
    console.error("API Error:", error, context);

    return errorMessage;
  };
};

/**
 * Creates a validation error handler
 *
 * @param {Function} setError - Function to set error state
 * @returns {Function} - The validation error handler function
 */
export const createValidationErrorHandler = (setError) => {
  return (field, error) => {
    setError(field, error);
    return error;
  };
};
