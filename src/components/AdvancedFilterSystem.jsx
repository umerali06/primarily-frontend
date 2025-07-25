import React, { useState } from "react";
import { TbFilter, TbChevronDown, TbChevronUp } from "react-icons/tb";
import FilterPanel from "./FilterPanel";
import ActiveFilters from "./ActiveFilters";
import SavedFilters from "./SavedFilters";
import useFilters from "../hooks/useFilters";

/**
 * Advanced filter system that integrates FilterPanel, ActiveFilters, and SavedFilters
 */
const AdvancedFilterSystem = ({
  onFiltersChange,
  categories = [],
  tags = [],
  locations = [],
  storageKey = "primarilyDashboardFilters",
  savedFiltersKey = "primarilyDashboardSavedFilters",
}) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [filters, setFilter, clearFilters, applyFilterPreset] =
    useFilters(storageKey);

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilter(name, value);
    if (onFiltersChange) {
      onFiltersChange({ ...filters, [name]: value });
    }
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    clearFilters();
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    setIsFilterPanelOpen(false);
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  // Apply filter preset
  const handleApplyFilterPreset = (preset) => {
    applyFilterPreset(preset);
    if (onFiltersChange) {
      onFiltersChange(preset);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.lowStock ||
      filters.outOfStock ||
      filters.hasImages ||
      filters.priceRange.min ||
      filters.priceRange.max ||
      filters.tags.length > 0 ||
      filters.categories.length > 0 ||
      filters.locations.length > 0 ||
      filters.dateRange.start ||
      filters.dateRange.end ||
      filters.searchQuery
    );
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
        <div className="flex items-center">
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center px-3 py-2 rounded-lg border ${
              isFilterPanelOpen || hasActiveFilters()
                ? "bg-primary-light border-[var(--bg-primary)] text-primary"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <TbFilter size={18} className="mr-2" />
            <span>Filters</span>
            {hasActiveFilters() && (
              <span className="ml-2 btn-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.entries(filters).reduce((count, [key, value]) => {
                  if (key === "priceRange") {
                    if (value.min) count++;
                    if (value.max) count++;
                  } else if (key === "dateRange") {
                    if (value.start) count++;
                    if (value.end) count++;
                  } else if (
                    key === "tags" ||
                    key === "categories" ||
                    key === "locations"
                  ) {
                    count += value.length;
                  } else if (value && key !== "searchQuery") {
                    count++;
                  }
                  return count;
                }, 0)}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowSavedFilters(!showSavedFilters)}
            className="ml-2 flex items-center text-gray-600 hover:text-gray-800"
          >
            Saved Filters
            {showSavedFilters ? (
              <TbChevronUp size={16} className="ml-1" />
            ) : (
              <TbChevronDown size={16} className="ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Saved Filters Section */}
      {showSavedFilters && (
        <div className="mb-4 animate-slide-down">
          <SavedFilters
            activeFilters={filters}
            onApplyFilter={handleApplyFilterPreset}
            onClearFilters={handleClearAllFilters}
            savedFiltersKey={savedFiltersKey}
          />
        </div>
      )}

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        activeFilters={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
        onApplyFilters={handleApplyFilters}
        categories={categories}
        tags={tags}
        locations={locations}
      />

      {/* Active Filters */}
      <ActiveFilters
        activeFilters={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
      />
    </div>
  );
};

export default AdvancedFilterSystem;
