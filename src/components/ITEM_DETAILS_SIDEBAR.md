# Item Details Sidebar Component

This document outlines the implementation of the ItemDetailsSidebar component for the Primarily-like Items Dashboard.

## Overview

The ItemDetailsSidebar is a sliding panel that appears from the right side of the screen, providing detailed information about a selected item. It offers a comprehensive view of item details with multiple tabs for different types of information.

## Features

### 1. Sliding Animation

- Smooth sliding animation when opening and closing the sidebar
- Backdrop overlay with opacity transition
- Mobile-responsive design that takes full width on small screens

### 2. Tabbed Interface

The sidebar includes four main tabs:

- **Details**: Shows all item information and allows editing
- **Images**: Displays item images with navigation and zoom functionality
- **History**: Shows a timeline of changes made to the item
- **Related**: Displays related items (placeholder for future implementation)

### 3. Inline Editing

- Toggle between view and edit modes
- Form validation for required fields
- Real-time feedback during save operations
- Optimistic UI updates

### 4. Image Gallery

- Image carousel with navigation controls
- Image counter and pagination indicators
- Full-screen zoom view with navigation
- Support for multiple images

### 5. Activity History

- Timeline view of item changes
- User attribution for each action
- Timestamp for each activity
- Detailed description of changes

## Component Structure

```jsx
<ItemDetailsSidebar
  open={boolean}          // Controls sidebar visibility
  onClose={function}      // Function to call when closing the sidebar
  itemId={string}         // ID of the item to display
  onItemUpdate={function} // Callback when item is updated
  onItemDelete={function} // Callback when item is deleted
/>
```

## Implementation Details

### State Management

The component manages several pieces of state:

- `item`: The current item data
- `loading`: Loading state during API calls
- `error`: Error state for failed operations
- `activeTab`: Currently active tab
- `editMode`: Whether the component is in edit mode
- `formData`: Form data for editing
- `currentImageIndex`: Current image in the gallery
- `showZoomImage`: Whether the zoom view is active

### API Integration

The component integrates with the following API endpoints through the `useInventory` hook:

- `fetchItem`: Retrieves item details
- `updateItem`: Updates item information
- `deleteItem`: Deletes the item
- `fetchItemActivities`: Retrieves item activity history

### Responsive Design

The sidebar is designed to be responsive:

- Full width on mobile devices (`w-full`)
- Fixed width on larger screens (`sm:w-96`)
- Scrollable content area for overflow
- Optimized image display for different screen sizes

### Accessibility

The component includes several accessibility features:

- Proper focus management
- Keyboard navigation for image gallery
- ARIA attributes for interactive elements
- Clear visual feedback for interactive states

## Usage Example

```jsx
import ItemDetailsSidebar from "./components/ItemDetailsSidebar";

function MyComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleItemClick = (itemId) => {
    setSelectedItemId(itemId);
    setSidebarOpen(true);
  };

  const handleItemUpdate = (updatedItem) => {
    // Update item in your state/store
    console.log("Item updated:", updatedItem);
  };

  const handleItemDelete = (itemId) => {
    // Remove item from your state/store
    console.log("Item deleted:", itemId);
  };

  return (
    <>
      {/* Your item list/grid here */}
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            onClick={() => handleItemClick(item._id)}
            className="cursor-pointer"
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* Item Details Sidebar */}
      <ItemDetailsSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        itemId={selectedItemId}
        onItemUpdate={handleItemUpdate}
        onItemDelete={handleItemDelete}
      />
    </>
  );
}
```

## Future Enhancements

1. **Related Items**: Implement the related items tab to show items with similar tags, in the same folder, or otherwise related
2. **Comments System**: Add ability for users to comment on items
3. **Custom Fields**: Support for custom fields defined by the user
4. **File Attachments**: Support for attaching documents and other files
5. **Sharing Options**: Add ability to share item details with other users
6. **Print View**: Add a print-friendly view of item details
7. **QR Code Generation**: Generate QR codes for physical labeling
8. **Barcode Scanner**: Integrate with barcode/QR code scanner
9. **Audit Trail**: More detailed audit trail with filtering options
10. **Bulk Edit**: Allow editing multiple items at once from the sidebar
