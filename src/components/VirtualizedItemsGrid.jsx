import React, { useRef, useEffect, useState } from "react";
import { FixedSizeGrid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import ItemCard from "./ItemCard";

/**
 * Virtualized grid component for efficiently rendering large lists of items
 * Uses react-window for virtualization to improve performance
 */
const VirtualizedItemsGrid = ({
  items,
  selectedItems,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  onViewHistory,
  onViewDetails,
  columnSettings = { sm: 2, md: 3, lg: 4, xl: 5 },
}) => {
  const gridRef = useRef();
  const [columnCount, setColumnCount] = useState(4); // Default column count
  const [itemHeight, setItemHeight] = useState(380); // Default item height

  // Calculate the number of columns based on container width
  const calculateColumns = (width) => {
    if (width < 640) return columnSettings.sm || 2; // sm breakpoint
    if (width < 768) return columnSettings.md || 3; // md breakpoint
    if (width < 1024) return columnSettings.lg || 4; // lg breakpoint
    return columnSettings.xl || 5; // xl breakpoint
  };

  // Cell renderer function for the grid
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const itemIndex = rowIndex * columnCount + columnIndex;

    // Return null if we've rendered all items
    if (itemIndex >= items.length) return null;

    const item = items[itemIndex];
    if (!item || !item._id) return null;

    // Add padding to the style for spacing between items
    const cellStyle = {
      ...style,
      padding: 8,
    };

    return (
      <div style={cellStyle}>
        <ItemCard
          item={item}
          isSelected={selectedItems.includes(item._id)}
          onSelect={onSelectItem}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
          onViewHistory={onViewHistory}
          onViewDetails={onViewDetails}
        />
      </div>
    );
  };

  // Force grid to re-render when items change
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.resetAfterIndices({
        columnIndex: 0,
        rowIndex: 0,
        shouldForceUpdate: true,
      });
    }
  }, [items, selectedItems]);

  return (
    <div className="w-full h-full" style={{ height: "calc(100vh - 200px)" }}>
      <AutoSizer>
        {({ height, width }) => {
          // Calculate columns based on width
          const cols = calculateColumns(width);
          setColumnCount(cols);

          // Calculate rows based on item count and columns
          const rowCount = Math.ceil(items.length / cols);

          return (
            <FixedSizeGrid
              ref={gridRef}
              columnCount={cols}
              columnWidth={width / cols}
              height={height}
              rowCount={rowCount}
              rowHeight={itemHeight}
              width={width}
            >
              {Cell}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedItemsGrid;
