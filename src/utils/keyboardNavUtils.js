/**
 * Keyboard navigation utilities for enhanced views
 */

/**
 * Key codes for navigation
 */
export const KEYS = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  TAB: "Tab",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
  A: "a",
  C: "c",
  V: "v",
  X: "x",
  Z: "z",
  DELETE: "Delete",
  BACKSPACE: "Backspace",
};

/**
 * Check if a keyboard event includes a modifier key
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {boolean} - Whether a modifier key is pressed
 */
export const hasModifier = (event) => {
  return event.ctrlKey || event.altKey || event.shiftKey || event.metaKey;
};

/**
 * Check if a keyboard event is Ctrl+A (Select All)
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {boolean} - Whether Ctrl+A is pressed
 */
export const isSelectAll = (event) => {
  return (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === KEYS.A.toLowerCase()
  );
};

/**
 * Check if a keyboard event is Ctrl+C (Copy)
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {boolean} - Whether Ctrl+C is pressed
 */
export const isCopy = (event) => {
  return (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === KEYS.C.toLowerCase()
  );
};

/**
 * Check if a keyboard event is Delete or Backspace
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {boolean} - Whether Delete or Backspace is pressed
 */
export const isDelete = (event) => {
  return event.key === KEYS.DELETE || event.key === KEYS.BACKSPACE;
};

/**
 * Create a keyboard navigation handler for list view
 *
 * @param {Object} options - Options for the handler
 * @param {Array} options.items - The items in the list
 * @param {Array} options.selectedItems - Currently selected item IDs
 * @param {Function} options.onSelectItem - Function to call when an item is selected
 * @param {Function} options.onSelectAll - Function to call when all items are selected
 * @param {Function} options.onDeleteItem - Function to call when an item is deleted
 * @param {Function} options.onEditItem - Function to call when an item is edited
 * @param {Function} options.onViewDetails - Function to call when item details are viewed
 * @returns {Function} - The keyboard event handler
 */
export const createListKeyboardHandler = ({
  items,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onDeleteItem,
  onEditItem,
  onViewDetails,
}) => {
  return (event) => {
    // Handle select all (Ctrl+A)
    if (isSelectAll(event)) {
      event.preventDefault();
      onSelectAll && onSelectAll();
      return;
    }

    // Handle delete
    if (isDelete(event) && selectedItems.length > 0) {
      event.preventDefault();
      // If only one item is selected, delete it
      if (selectedItems.length === 1) {
        const item = items.find((item) => item._id === selectedItems[0]);
        if (item && onDeleteItem) {
          onDeleteItem(item);
        }
      }
      return;
    }

    // Handle enter (view details)
    if (event.key === KEYS.ENTER && selectedItems.length === 1) {
      event.preventDefault();
      const item = items.find((item) => item._id === selectedItems[0]);
      if (item && onViewDetails) {
        onViewDetails(item);
      }
      return;
    }

    // Handle navigation keys
    if (
      [
        KEYS.UP,
        KEYS.DOWN,
        KEYS.HOME,
        KEYS.END,
        KEYS.PAGE_UP,
        KEYS.PAGE_DOWN,
      ].includes(event.key)
    ) {
      event.preventDefault();

      // If no items are selected, select the first one
      if (selectedItems.length === 0) {
        if (items.length > 0 && onSelectItem) {
          onSelectItem(items[0]._id);
        }
        return;
      }

      // Get the index of the currently selected item
      const currentIndex = items.findIndex(
        (item) => item._id === selectedItems[selectedItems.length - 1]
      );
      if (currentIndex === -1) return;

      let newIndex = currentIndex;

      // Calculate the new index based on the key pressed
      switch (event.key) {
        case KEYS.UP:
          newIndex = Math.max(0, currentIndex - 1);
          break;
        case KEYS.DOWN:
          newIndex = Math.min(items.length - 1, currentIndex + 1);
          break;
        case KEYS.HOME:
          newIndex = 0;
          break;
        case KEYS.END:
          newIndex = items.length - 1;
          break;
        case KEYS.PAGE_UP:
          newIndex = Math.max(0, currentIndex - 10);
          break;
        case KEYS.PAGE_DOWN:
          newIndex = Math.min(items.length - 1, currentIndex + 10);
          break;
        default:
          return;
      }

      // Select the new item
      if (newIndex !== currentIndex && onSelectItem) {
        onSelectItem(items[newIndex]._id);
      }
    }
  };
};

/**
 * Create a keyboard navigation handler for table view
 *
 * @param {Object} options - Options for the handler
 * @param {Array} options.items - The items in the table
 * @param {Array} options.selectedItems - Currently selected item IDs
 * @param {Function} options.onSelectItem - Function to call when an item is selected
 * @param {Function} options.onSelectAll - Function to call when all items are selected
 * @param {Function} options.onDeleteItem - Function to call when an item is deleted
 * @param {Function} options.onEditItem - Function to call when an item is edited
 * @param {Function} options.onViewDetails - Function to call when item details are viewed
 * @param {Function} options.onSort - Function to call when a column is sorted
 * @param {string} options.sortBy - Current sort field
 * @param {string} options.sortOrder - Current sort order
 * @returns {Function} - The keyboard event handler
 */
export const createTableKeyboardHandler = ({
  items,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onDeleteItem,
  onEditItem,
  onViewDetails,
  onSort,
  sortBy,
  sortOrder,
}) => {
  return (event) => {
    // Handle select all (Ctrl+A)
    if (isSelectAll(event)) {
      event.preventDefault();
      onSelectAll && onSelectAll();
      return;
    }

    // Handle delete
    if (isDelete(event) && selectedItems.length > 0) {
      event.preventDefault();
      // If only one item is selected, delete it
      if (selectedItems.length === 1) {
        const item = items.find((item) => item._id === selectedItems[0]);
        if (item && onDeleteItem) {
          onDeleteItem(item);
        }
      }
      return;
    }

    // Handle enter (view details)
    if (event.key === KEYS.ENTER && selectedItems.length === 1) {
      event.preventDefault();
      const item = items.find((item) => item._id === selectedItems[0]);
      if (item && onViewDetails) {
        onViewDetails(item);
      }
      return;
    }

    // Handle navigation keys
    if (
      [
        KEYS.UP,
        KEYS.DOWN,
        KEYS.HOME,
        KEYS.END,
        KEYS.PAGE_UP,
        KEYS.PAGE_DOWN,
      ].includes(event.key)
    ) {
      event.preventDefault();

      // If no items are selected, select the first one
      if (selectedItems.length === 0) {
        if (items.length > 0 && onSelectItem) {
          onSelectItem(items[0]._id);
        }
        return;
      }

      // Get the index of the currently selected item
      const currentIndex = items.findIndex(
        (item) => item._id === selectedItems[selectedItems.length - 1]
      );
      if (currentIndex === -1) return;

      let newIndex = currentIndex;

      // Calculate the new index based on the key pressed
      switch (event.key) {
        case KEYS.UP:
          newIndex = Math.max(0, currentIndex - 1);
          break;
        case KEYS.DOWN:
          newIndex = Math.min(items.length - 1, currentIndex + 1);
          break;
        case KEYS.HOME:
          newIndex = 0;
          break;
        case KEYS.END:
          newIndex = items.length - 1;
          break;
        case KEYS.PAGE_UP:
          newIndex = Math.max(0, currentIndex - 10);
          break;
        case KEYS.PAGE_DOWN:
          newIndex = Math.min(items.length - 1, currentIndex + 10);
          break;
        default:
          return;
      }

      // Select the new item
      if (newIndex !== currentIndex && onSelectItem) {
        onSelectItem(items[newIndex]._id);
      }
    }
  };
};

/**
 * Create a keyboard navigation handler for grid view
 *
 * @param {Object} options - Options for the handler
 * @param {Array} options.items - The items in the grid
 * @param {Array} options.selectedItems - Currently selected item IDs
 * @param {Function} options.onSelectItem - Function to call when an item is selected
 * @param {Function} options.onSelectAll - Function to call when all items are selected
 * @param {Function} options.onDeleteItem - Function to call when an item is deleted
 * @param {Function} options.onEditItem - Function to call when an item is edited
 * @param {Function} options.onViewDetails - Function to call when item details are viewed
 * @param {Object} options.gridSettings - Grid settings (columns per row)
 * @returns {Function} - The keyboard event handler
 */
export const createGridKeyboardHandler = ({
  items,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onDeleteItem,
  onEditItem,
  onViewDetails,
  gridSettings,
}) => {
  return (event) => {
    // Handle select all (Ctrl+A)
    if (isSelectAll(event)) {
      event.preventDefault();
      onSelectAll && onSelectAll();
      return;
    }

    // Handle delete
    if (isDelete(event) && selectedItems.length > 0) {
      event.preventDefault();
      // If only one item is selected, delete it
      if (selectedItems.length === 1) {
        const item = items.find((item) => item._id === selectedItems[0]);
        if (item && onDeleteItem) {
          onDeleteItem(item);
        }
      }
      return;
    }

    // Handle enter (view details)
    if (event.key === KEYS.ENTER && selectedItems.length === 1) {
      event.preventDefault();
      const item = items.find((item) => item._id === selectedItems[0]);
      if (item && onViewDetails) {
        onViewDetails(item);
      }
      return;
    }

    // Handle navigation keys
    if (
      [KEYS.UP, KEYS.DOWN, KEYS.LEFT, KEYS.RIGHT, KEYS.HOME, KEYS.END].includes(
        event.key
      )
    ) {
      event.preventDefault();

      // If no items are selected, select the first one
      if (selectedItems.length === 0) {
        if (items.length > 0 && onSelectItem) {
          onSelectItem(items[0]._id);
        }
        return;
      }

      // Get the index of the currently selected item
      const currentIndex = items.findIndex(
        (item) => item._id === selectedItems[selectedItems.length - 1]
      );
      if (currentIndex === -1) return;

      // Determine the number of columns in the grid
      const columnsPerRow = gridSettings?.columns?.lg || 4;

      let newIndex = currentIndex;

      // Calculate the new index based on the key pressed
      switch (event.key) {
        case KEYS.UP:
          newIndex = Math.max(0, currentIndex - columnsPerRow);
          break;
        case KEYS.DOWN:
          newIndex = Math.min(items.length - 1, currentIndex + columnsPerRow);
          break;
        case KEYS.LEFT:
          newIndex = Math.max(0, currentIndex - 1);
          break;
        case KEYS.RIGHT:
          newIndex = Math.min(items.length - 1, currentIndex + 1);
          break;
        case KEYS.HOME:
          newIndex = 0;
          break;
        case KEYS.END:
          newIndex = items.length - 1;
          break;
        default:
          return;
      }

      // Select the new item
      if (newIndex !== currentIndex && onSelectItem) {
        onSelectItem(items[newIndex]._id);
      }
    }
  };
};

/**
 * Hook to add keyboard navigation to a component
 *
 * @param {Object} options - Options for the hook
 * @param {string} options.viewMode - Current view mode ('grid', 'list', or 'table')
 * @param {Array} options.items - The items in the view
 * @param {Array} options.selectedItems - Currently selected item IDs
 * @param {Function} options.onSelectItem - Function to call when an item is selected
 * @param {Function} options.onSelectAll - Function to call when all items are selected
 * @param {Function} options.onDeleteItem - Function to call when an item is deleted
 * @param {Function} options.onEditItem - Function to call when an item is edited
 * @param {Function} options.onViewDetails - Function to call when item details are viewed
 * @param {Function} options.onSort - Function to call when a column is sorted
 * @param {string} options.sortBy - Current sort field
 * @param {string} options.sortOrder - Current sort order
 * @param {Object} options.gridSettings - Grid settings (columns per row)
 * @returns {Function} - The keyboard event handler
 */
export const useKeyboardNavigation = ({
  viewMode,
  items,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onDeleteItem,
  onEditItem,
  onViewDetails,
  onSort,
  sortBy,
  sortOrder,
  gridSettings,
}) => {
  const handleKeyDown = (event) => {
    // Choose the appropriate handler based on the view mode
    switch (viewMode) {
      case "grid":
        return createGridKeyboardHandler({
          items,
          selectedItems,
          onSelectItem,
          onSelectAll,
          onDeleteItem,
          onEditItem,
          onViewDetails,
          gridSettings,
        })(event);
      case "list":
        return createListKeyboardHandler({
          items,
          selectedItems,
          onSelectItem,
          onSelectAll,
          onDeleteItem,
          onEditItem,
          onViewDetails,
        })(event);
      case "table":
        return createTableKeyboardHandler({
          items,
          selectedItems,
          onSelectItem,
          onSelectAll,
          onDeleteItem,
          onEditItem,
          onViewDetails,
          onSort,
          sortBy,
          sortOrder,
        })(event);
      default:
        return () => {};
    }
  };

  return handleKeyDown;
};
