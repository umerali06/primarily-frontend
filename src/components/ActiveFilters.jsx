import React from "react";
import { TbX, TbFilter, TbFilterOff } from "react-icons/tb";

/**
 * Component to display active filters with the ability to remove individual filters
 */
const ActiveFilters = ({
  activeFilters,
  onFilterChange,
  onClearAllFilters,
}) => {
  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      activeFilters.lowStock ||
      activeFilters.outOfStock ||
      activeFilters.hasImages ||
      activeFilters.priceRange.min ||
      activeFilters.priceRange.max ||
      activeFilters.tags.length > 0 ||
      activeFilters.categories.length > 0 ||
      activeFilters.locations.length > 0 ||
      activeFilters.dateRange.start ||
      activeFilters.dateRange.end ||
      activeFilters.searchQuery
    );
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  if (!hasActiveFilters()) return null;

  return (
    <div className="mb-4 animate-fade-in">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center text-gray-600 text-sm">
          <TbFilter size={16} className="mr-1" />
          <span>Filters:</span>
        </div>

        {/* Search Query */}
        {activeFilters.searchQuery && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            Search: {activeFilters.searchQuery}
            <button
              onClick={() => onFilterChange("searchQuery", "")}
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
              aria-label="Remove search filter"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {/* Stock Filters */}
        {activeFilters.lowStock && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            Low Stock
            <button
              onClick={() => onFilterChange("lowStock", false)}
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
              aria-label="Remove low stock filter"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {activeFilters.outOfStock && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            Out of Stock
            <button
              onClick={() => onFilterChange("outOfStock", false)}
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
              aria-label="Remove out of stock filter"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {activeFilters.hasImages && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            Has Images
            <button
              onClick={() => onFilterChange("hasImages", false)}
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
              aria-label="Remove has images filter"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {/* Price Range Filters */}
        {activeFilters.priceRange.min && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            Min Price: {activeFilters.priceRange.min}
            <button
              onClick={() =>
                onFilterChange("priceRange", {
                  ...activeFilters.priceRange,
                  min: "",
                })
              }
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
              aria-label="Remove minimum price filter"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {activeFilters.priceRange.max && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            Max Price: {activeFilters.priceRange.max}
            <button
              onClick={() =>
                onFilterChange("priceRange", {
                  ...activeFilters.priceRange,
                  max: "",
                })
              }
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
              aria-label="Remove maximum price filter"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {/* Date Range Filters */}
        {activeFilters.dateRange.start && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            From: {formatDate(activeFilters.dateRange.start)}
            <button
              onClick={() =>
                onFilterChange("dateRange", {
                  ...activeFilters.dateRange,
                  start: null,
                })
              }
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
              aria-label="Remove start date filter"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {activeFilters.dateRange.end && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            To: {formatDate(activeFilters.dateRange.end)}
            <button
              onClick={() =>
                onFilterChange("dateRange", {
                  ...activeFilters.dateRange,
                  end: null,
                })
              }
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
              aria-label="Remove end date filter"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {/* Category Filters */}
        {activeFilters.categories.map((category) => (
          <div
            key={category}
            className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full"
          >
            Category: {category}
            <button
              onClick={() =>
                onFilterChange(
                  "categories",
                  activeFilters.categories.filter((c) => c !== category)
                )
              }
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
              aria-label={`Remove category ${category} filter`}
            >
              <TbX size={14} />
            </button>
          </div>
        ))}

        {/* Tag Filters */}
        {activeFilters.tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full"
          >
            Tag: {tag}
            <button
              onClick={() =>
                onFilterChange(
                  "tags",
                  activeFilters.tags.filter((t) => t !== tag)
                )
              }
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
              aria-label={`Remove tag ${tag} filter`}
            >
              <TbX size={14} />
            </button>
          </div>
        ))}

        {/* Location Filters */}
        {activeFilters.locations.map((location) => (
          <div
            key={location}
            className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full"
          >
            Location: {location}
            <button
              onClick={() =>
                onFilterChange(
                  "locations",
                  activeFilters.locations.filter((l) => l !== location)
                )
              }
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
              aria-label={`Remove location ${location} filter`}
            >
              <TbX size={14} />
            </button>
          </div>
        ))}

        {/* Clear All Button */}
        <button
          onClick={onClearAllFilters}
          className="flex items-center text-xs text-gray-600 hover:text-gray-800 underline ml-2"
          aria-label="Clear all filters"
        >
          <TbFilterOff size={14} className="mr-1" />
          Clear All
        </button>
      </div>
    </div>
  );
};

export default ActiveFilters;
