# Advanced Filter System Documentation

This document provides an overview of the advanced filter system implemented for the Primarily-like Items Dashboard.

## Components

### 1. FilterPanel

The `FilterPanel` component provides a comprehensive interface for applying various filters to the items list. It includes:

- **Expandable/collapsible sections** for different filter categories
- **Multiple filter types**:
  - Stock level filters (low stock, out of stock, has images)
  - Price range filters with min/max values
  - Date range filters with calendar picker
  - Category filters with suggestions
  - Tag filters with suggestions
  - Location filters with suggestions
- **Clear all** functionality to reset filters
- **Apply filters** button to confirm filter selections

### 2. ActiveFilters

The `ActiveFilters` component displays currently active filters as chips/badges with the ability to remove individual filters. Features include:

- **Visual indicators** for each active filter
- **One-click removal** of individual filters
- **Clear all** button to remove all filters at once
- **Animated appearance/disappearance** of filter chips

### 3. SavedFilters

The `SavedFilters` component allows users to save and manage filter presets. Features include:

- **Save current filters** with a custom name
- **Apply saved filters** with a single click
- **Edit saved filters** to update their name or configuration
- **Delete saved filters** that are no longer needed
- **Filter summaries** showing what each saved filter contains

### 4. AdvancedFilterSystem

The `AdvancedFilterSystem` component integrates all the above components into a cohesive system. It:

- **Manages filter state** across components
- **Handles filter changes** and notifies parent components
- **Toggles visibility** of filter panel and saved filters
- **Displays filter count** to indicate how many filters are active

## Hooks

### useFilters

The `useFilters` custom hook manages filter state with localStorage persistence. It provides:

- **Filter state management** with default values
- **localStorage persistence** to remember filters between sessions
- **Filter manipulation functions**:
  - `setFilter`: Update a specific filter
  - `clearFilters`: Reset all filters to defaults
  - `applyFilterPreset`: Apply a saved filter preset

## Usage

### Basic Usage

```jsx
import AdvancedFilterSystem from "./components/AdvancedFilterSystem";

const MyComponent = () => {
  const handleFiltersChange = (filters) => {
    // Apply filters to your data
    console.log("Filters changed:", filters);
  };

  return (
    <AdvancedFilterSystem
      onFiltersChange={handleFiltersChange}
      categories={["Electronics", "Furniture", "Office Supplies"]}
      tags={["new", "fragile", "valuable"]}
      locations={["Warehouse A", "Office 101"]}
    />
  );
};
```

### Advanced Usage

For more control over the filter system, you can use the individual components:

```jsx
import { useState } from "react";
import FilterPanel from "./components/FilterPanel";
import ActiveFilters from "./components/ActiveFilters";
import SavedFilters from "./components/SavedFilters";
import useFilters from "./hooks/useFilters";

const MyAdvancedComponent = () => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filters, setFilter, clearFilters, applyFilterPreset] = useFilters();

  const handleFilterChange = (name, value) => {
    setFilter(name, value);
    // Apply filters to your data
  };

  return (
    <div>
      <button onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}>
        Toggle Filters
      </button>

      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        activeFilters={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={clearFilters}
        onApplyFilters={() => setIsFilterPanelOpen(false)}
        categories={["Electronics", "Furniture"]}
        tags={["new", "fragile"]}
        locations={["Warehouse A", "Office 101"]}
      />

      <ActiveFilters
        activeFilters={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={clearFilters}
      />

      <SavedFilters
        activeFilters={filters}
        onApplyFilter={applyFilterPreset}
        onClearFilters={clearFilters}
      />
    </div>
  );
};
```

## Filter Structure

The filter system uses the following structure for filter state:

```javascript
{
  searchQuery: "", // Text search query
  lowStock: false, // Show only low stock items
  outOfStock: false, // Show only out of stock items
  hasImages: false, // Show only items with images
  priceRange: {
    min: "", // Minimum price (string for empty state)
    max: "" // Maximum price (string for empty state)
  },
  tags: [], // Array of selected tags
  categories: [], // Array of selected categories
  locations: [], // Array of selected locations
  dateRange: {
    start: null, // Start date (Date object or null)
    end: null // End date (Date object or null)
  }
}
```

## Customization

The filter system can be customized in several ways:

### Storage Keys

You can specify custom storage keys for filters and saved filters:

```jsx
<AdvancedFilterSystem
  storageKey="myCustomFiltersKey"
  savedFiltersKey="myCustomSavedFiltersKey"
  // ...other props
/>
```

### Initial Filters

You can provide initial filters when using the `useFilters` hook:

```javascript
const [filters, setFilter, clearFilters] = useFilters("storageKey", {
  lowStock: true, // Start with low stock filter enabled
  categories: ["Electronics"], // Start with Electronics category selected
});
```

### Styling

The components use Tailwind CSS classes and can be styled by customizing your Tailwind configuration or by adding custom CSS classes.

## Best Practices

1. **Performance**: For large datasets, apply filters on the server side when possible
2. **User Experience**: Keep the most commonly used filters easily accessible
3. **Persistence**: Use the built-in localStorage persistence for a better user experience
4. **Feedback**: Always provide clear visual feedback when filters are applied
5. **Defaults**: Consider setting sensible default filters for first-time users
