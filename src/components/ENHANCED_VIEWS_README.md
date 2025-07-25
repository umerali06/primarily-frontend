# Enhanced Views for Inventory Management

## Overview

This package provides enhanced list and table views for inventory management applications. The views are designed to be highly performant, visually appealing, and feature-rich, with support for large datasets through virtualization.

## Components

### List Views

- **EnhancedListView**: A visually appealing and information-rich list view for inventory items
- **VirtualizedEnhancedListView**: An optimized version of the list view for large datasets

### Table Views

- **EnhancedTableView**: A powerful table view with column management capabilities
- **VirtualizedEnhancedTableView**: An optimized version of the table view for large datasets

### Supporting Components

- **ResizableColumn**: For resizing table columns
- **VirtualizedTable**: Generic component for table virtualization
- **ItemBadge**: For consistent status indicators
- **ColumnCustomizer**: For managing table columns
- **ViewToggle**: For switching between view modes
- **ViewTransition**: For smooth transitions between views

## Features

### List View Features

- Improved layout with better spacing and visual hierarchy
- Enhanced item cards with more detailed information
- Better status indicators with consistent styling
- Quick action buttons and dropdown menus
- Virtualization for large datasets

### Table View Features

- Column customization with drag-and-drop reordering
- Column visibility toggle
- Column resizing with drag handles
- Column freezing capability
- Sortable columns with clear indicators
- Virtualization for large datasets

### Performance Features

- Virtualization for large datasets
- Component memoization to prevent unnecessary re-renders
- Optimized event handlers
- Efficient DOM updates

## Installation

1. Copy the required files to your project:

   ```
   EnhancedListView.jsx
   EnhancedTableView.jsx
   VirtualizedEnhancedListView.jsx
   VirtualizedEnhancedTableView.jsx
   VirtualizedTable.jsx
   ResizableColumn.jsx
   ItemBadge.jsx
   ColumnCustomizer.jsx
   ViewToggle.jsx
   ViewTransition.jsx
   animations.css
   transitions.css
   useViewPreferences.js
   ```

2. Import the required CSS files in your main CSS file:
   ```css
   @import "./animations.css";
   @import "./transitions.css";
   ```

## Usage

### Basic Usage

```jsx
import React, { useState } from "react";
import EnhancedListView from "./components/EnhancedListView";
import EnhancedTableView from "./components/EnhancedTableView";
import ViewToggle from "./components/ViewToggle";
import ViewTransition from "./components/ViewTransition";

const InventoryView = ({ items }) => {
  const [viewMode, setViewMode] = useState("list");
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleEditItem = (item) => {
    console.log("Edit item:", item);
  };

  const handleDeleteItem = (item) => {
    console.log("Delete item:", item);
  };

  const handleViewHistory = (item) => {
    console.log("View history:", item);
  };

  const handleViewDetails = (item) => {
    console.log("View details:", item);
  };

  return (
    <div>
      <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

      <ViewTransition viewMode={viewMode}>
        {viewMode === "list" && (
          <EnhancedListView
            items={items}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onViewHistory={handleViewHistory}
            onViewDetails={handleViewDetails}
          />
        )}

        {viewMode === "table" && (
          <EnhancedTableView
            items={items}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={() => {}}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onViewHistory={handleViewHistory}
            onViewDetails={handleViewDetails}
            sortBy="name"
            sortOrder="asc"
            onSort={() => {}}
            columnSettings={{
              visibleColumns: [
                "name",
                "quantity",
                "price",
                "location",
                "status",
                "actions",
              ],
            }}
          />
        )}
      </ViewTransition>
    </div>
  );
};

export default InventoryView;
```

### Advanced Usage with Virtualization

```jsx
import React, { useState } from "react";
import VirtualizedEnhancedListView from "./components/VirtualizedEnhancedListView";
import VirtualizedEnhancedTableView from "./components/VirtualizedEnhancedTableView";
import ViewToggle from "./components/ViewToggle";
import ViewTransition from "./components/ViewTransition";

const InventoryView = ({ items }) => {
  const [viewMode, setViewMode] = useState("list");
  const [selectedItems, setSelectedItems] = useState([]);

  // Handler functions (same as basic usage)

  return (
    <div>
      <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

      <ViewTransition viewMode={viewMode}>
        {viewMode === "list" && (
          <div style={{ height: "600px" }}>
            <VirtualizedEnhancedListView
              items={items}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onViewHistory={handleViewHistory}
              onViewDetails={handleViewDetails}
            />
          </div>
        )}

        {viewMode === "table" && (
          <div style={{ height: "600px" }}>
            <VirtualizedEnhancedTableView
              items={items}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onSelectAll={() => {}}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onViewHistory={handleViewHistory}
              onViewDetails={handleViewDetails}
              sortBy="name"
              sortOrder="asc"
              onSort={() => {}}
              columnSettings={{
                visibleColumns: [
                  "name",
                  "quantity",
                  "price",
                  "location",
                  "status",
                  "actions",
                ],
                columnWidths: {
                  name: 250,
                  quantity: 120,
                  price: 120,
                  location: 150,
                  status: 120,
                  actions: 120,
                },
                frozenColumns: ["name"],
              }}
            />
          </div>
        )}
      </ViewTransition>
    </div>
  );
};

export default InventoryView;
```

### Automatic Virtualization

```jsx
import React, { useState, useMemo } from "react";
import EnhancedListView from "./components/EnhancedListView";
import EnhancedTableView from "./components/EnhancedTableView";
import VirtualizedEnhancedListView from "./components/VirtualizedEnhancedListView";
import VirtualizedEnhancedTableView from "./components/VirtualizedEnhancedTableView";
import ViewToggle from "./components/ViewToggle";
import ViewTransition from "./components/ViewTransition";
import useViewPreferences from "./hooks/useViewPreferences";

const InventoryView = ({ items }) => {
  const [viewPreferences, updateViewPreferences] = useViewPreferences(
    "inventoryViewPreferences",
    {
      viewMode: "list",
      useVirtualization: true,
      columnSettings: {
        table: {
          visibleColumns: [
            "name",
            "quantity",
            "price",
            "location",
            "status",
            "actions",
          ],
          columnWidths: {
            name: 250,
            quantity: 120,
            price: 120,
            location: 150,
            status: 120,
            actions: 120,
          },
          frozenColumns: ["name"],
        },
      },
    }
  );

  const [viewMode, setViewMode] = useState(viewPreferences.viewMode);
  const [useVirtualization, setUseVirtualization] = useState(
    viewPreferences.useVirtualization
  );
  const [selectedItems, setSelectedItems] = useState([]);

  // Handler functions (same as basic usage)

  // Custom view mode setter that also updates preferences
  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    updateViewPreferences({ viewMode: newMode });
  };

  // Toggle virtualization
  const toggleVirtualization = () => {
    const newValue = !useVirtualization;
    setUseVirtualization(newValue);
    updateViewPreferences({ useVirtualization: newValue });
  };

  // Render list view
  const renderListView = () => {
    // Use virtualized list view for large datasets
    if (useVirtualization && items.length > 50) {
      return (
        <div style={{ height: "calc(100vh - 300px)" }}>
          <VirtualizedEnhancedListView
            items={items}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onViewHistory={handleViewHistory}
            onViewDetails={handleViewDetails}
          />
        </div>
      );
    }

    // Use standard enhanced list view for smaller datasets
    return (
      <EnhancedListView
        items={items}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        onViewHistory={handleViewHistory}
        onViewDetails={handleViewDetails}
      />
    );
  };

  // Render table view
  const renderTableView = () => {
    // Use virtualized table view for large datasets
    if (useVirtualization && items.length > 50) {
      return (
        <div style={{ height: "calc(100vh - 300px)" }}>
          <VirtualizedEnhancedTableView
            items={items}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={() => {}}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onViewHistory={handleViewHistory}
            onViewDetails={handleViewDetails}
            sortBy="name"
            sortOrder="asc"
            onSort={() => {}}
            columnSettings={viewPreferences.columnSettings.table}
          />
        </div>
      );
    }

    // Use standard enhanced table view for smaller datasets
    return (
      <EnhancedTableView
        items={items}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
        onSelectAll={() => {}}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        onViewHistory={handleViewHistory}
        onViewDetails={handleViewDetails}
        sortBy="name"
        sortOrder="asc"
        onSort={() => {}}
        columnSettings={viewPreferences.columnSettings.table}
      />
    );
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <ViewToggle viewMode={viewMode} setViewMode={handleViewModeChange} />

        <div className="flex items-center gap-2 ml-4">
          <label className="text-sm font-medium text-gray-700">
            Virtualization:
          </label>
          <input
            type="checkbox"
            checked={useVirtualization}
            onChange={toggleVirtualization}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
      </div>

      <ViewTransition viewMode={viewMode}>
        {viewMode === "list" && renderListView()}
        {viewMode === "table" && renderTableView()}
      </ViewTransition>
    </div>
  );
};

export default InventoryView;
```

## Props

### EnhancedListView / VirtualizedEnhancedListView Props

| Prop          | Type     | Description                                |
| ------------- | -------- | ------------------------------------------ |
| items         | Array    | Array of items to display                  |
| selectedItems | Array    | Array of selected item IDs                 |
| onSelectItem  | Function | Callback when an item is selected          |
| onEditItem    | Function | Callback when an item is edited            |
| onDeleteItem  | Function | Callback when an item is deleted           |
| onViewHistory | Function | Callback when an item's history is viewed  |
| onViewDetails | Function | Callback when an item's details are viewed |

### EnhancedTableView / VirtualizedEnhancedTableView Props

| Prop           | Type     | Description                                |
| -------------- | -------- | ------------------------------------------ |
| items          | Array    | Array of items to display                  |
| selectedItems  | Array    | Array of selected item IDs                 |
| onSelectItem   | Function | Callback when an item is selected          |
| onSelectAll    | Function | Callback when all items are selected       |
| onEditItem     | Function | Callback when an item is edited            |
| onDeleteItem   | Function | Callback when an item is deleted           |
| onViewHistory  | Function | Callback when an item's history is viewed  |
| onViewDetails  | Function | Callback when an item's details are viewed |
| sortBy         | String   | Field to sort by                           |
| sortOrder      | String   | Sort order ('asc' or 'desc')               |
| onSort         | Function | Callback when a column is sorted           |
| columnSettings | Object   | Column settings object                     |

## Performance Considerations

1. **Dataset Size**: For optimal performance, use the virtualized versions of the components when dealing with large datasets (50+ items).

2. **Container Height**: When using virtualized components, make sure to set a fixed height on the container to enable proper virtualization.

3. **Memoization**: The components use React.memo, useMemo, and useCallback internally to optimize performance. When implementing your own handlers, consider using useCallback to prevent unnecessary re-renders.

4. **Column Widths**: Setting appropriate column widths can improve the user experience and performance of the table view.

5. **Frozen Columns**: Use frozen columns sparingly, as they can impact performance when there are many columns.

## Customization

The components can be customized through props and CSS. For more advanced customization, you can modify the component files directly.

### CSS Customization

The components use Tailwind CSS classes for styling. You can override these classes by adding your own CSS rules with higher specificity.

### Component Customization

For more advanced customization, you can create your own versions of the components by copying and modifying the component files.

## Examples

See the `EnhancedViewsDemo.jsx` file for a complete example of how to use the enhanced views with different dataset sizes and virtualization options.

## License

This package is licensed under the MIT License.
