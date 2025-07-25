# Performance Optimization Components

This directory contains components that implement performance optimizations for the Primarily-like Items Dashboard.

## Components

### VirtualizedItemsGrid

A grid component that uses virtualization to efficiently render large lists of items. It only renders items that are currently visible in the viewport, which significantly improves performance when dealing with large datasets.

### InfiniteScrollList

A list component that implements infinite scrolling functionality. It loads more items as the user scrolls down, which improves initial load time and overall performance.

## Dependencies

To use these components, you need to install the following dependencies:

```bash
npm install react-window react-window-infinite-loader react-virtualized-auto-sizer
```

Or if you're using yarn:

```bash
yarn add react-window react-window-infinite-loader react-virtualized-auto-sizer
```

## Usage

### VirtualizedItemsGrid

```jsx
import VirtualizedItemsGrid from "./components/VirtualizedItemsGrid";

// In your component
<VirtualizedItemsGrid
  items={items}
  selectedItems={selectedItems}
  onSelectItem={handleSelectItem}
  onEditItem={handleEditItem}
  onDeleteItem={handleDeleteItem}
  onViewHistory={handleViewHistory}
  columnSettings={{ sm: 2, md: 3, lg: 4, xl: 5 }}
/>;
```

### InfiniteScrollList

```jsx
import InfiniteScrollList from "./components/InfiniteScrollList";

// In your component
<InfiniteScrollList
  items={items}
  hasNextPage={hasMoreItems}
  isNextPageLoading={isLoading}
  loadNextPage={loadMoreItems}
  estimatedItemHeight={120}
  renderItem={({ item, index, style }) => (
    <div style={style}>{/* Your item rendering logic */}</div>
  )}
/>;
```

## Performance Tips

1. Use virtualization for lists with more than 50 items
2. Implement memoization for expensive calculations
3. Use React.memo for pure components
4. Optimize rendering with useCallback and useMemo
5. Implement proper key props for list items
6. Use pagination or infinite scrolling for large datasets
7. Optimize images with proper sizing and lazy loading
8. Debounce search inputs and other frequent events
9. Use web workers for CPU-intensive operations
10. Monitor and optimize component re-renders
