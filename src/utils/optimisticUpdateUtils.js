/**
 * Utility functions for handling optimistic updates
 */

/**
 * Creates an optimistic update handler for item updates
 *
 * @param {Function} updateFunction - The actual update function that makes the API call
 * @param {Function} onSuccess - Function to call on successful update
 * @param {Function} onError - Function to call on error
 * @param {Function} onStart - Function to call when update starts
 * @param {Function} onEnd - Function to call when update ends (success or error)
 * @returns {Function} - The optimistic update handler
 */
export const createOptimisticUpdateHandler = (
  updateFunction,
  onSuccess = () => {},
  onError = () => {},
  onStart = () => {},
  onEnd = () => {}
) => {
  return async (itemId, updateData, optimistic = true) => {
    // Call the start callback
    onStart(updateData);

    // If optimistic update is enabled, call the success callback immediately
    if (optimistic) {
      onSuccess(updateData);
    }

    try {
      // Make the actual API call
      const result = await updateFunction(itemId, updateData);

      // If not optimistic, call the success callback after the API call
      if (!optimistic) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      // If there was an error, call the error callback
      onError(error, updateData);

      // Re-throw the error so the caller can handle it
      throw error;
    } finally {
      // Call the end callback
      onEnd();
    }
  };
};

/**
 * Creates a retry mechanism for failed updates
 *
 * @param {Function} updateFunction - The update function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} baseDelay - Base delay between retries in milliseconds
 * @param {Function} onRetry - Function to call when a retry is attempted
 * @returns {Function} - The retry handler
 */
export const createRetryHandler = (
  updateFunction,
  maxRetries = 3,
  baseDelay = 1000,
  onRetry = () => {}
) => {
  return async (...args) => {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // If this is a retry attempt, call the onRetry callback
        if (attempt > 0) {
          onRetry(attempt, maxRetries);
        }

        // Try to make the update
        return await updateFunction(...args);
      } catch (error) {
        lastError = error;

        // If this was the last attempt, don't wait
        if (attempt === maxRetries) {
          break;
        }

        // Wait before retrying with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // If we've exhausted all retries, throw the last error
    throw lastError;
  };
};

/**
 * Creates a batch update handler for multiple items
 *
 * @param {Function} updateFunction - The update function for a single item
 * @param {number} batchSize - Number of items to update in parallel
 * @param {Function} onProgress - Function to call with progress updates
 * @returns {Function} - The batch update handler
 */
export const createBatchUpdateHandler = (
  updateFunction,
  batchSize = 5,
  onProgress = () => {}
) => {
  return async (items, updateData) => {
    const results = [];
    const errors = [];

    // Process items in batches
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      // Process each batch in parallel
      const batchPromises = batch.map(async (item) => {
        try {
          const result = await updateFunction(item.id || item._id, updateData);
          results.push(result);
          return { success: true, result };
        } catch (error) {
          errors.push({ item, error });
          return { success: false, error, item };
        }
      });

      // Wait for the current batch to complete
      await Promise.all(batchPromises);

      // Report progress
      onProgress({
        completed: Math.min(i + batchSize, items.length),
        total: items.length,
        successful: results.length,
        failed: errors.length,
      });
    }

    return {
      results,
      errors,
      success: errors.length === 0,
    };
  };
};

/**
 * Creates a cancellable update handler
 *
 * @param {Function} updateFunction - The update function
 * @returns {Object} - Object containing the update function and cancel function
 */
export const createCancellableUpdateHandler = (updateFunction) => {
  let isCancelled = false;

  const cancel = () => {
    isCancelled = true;
  };

  const update = async (...args) => {
    // Reset cancelled state
    isCancelled = false;

    // Start the update
    const promise = updateFunction(...args);

    // Return a new promise that can be cancelled
    return new Promise((resolve, reject) => {
      promise.then(
        (result) => {
          if (isCancelled) {
            reject(new Error("Update was cancelled"));
          } else {
            resolve(result);
          }
        },
        (error) => {
          if (isCancelled) {
            reject(new Error("Update was cancelled"));
          } else {
            reject(error);
          }
        }
      );
    });
  };

  return { update, cancel };
};
