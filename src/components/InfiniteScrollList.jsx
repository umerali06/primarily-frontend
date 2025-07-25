import React, { useRef, useCallback, useEffect } from "react";
import { VariableSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";

/**
 * InfiniteScrollList component for efficiently loading and rendering large lists
 * Uses react-window and react-window-infinite-loader for virtualization and infinite scrolling
 */
const InfiniteScrollList = ({
  items,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  renderItem,
  itemCount,
  estimatedItemHeight = 100,
}) => {
  const infiniteLoaderRef = useRef();
  const listRef = useRef();

  // Reset the list when items change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [items]);

  // Item key extractor for better React reconciliation
  const getItemKey = useCallback(
    (index) => {
      return items[index]?._id || index;
    },
    [items]
  );

  // Determine if an item is loaded
  const isItemLoaded = useCallback(
    (index) => {
      return !hasNextPage || index < items.length;
    },
    [hasNextPage, items]
  );

  // Get the total item count (including loading items)
  const getItemCount = useCallback(() => {
    return hasNextPage ? items.length + 1 : items.length;
  }, [hasNextPage, items]);

  // Get the height for each item (can be customized based on item content)
  const getItemHeight = useCallback(
    (index) => {
      // You can customize this based on item content if needed
      return estimatedItemHeight;
    },
    [estimatedItemHeight]
  );

  // Render each item in the list
  const ItemRenderer = useCallback(
    ({ index, style }) => {
      if (!isItemLoaded(index)) {
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div className="animate-pulse flex space-x-4 w-full">
              <div className="rounded-lg bg-gray-200 h-16 w-16"></div>
              <div className="flex-1 space-y-3 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        );
      }

      return renderItem({
        item: items[index],
        index,
        style,
      });
    },
    [items, isItemLoaded, renderItem]
  );

  return (
    <div className="w-full h-full">
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            ref={infiniteLoaderRef}
            isItemLoaded={isItemLoaded}
            itemCount={getItemCount()}
            loadMoreItems={loadNextPage}
            threshold={5}
          >
            {({ onItemsRendered, ref }) => (
              <VariableSizeList
                ref={(list) => {
                  ref(list);
                  listRef.current = list;
                }}
                height={height}
                width={width}
                itemCount={getItemCount()}
                itemSize={getItemHeight}
                itemKey={getItemKey}
                onItemsRendered={onItemsRendered}
                overscanCount={3}
              >
                {ItemRenderer}
              </VariableSizeList>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
};

export default InfiniteScrollList;
