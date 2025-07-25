import React, { useRef, useEffect } from "react";
import { getGridClasses } from "../utils/gridUtils";
import ItemCard from "./ItemCard";
import { createGridKeyboardHandler } from "../utils/keyboardNavUtils";

/**
 * Enhanced grid view for displaying items with improved visual hierarchy
 */
const EnhancedItemsGrid = ({
  items,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onEditItem,
  onDeleteItem,
  onViewHistory,
  onViewDetails,
  columnSettings = { sm: 2, md: 3, lg: 4, xl: 5 },
}) => {
  const gridRef = useRef(null);

  // Set up keyboard navigation
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleKeyDown = createGridKeyboardHandler({
      items,
      selectedItems,
      onSelectItem,
      onSelectAll,
      onDeleteItem,
      onEditItem,
      onViewDetails,
      gridSettings: { columns: columnSettings },
    });

    grid.addEventListener("keydown", handleKeyDown);

    // Focus the grid to enable keyboard navigation
    if (items.length > 0 && !grid.contains(document.activeElement)) {
      grid.tabIndex = -1;
      grid.focus();
    }

    return () => {
      grid.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    items,
    selectedItems,
    onSelectItem,
    onSelectAll,
    onDeleteItem,
    onEditItem,
    onViewDetails,
    columnSettings,
  ]);
  // Generate dynamic grid class based on column settings
  const gridClass = getGridClasses(columnSettings);

  return (
    <div
      ref={gridRef}
      className={gridClass}
      tabIndex="-1"
      aria-label="Items grid"
      role="grid"
    >
      {items.map((item) => {
        if (!item || !item._id) return null;
        return (
          <ItemCard
            key={item._id}
            item={item}
            isSelected={selectedItems.includes(item._id)}
            onSelect={onSelectItem}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
            onViewHistory={onViewHistory}
            onViewDetails={onViewDetails}
          />
        );
      })}
    </div>
  );
};

export default EnhancedItemsGrid;
