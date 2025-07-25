import React, { useState } from "react";
import {
  TbSearch,
  TbFilter,
  TbArrowsSort,
  TbRefresh,
  TbSettings,
  TbColumns,
  TbChevronDown,
  TbChevronUp,
} from "react-icons/tb";
import AdvancedFilterSystem from "./AdvancedFilterSystem";
import SortControls from "./SortControls";
import ActiveSortIndicator from "./ActiveSortIndicator";
import ActiveFilters from "./ActiveFilters";

/**
 * Comprehensive data management toolbar that integrates filtering and sorting
 */
const DataManagementToolbar = ({
  onFiltersChange,
  onSortChange,
  onRefresh,
  onColumnsChange,
  categories = [],
  tags = [],
  locations = [],
  availableSortFields = [],
  filterStorageKey = "primarilyDashboardFilters",
  savedFiltersKey = "primarilyDashboardSavedFilters",
  sortStorageKey = "primarilyDashboardSorting",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showColumns, setShowColumns] = useState(false);

  // Handle search
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      onFiltersChange({ ...filters, searchQuery });
    }
  };

  // Handle filter change
  const handleFiltersChange = (filters) => {
    if (onFiltersChange) {
      onFiltersChange({ ...filters, searchQuery });
    }
  };

  // Handle sort change
  const handleSortChange = (sortConfig) => {
    if (onSortChange) {
      onSortChange(sortConfig);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex items-center">
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50 focus:border-transparent"
            />
            <TbSearch
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Button */}
          <button
            onClick={() => {
              setShowFilters(!showFilters);
              setShowSort(false);
              setShowColumns(false);
            }}
            className={`flex items-center px-3 py-2 rounded-lg border ${
              showFilters
                ? "bg-primary-light border-[var(--bg-primary)] text-primary"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <TbFilter size={18} className="mr-2" />
            <span>Filter</span>
            {showFilters ? (
              <TbChevronUp size={16} className="ml-2" />
            ) : (
              <TbChevronDown size={16} className="ml-2" />
            )}
          </button>

          {/* Sort Button */}
          <button
            onClick={() => {
              setShowSort(!showSort);
              setShowFilters(false);
              setShowColumns(false);
            }}
            className={`flex items-center px-3 py-2 rounded-lg border ${
              showSort
                ? "bg-primary-light border-[var(--bg-primary)] text-primary"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
            aria-expanded={showSort}
            aria-controls="sort-panel"
          >
            <TbArrowsSort size={18} className="mr-2" />
            <span>Sort</span>
            {showSort ? (
              <TbChevronUp size={16} className="ml-2" />
            ) : (
              <TbChevronDown size={16} className="ml-2" />
            )}
          </button>

          {/* Columns Button */}
          <button
            onClick={() => {
              setShowColumns(!showColumns);
              setShowFilters(false);
              setShowSort(false);
            }}
            className={`flex items-center px-3 py-2 rounded-lg border ${
              showColumns
                ? "bg-primary-light border-[var(--bg-primary)] text-primary"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
            aria-expanded={showColumns}
            aria-controls="columns-panel"
          >
            <TbColumns size={18} className="mr-2" />
            <span>Columns</span>
            {showColumns ? (
              <TbChevronUp size={16} className="ml-2" />
            ) : (
              <TbChevronDown size={16} className="ml-2" />
            )}
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Refresh"
            title="Refresh"
          >
            <TbRefresh size={20} />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              // Handle settings
            }}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Settings"
            title="Settings"
          >
            <TbSettings size={20} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div id="filter-panel" className="animate-fade-in">
          <AdvancedFilterSystem
            onFiltersChange={handleFiltersChange}
            categories={categories}
            tags={tags}
            locations={locations}
            storageKey={filterStorageKey}
            savedFiltersKey={savedFiltersKey}
          />
        </div>
      )}

      {/* Sort Panel */}
      {showSort && (
        <div id="sort-panel" className="animate-fade-in">
          <SortControls
            sortConfig={{}}
            setSortField={() => {}}
            clearSorting={() => {}}
            toggleSortOrder={() => {}}
            addSortField={() => {}}
            removeSortField={() => {}}
            promoteToPrimary={() => {}}
            availableSortFields={availableSortFields}
          />
          <ActiveSortIndicator
            sortConfig={{}}
            setSortField={() => {}}
            clearSorting={() => {}}
            availableSortFields={availableSortFields}
          />
        </div>
      )}

      {/* Columns Panel */}
      {showColumns && (
        <div id="columns-panel" className="animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Column Settings
              </h3>
              <button
                onClick={() => setShowColumns(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <TbChevronUp size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {/* Column settings content */}
              <p className="text-gray-600">
                Column customization coming soon...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagementToolbar;
