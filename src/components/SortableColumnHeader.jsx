import React from "react";
import {
  TbArrowsSort,
  TbSortAscending,
  TbSortDescending,
  TbArrowUp,
  TbArrowDown,
} from "react-icons/tb";

/**
 * Component for displaying sortable column headers with indicators
 */
const SortableColumnHeader = ({
  field,
  label,
  sortConfig,
  setSortField,
  className = "",
}) => {
  // Check if this field is the primary sort
  const isPrimarySort = sortConfig.primary.field === field;

  // Check if this field is in the secondary sorts
  const secondarySort = sortConfig.secondary.find(
    (sort) => sort.field === field
  );

  // Determine if this field is sorted and in what order
  const isSorted = isPrimarySort || secondarySort;
  const sortOrder = isPrimarySort
    ? sortConfig.primary.order
    : secondarySort
    ? secondarySort.order
    : null;

  // Handle click on column header
  const handleClick = () => {
    if (isPrimarySort) {
      // Toggle sort order if already primary sort
      setSortField(field, sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set as primary sort
      setSortField(field);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 hover:text-gray-700 group ${className}`}
      aria-label={`Sort by ${label}`}
      title={`Sort by ${label}`}
    >
      <span>{label}</span>

      {isSorted ? (
        sortOrder === "asc" ? (
          <TbArrowUp size={14} className="text-primary" />
        ) : (
          <TbArrowDown size={14} className="text-primary" />
        )
      ) : (
        <TbArrowsSort
          size={14}
          className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}

      {isPrimarySort && (
        <span className="ml-1 text-xs text-primary font-medium">1</span>
      )}

      {secondarySort && (
        <span className="ml-1 text-xs text-gray-500 font-medium">
          {sortConfig.secondary.findIndex((sort) => sort.field === field) + 2}
        </span>
      )}
    </button>
  );
};

export default SortableColumnHeader;
