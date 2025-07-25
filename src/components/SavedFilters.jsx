import React, { useState, useEffect } from "react";
import {
  TbBookmark,
  TbBookmarkOff,
  TbCheck,
  TbEdit,
  TbTrash,
  TbX,
  TbPlus,
} from "react-icons/tb";

/**
 * Component for saving and managing filter presets
 */
const SavedFilters = ({
  activeFilters,
  onApplyFilter,
  onClearFilters,
  savedFiltersKey = "primarilyDashboardSavedFilters",
}) => {
  const [savedFilters, setSavedFilters] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // Load saved filters from localStorage
  useEffect(() => {
    try {
      const storedFilters = localStorage.getItem(savedFiltersKey);
      if (storedFilters) {
        setSavedFilters(JSON.parse(storedFilters));
      }
    } catch (error) {
      console.error("Error loading saved filters:", error);
    }
  }, [savedFiltersKey]);

  // Save filters to localStorage
  const persistFilters = (filters) => {
    try {
      localStorage.setItem(savedFiltersKey, JSON.stringify(filters));
    } catch (error) {
      console.error("Error saving filters:", error);
    }
  };

  // Check if current filters are active
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
      activeFilters.dateRange.end
    );
  };

  // Save current filters
  const handleSaveFilter = () => {
    if (!filterName.trim()) return;

    const newFilter = {
      name: filterName.trim(),
      filters: { ...activeFilters },
      createdAt: new Date().toISOString(),
    };

    let updatedFilters;
    if (editingIndex !== null) {
      // Update existing filter
      updatedFilters = [...savedFilters];
      updatedFilters[editingIndex] = newFilter;
    } else {
      // Add new filter
      updatedFilters = [...savedFilters, newFilter];
    }

    setSavedFilters(updatedFilters);
    persistFilters(updatedFilters);
    setFilterName("");
    setShowSaveDialog(false);
    setEditingIndex(null);
  };

  // Delete a saved filter
  const handleDeleteFilter = (index) => {
    const updatedFilters = savedFilters.filter((_, i) => i !== index);
    setSavedFilters(updatedFilters);
    persistFilters(updatedFilters);
  };

  // Edit a saved filter
  const handleEditFilter = (index) => {
    setFilterName(savedFilters[index].name);
    setEditingIndex(index);
    setShowSaveDialog(true);
  };

  // Apply a saved filter
  const handleApplyFilter = (filter) => {
    onApplyFilter(filter.filters);
  };

  // Get filter summary text
  const getFilterSummary = (filter) => {
    const parts = [];

    if (filter.filters.lowStock) parts.push("Low Stock");
    if (filter.filters.outOfStock) parts.push("Out of Stock");
    if (filter.filters.hasImages) parts.push("Has Images");
    if (filter.filters.priceRange.min)
      parts.push(`Min Price: ${filter.filters.priceRange.min}`);
    if (filter.filters.priceRange.max)
      parts.push(`Max Price: ${filter.filters.priceRange.max}`);
    if (filter.filters.tags.length)
      parts.push(`${filter.filters.tags.length} Tags`);
    if (filter.filters.categories.length)
      parts.push(`${filter.filters.categories.length} Categories`);
    if (filter.filters.locations.length)
      parts.push(`${filter.filters.locations.length} Locations`);
    if (filter.filters.dateRange.start)
      parts.push(
        `From: ${new Date(filter.filters.dateRange.start).toLocaleDateString()}`
      );
    if (filter.filters.dateRange.end)
      parts.push(
        `To: ${new Date(filter.filters.dateRange.end).toLocaleDateString()}`
      );

    return parts.join(", ");
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <TbBookmark size={16} className="mr-1 text-primary" />
          Saved Filters
        </h3>
        {hasActiveFilters() && (
          <button
            onClick={() => setShowSaveDialog(true)}
            className="text-xs text-primary hover:text-[var(--primary-dark)] flex items-center"
          >
            <TbPlus size={14} className="mr-1" />
            Save Current Filters
          </button>
        )}
      </div>

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700">
              {editingIndex !== null ? "Edit Filter" : "Save Filter"}
            </h4>
            <button
              onClick={() => {
                setShowSaveDialog(false);
                setFilterName("");
                setEditingIndex(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <TbX size={16} />
            </button>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Filter name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
              autoFocus
            />
            <button
              onClick={handleSaveFilter}
              disabled={!filterName.trim()}
              className={`px-3 py-2 rounded-md text-sm ${
                filterName.trim()
                  ? "btn-primary text-white hover:btn-primary-hover"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              <TbCheck size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Saved Filters List */}
      {savedFilters.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {savedFilters.map((filter, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-2 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleApplyFilter(filter)}
                  className="text-sm font-medium text-gray-800 hover:text-primary text-left flex-1 truncate"
                  title={filter.name}
                >
                  {filter.name}
                </button>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditFilter(index)}
                    className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
                    title="Edit filter"
                  >
                    <TbEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteFilter(index)}
                    className="p-1 text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100"
                    title="Delete filter"
                  >
                    <TbTrash size={14} />
                  </button>
                </div>
              </div>
              <p
                className="text-xs text-gray-500 truncate"
                title={getFilterSummary(filter)}
              >
                {getFilterSummary(filter) || "No filters applied"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-3 bg-gray-50 rounded-lg border border-gray-200">
          <TbBookmarkOff size={24} className="mx-auto text-gray-400 mb-1" />
          <p className="text-xs text-gray-500">No saved filters</p>
          {hasActiveFilters() && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="mt-2 text-xs text-primary hover:text-[var(--primary-dark)]"
            >
              Save current filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedFilters;
