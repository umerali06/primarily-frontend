import React from "react";
import {
  TbArrowsSort,
  TbSortAscending,
  TbSortDescending,
  TbX,
} from "react-icons/tb";

/**
 * Component for displaying active sort indicators
 */
const ActiveSortIndicator = ({
  sortConfig,
  setSortField,
  clearSorting,
  availableSortFields = [],
}) => {
  // Get field label from field name
  const getFieldLabel = (fieldName) => {
    const field = availableSortFields.find((f) => f.value === fieldName);
    return field ? field.label : fieldName;
  };

  // Check if any sorting is active
  const hasSorting = () => {
    return (
      sortConfig.primary.field !== "updatedAt" ||
      sortConfig.primary.order !== "desc" ||
      sortConfig.secondary.length > 0
    );
  };

  if (!hasSorting()) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center mb-4 animate-fade-in">
      <div className="flex items-center text-gray-600 text-sm">
        <TbArrowsSort size={16} className="mr-1" />
        <span>Sort:</span>
      </div>

      {/* Primary sort */}
      <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
        {getFieldLabel(sortConfig.primary.field)}
        {sortConfig.primary.order === "asc" ? (
          <TbSortAscending size={14} className="ml-1" />
        ) : (
          <TbSortDescending size={14} className="ml-1" />
        )}
        <button
          onClick={() =>
            setSortField(
              sortConfig.primary.field,
              sortConfig.primary.order === "asc" ? "desc" : "asc"
            )
          }
          className="ml-1 text-primary hover:text-[var(--primary-dark)]"
          aria-label="Toggle sort order"
        >
          <TbX size={14} />
        </button>
      </div>

      {/* Secondary sorts */}
      {sortConfig.secondary.map((sort, index) => (
        <div
          key={sort.field}
          className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full"
        >
          {getFieldLabel(sort.field)}
          {sort.order === "asc" ? (
            <TbSortAscending size={14} className="ml-1" />
          ) : (
            <TbSortDescending size={14} className="ml-1" />
          )}
          <button
            onClick={() => {
              // Remove this secondary sort
              const newSecondary = [...sortConfig.secondary];
              newSecondary.splice(index, 1);
              // Update sort config
              // This would typically be handled by a removeSortField function
              // but we're simulating it here for the indicator component
            }}
            className="ml-1 text-gray-600 hover:text-gray-800"
            aria-label={`Remove ${sort.field} sort`}
          >
            <TbX size={14} />
          </button>
        </div>
      ))}

      {/* Clear all button */}
      <button
        onClick={clearSorting}
        className="text-xs text-gray-600 hover:text-gray-800 underline ml-2"
        aria-label="Clear all sorting"
      >
        Reset to default
      </button>
    </div>
  );
};

export default ActiveSortIndicator;
