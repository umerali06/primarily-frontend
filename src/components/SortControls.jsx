import React, { useState } from "react";
import {
  TbArrowsSort,
  TbSortAscending,
  TbSortDescending,
  TbX,
  TbPlus,
  TbArrowUp,
  TbArrowDown,
  TbArrowsExchange,
  TbChevronDown,
  TbChevronUp,
} from "react-icons/tb";

/**
 * Component for displaying and managing sort options
 */
const SortControls = ({
  sortConfig,
  setSortField,
  clearSorting,
  toggleSortOrder,
  addSortField,
  removeSortField,
  promoteToPrimary,
  availableSortFields = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddField, setShowAddField] = useState(false);

  // Get field label from field name
  const getFieldLabel = (fieldName) => {
    const field = availableSortFields.find((f) => f.value === fieldName);
    return field ? field.label : fieldName;
  };

  // Get sort icon based on order
  const getSortIcon = (order) => {
    return order === "asc" ? (
      <TbSortAscending size={16} />
    ) : (
      <TbSortDescending size={16} />
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center px-3 py-2 rounded-lg border ${
          isExpanded
            ? "bg-primary-light border-[var(--bg-primary)] text-primary"
            : "border-gray-300 text-gray-600 hover:bg-gray-50"
        }`}
        aria-expanded={isExpanded}
        aria-controls="sort-dropdown"
      >
        <TbArrowsSort size={18} className="mr-2" />
        <span>Sort</span>
        {isExpanded ? (
          <TbChevronUp size={16} className="ml-2" />
        ) : (
          <TbChevronDown size={16} className="ml-2" />
        )}
      </button>

      {isExpanded && (
        <div
          id="sort-dropdown"
          className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 animate-fade-in"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">Sort Options</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close sort options"
            >
              <TbX size={16} />
            </button>
          </div>

          {/* Primary sort field */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-600">
                Primary Sort
              </label>
              <button
                onClick={toggleSortOrder}
                className="text-xs text-primary hover:text-[var(--primary-dark)] flex items-center"
                aria-label="Toggle sort order"
              >
                {sortConfig.primary.order === "asc" ? (
                  <>
                    <TbArrowDown size={14} className="mr-1" />
                    Descending
                  </>
                ) : (
                  <>
                    <TbArrowUp size={14} className="mr-1" />
                    Ascending
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center bg-primary-light border border-[var(--bg-primary)] rounded-lg p-2">
              <span className="flex-1 text-sm font-medium text-[var(--primary-dark)]">
                {getFieldLabel(sortConfig.primary.field)}
              </span>
              <div className="text-primary">
                {getSortIcon(sortConfig.primary.order)}
              </div>
            </div>
          </div>

          {/* Secondary sort fields */}
          {sortConfig.secondary.length > 0 && (
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 block mb-2">
                Secondary Sort
              </label>
              <div className="space-y-2">
                {sortConfig.secondary.map((sort, index) => (
                  <div
                    key={sort.field}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-2"
                  >
                    <span className="text-sm text-gray-800">
                      {getFieldLabel(sort.field)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          const newOrder =
                            sort.order === "asc" ? "desc" : "asc";
                          addSortField(sort.field, newOrder);
                        }}
                        className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
                        aria-label={`Toggle ${sort.field} sort order`}
                      >
                        {getSortIcon(sort.order)}
                      </button>
                      <button
                        onClick={() => promoteToPrimary(index)}
                        className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
                        aria-label={`Make ${sort.field} primary sort`}
                        title="Make primary sort"
                      >
                        <TbArrowsExchange size={16} />
                      </button>
                      <button
                        onClick={() => removeSortField(sort.field)}
                        className="p-1 text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100"
                        aria-label={`Remove ${sort.field} sort`}
                      >
                        <TbX size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add sort field */}
          <div className="mb-4">
            {showAddField ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 animate-fade-in">
                <label className="text-xs font-medium text-gray-600 block mb-2">
                  Add Sort Field
                </label>
                <div className="flex space-x-2">
                  <select
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                    onChange={(e) => {
                      if (e.target.value) {
                        addSortField(e.target.value);
                        setShowAddField(false);
                      }
                    }}
                    value=""
                  >
                    <option value="" disabled>
                      Select field
                    </option>
                    {availableSortFields
                      .filter(
                        (field) =>
                          field.value !== sortConfig.primary.field &&
                          !sortConfig.secondary.some(
                            (s) => s.field === field.value
                          )
                      )
                      .map((field) => (
                        <option key={field.value} value={field.value}>
                          {field.label}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => setShowAddField(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-300 rounded-md"
                  >
                    <TbX size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddField(true)}
                className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                disabled={
                  availableSortFields.length <= 1 + sortConfig.secondary.length
                }
              >
                <TbPlus size={16} className="mr-1" />
                Add Sort Field
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={clearSorting}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
            >
              Reset
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3 py-1.5 text-sm btn-primary text-white rounded-md hover:btn-primary-hover"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortControls;
