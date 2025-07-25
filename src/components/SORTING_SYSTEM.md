# Enhanced Sorting System Documentation

This document provides an overview of the enhanced sorting system implemented for the Primarily-like Items Dashboard.

## Components

### 1. SortControls

The `SortControls` component provides a comprehensive interface for configuring sort options. It includes:

- **Primary sort field selection** with order toggle
- **Secondary sort fields** for multi-level sorting
- **Add/remove sort fields** functionality
- **Reorder sort fields** to change sort priority
- **Reset to default** option

### 2. ActiveSortIndicator

The `ActiveSortIndicator` component displays currently active sort configurations as chips/badges with the ability to modify or remove individual sort fields. Features include:

- **Visual indicators** for each active sort field
- **Order indicators** showing ascending or descending
- **One-click removal** of individual sort fields
- **Reset to default** button to remove all custom sorting

### 3. SortableColumnHeader

The `SortableColumnHeader` component enhances table column headers with sort indicators and click-to-sort functionality. Features include:

- **Sort indicators** showing current sort direction
- **Sort priority indicators** showing sort order (1, 2, 3, etc.)
- **Click to sort** functionality
- **Click again to toggle** between ascending and descending

## Hooks

### useSorting

The `useSorting` custom hook manages sorting state with localStorage persistence. It provides:

- **Sort state management** with default values
- **localStorage persistence** to remember sort settings between sessions
- **Sort manipulation functions**:
  - `setSortField`: Set primary sort field and order
  - `toggleSortOrder`: Toggle primary sort order
  - `addSortField`: Add a secondary sort field
  - `removeSortField`: Remove a secondary sort field
  - `clearSorting`: Reset all sorting to defaults
  - `promoteToPrimary`: Promote a secondary sort field to primary

## Utilities

### sortUtils

The `sortUtils` module provides utility functions for applying sorting:

- **compareValues**: Compare two values for sorting
- **applySorting**: Apply multi-level sorting to an array of items
- **getSortParams**: Get sort parameters for API requests
- **createSortFunction**: Create a sort function for use with Array.sort()

## Sort Configuration Structure

The sorting system uses the following structure for sort state:

```javascript
{
  // Primary sort field and order
  primary: {
    field: "updatedAt",
    order: "desc"
  },
  // Secondary sort fields and orders (for multi-level sorting)
  secondary: [
    { field: "name", order: "asc" },
    { field: "price", order: "desc" }
  ]
}
```

## Usage

### Basic Usage

```jsx
import SortControls from "./components/SortControls";
import useSorting from "./hooks/useSorting";

const MyComponent = () => {
  const [
    sortConfig,
    setSortField,
    clearSorting,
    toggleSortOrder,
    addSortField,
    removeSortField,
    promoteToPrimary,
  ] = useSorting();

  // Available sort fields
  const availableSortFields = [
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
    { value: "createdAt", label: "Created Date" },
  ];

  return (
    <div>
      <SortControls
        sortConfig={sortConfig}
        setSortField={setSortField}
        clearSorting={clearSorting}
        toggleSortOrder={toggleSortOrder}
        addSortField={addSortField}
        removeSortField={removeSortField}
        promoteToPrimary={promoteToPrimary}
        availableSortFields={availableSortFields}
      />
    </div>
  );
};
```

### Table with Sortable Headers

```jsx
import SortableColumnHeader from "./components/SortableColumnHeader";
import useSorting from "./hooks/useSorting";

const MyTable = () => {
  const [sortConfig, setSortField] = useSorting();

  return (
    <table>
      <thead>
        <tr>
          <th>
            <SortableColumnHeader
              field="name"
              label="Name"
              sortConfig={sortConfig}
              setSortField={setSortField}
            />
          </th>
          <th>
            <SortableColumnHeader
              field="price"
              label="Price"
              sortConfig={sortConfig}
              setSortField={setSortField}
            />
          </th>
        </tr>
      </thead>
      <tbody>{/* Table rows */}</tbody>
    </table>
  );
};
```

### Applying Sorting to Data

```jsx
import { applySorting } from "./utils/sortUtils";
import useSorting from "./hooks/useSorting";

const MySortedList = ({ items }) => {
  const [sortConfig] = useSorting();

  // Apply sorting to items
  const sortedItems = applySorting(items, sortConfig);

  return (
    <div>
      {sortedItems.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## API Integration

For server-side sorting, you can use the `getSortParams` utility function to generate sort parameters for API requests:

```javascript
import { getSortParams } from "./utils/sortUtils";
import useSorting from "./hooks/useSorting";

const MyComponent = () => {
  const [sortConfig] = useSorting();

  const fetchSortedData = async () => {
    const sortParams = getSortParams(sortConfig);

    // Example API call with sort parameters
    const response = await fetch(
      `/api/items?sortBy=${sortParams.sortBy}&sortOrder=${sortParams.sortOrder}`
    );
    const data = await response.json();

    return data;
  };

  // Rest of component
};
```

## Best Practices

1. **Performance**: For large datasets, apply sorting on the server side when possible
2. **User Experience**: Provide clear visual indicators for current sort state
3. **Persistence**: Use the built-in localStorage persistence for a better user experience
4. **Defaults**: Set sensible default sort fields and orders
5. **Multi-level Sorting**: Limit the number of secondary sort fields to avoid confusion
6. **Accessibility**: Ensure sort controls are keyboard accessible and have proper ARIA attributes
