import React, { useState, useEffect } from "react";
import {
  TbX,
  TbChevronDown,
  TbChevronUp,
  TbCalendar,
  TbTag,
  TbFolder,
  TbBox,
  TbCurrencyDollar,
  TbSearch,
  TbCheck,
  TbPlus,
  TbFilter,
  TbFilterOff,
} from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * Advanced FilterPanel component with expandable sections and multiple filter types
 */
const FilterPanel = ({
  isOpen,
  onClose,
  activeFilters,
  onFilterChange,
  onClearAllFilters,
  onApplyFilters,
  categories = [],
  tags = [],
  locations = [],
}) => {
  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    stock: true,
    price: true,
    date: false,
    category: false,
    tags: false,
    location: false,
    custom: false,
  });

  // State for tag input
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !activeFilters.tags.includes(tagInput.trim())) {
      onFilterChange("tags", [...activeFilters.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Handle category input
  const handleAddCategory = () => {
    if (
      categoryInput.trim() &&
      !activeFilters.categories.includes(categoryInput.trim())
    ) {
      onFilterChange("categories", [
        ...activeFilters.categories,
        categoryInput.trim(),
      ]);
      setCategoryInput("");
    }
  };

  // Handle location input
  const handleAddLocation = () => {
    if (
      locationInput.trim() &&
      !activeFilters.locations.includes(locationInput.trim())
    ) {
      onFilterChange("locations", [
        ...activeFilters.locations,
        locationInput.trim(),
      ]);
      setLocationInput("");
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tag) => {
    onFilterChange(
      "tags",
      activeFilters.tags.filter((t) => t !== tag)
    );
  };

  // Handle removing a category
  const handleRemoveCategory = (category) => {
    onFilterChange(
      "categories",
      activeFilters.categories.filter((c) => c !== category)
    );
  };

  // Handle removing a location
  const handleRemoveLocation = (location) => {
    onFilterChange(
      "locations",
      activeFilters.locations.filter((l) => l !== location)
    );
  };

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
      activeFilters.dateRange.end
    );
  };

  // Render filter section header
  const renderSectionHeader = (title, section, icon) => (
    <div
      className="flex items-center justify-between cursor-pointer py-2"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center">
        {icon}
        <h3 className="text-sm font-medium text-gray-700 ml-2">{title}</h3>
      </div>
      {expandedSections[section] ? (
        <TbChevronUp size={18} className="text-gray-500" />
      ) : (
        <TbChevronDown size={18} className="text-gray-500" />
      )}
    </div>
  );

  // If panel is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md animate-slide-down">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <TbFilter size={20} className="text-primary" />
          <h2 className="text-lg font-medium text-gray-800 ml-2">Filters</h2>
        </div>
        <div className="flex items-center">
          {hasActiveFilters() && (
            <button
              onClick={onClearAllFilters}
              className="mr-2 text-sm text-gray-600 hover:text-gray-800 flex items-center"
            >
              <TbFilterOff size={16} className="mr-1" />
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <TbX size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Stock Level Section */}
        <div className="border border-gray-200 rounded-lg p-3">
          {renderSectionHeader(
            "Stock Level",
            "stock",
            <TbBox size={18} className="text-primary" />
          )}
          {expandedSections.stock && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lowStock"
                  checked={activeFilters.lowStock}
                  onChange={(e) => onFilterChange("lowStock", e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary ring-opacity-50 border-gray-300 rounded"
                />
                <label
                  htmlFor="lowStock"
                  className="ml-2 text-sm text-gray-600"
                >
                  Low Stock Items
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="outOfStock"
                  checked={activeFilters.outOfStock}
                  onChange={(e) =>
                    onFilterChange("outOfStock", e.target.checked)
                  }
                  className="h-4 w-4 text-primary focus:ring-primary ring-opacity-50 border-gray-300 rounded"
                />
                <label
                  htmlFor="outOfStock"
                  className="ml-2 text-sm text-gray-600"
                >
                  Out of Stock Items
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasImages"
                  checked={activeFilters.hasImages}
                  onChange={(e) =>
                    onFilterChange("hasImages", e.target.checked)
                  }
                  className="h-4 w-4 text-primary focus:ring-primary ring-opacity-50 border-gray-300 rounded"
                />
                <label
                  htmlFor="hasImages"
                  className="ml-2 text-sm text-gray-600"
                >
                  Has Images
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Price Range Section */}
        <div className="border border-gray-200 rounded-lg p-3">
          {renderSectionHeader(
            "Price Range",
            "price",
            <TbCurrencyDollar size={18} className="text-primary" />
          )}
          {expandedSections.price && (
            <div className="mt-2 space-y-2">
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label
                    htmlFor="minPrice"
                    className="block text-xs text-gray-600 mb-1"
                  >
                    Min Price
                  </label>
                  <input
                    type="number"
                    id="minPrice"
                    placeholder="Min"
                    value={activeFilters.priceRange.min}
                    onChange={(e) =>
                      onFilterChange("priceRange", {
                        ...activeFilters.priceRange,
                        min: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="maxPrice"
                    className="block text-xs text-gray-600 mb-1"
                  >
                    Max Price
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    placeholder="Max"
                    value={activeFilters.priceRange.max}
                    onChange={(e) =>
                      onFilterChange("priceRange", {
                        ...activeFilters.priceRange,
                        max: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Date Range Section */}
        <div className="border border-gray-200 rounded-lg p-3">
          {renderSectionHeader(
            "Date Range",
            "date",
            <TbCalendar size={18} className="text-primary" />
          )}
          {expandedSections.date && (
            <div className="mt-2 space-y-2">
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label
                    htmlFor="startDate"
                    className="block text-xs text-gray-600 mb-1"
                  >
                    Start Date
                  </label>
                  <DatePicker
                    selected={activeFilters.dateRange.start}
                    onChange={(date) =>
                      onFilterChange("dateRange", {
                        ...activeFilters.dateRange,
                        start: date,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                    placeholderText="Start Date"
                    isClearable
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="endDate"
                    className="block text-xs text-gray-600 mb-1"
                  >
                    End Date
                  </label>
                  <DatePicker
                    selected={activeFilters.dateRange.end}
                    onChange={(date) =>
                      onFilterChange("dateRange", {
                        ...activeFilters.dateRange,
                        end: date,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                    placeholderText="End Date"
                    isClearable
                    minDate={activeFilters.dateRange.start}
                  />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "custom") return;

                    const now = new Date();
                    let startDate = new Date();

                    if (value === "today") {
                      startDate.setHours(0, 0, 0, 0);
                    } else if (value === "yesterday") {
                      startDate.setDate(now.getDate() - 1);
                      startDate.setHours(0, 0, 0, 0);
                    } else if (value === "thisWeek") {
                      startDate.setDate(now.getDate() - now.getDay());
                      startDate.setHours(0, 0, 0, 0);
                    } else if (value === "thisMonth") {
                      startDate.setDate(1);
                      startDate.setHours(0, 0, 0, 0);
                    } else if (value === "lastMonth") {
                      startDate.setMonth(now.getMonth() - 1);
                      startDate.setDate(1);
                      startDate.setHours(0, 0, 0, 0);
                    } else if (value === "thisYear") {
                      startDate.setMonth(0);
                      startDate.setDate(1);
                      startDate.setHours(0, 0, 0, 0);
                    }

                    onFilterChange("dateRange", {
                      start: startDate,
                      end: now,
                    });
                  }}
                  defaultValue="custom"
                >
                  <option value="custom">Custom Range</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="thisYear">This Year</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="border border-gray-200 rounded-lg p-3">
          {renderSectionHeader(
            "Categories",
            "category",
            <TbFolder size={18} className="text-primary" />
          )}
          {expandedSections.category && (
            <div className="mt-2 space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="Add category"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-3 py-2 btn-primary text-white rounded-md hover:btn-primary-hover text-sm"
                >
                  <TbPlus size={16} />
                </button>
              </div>
              {categories.length > 0 && (
                <div className="mt-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Suggested Categories
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {categories
                      .filter(
                        (category) =>
                          !activeFilters.categories.includes(category)
                      )
                      .slice(0, 5)
                      .map((category) => (
                        <button
                          key={category}
                          onClick={() =>
                            onFilterChange("categories", [
                              ...activeFilters.categories,
                              category,
                            ])
                          }
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200"
                        >
                          {category}
                        </button>
                      ))}
                  </div>
                </div>
              )}
              {activeFilters.categories.length > 0 && (
                <div className="mt-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Selected Categories
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {activeFilters.categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs px-2 py-1 rounded-full"
                      >
                        {category}
                        <button
                          onClick={() => handleRemoveCategory(category)}
                          className="ml-1 text-primary hover:text-[var(--primary-dark)]"
                        >
                          <TbX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div className="border border-gray-200 rounded-lg p-3">
          {renderSectionHeader(
            "Tags",
            "tags",
            <TbTag size={18} className="text-primary" />
          )}
          {expandedSections.tags && (
            <div className="mt-2 space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Add tag"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 btn-primary text-white rounded-md hover:btn-primary-hover text-sm"
                >
                  <TbPlus size={16} />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Suggested Tags
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {tags
                      .filter((tag) => !activeFilters.tags.includes(tag))
                      .slice(0, 5)
                      .map((tag) => (
                        <button
                          key={tag}
                          onClick={() =>
                            onFilterChange("tags", [...activeFilters.tags, tag])
                          }
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200"
                        >
                          {tag}
                        </button>
                      ))}
                  </div>
                </div>
              )}
              {activeFilters.tags.length > 0 && (
                <div className="mt-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Selected Tags
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {activeFilters.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-primary hover:text-[var(--primary-dark)]"
                        >
                          <TbX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="border border-gray-200 rounded-lg p-3">
          {renderSectionHeader(
            "Location",
            "location",
            <TbSearch size={18} className="text-primary" />
          )}
          {expandedSections.location && (
            <div className="mt-2 space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddLocation()}
                  placeholder="Add location"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ring-opacity-50"
                />
                <button
                  onClick={handleAddLocation}
                  className="px-3 py-2 btn-primary text-white rounded-md hover:btn-primary-hover text-sm"
                >
                  <TbPlus size={16} />
                </button>
              </div>
              {locations.length > 0 && (
                <div className="mt-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Suggested Locations
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {locations
                      .filter(
                        (location) =>
                          !activeFilters.locations.includes(location)
                      )
                      .slice(0, 5)
                      .map((location) => (
                        <button
                          key={location}
                          onClick={() =>
                            onFilterChange("locations", [
                              ...activeFilters.locations,
                              location,
                            ])
                          }
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200"
                        >
                          {location}
                        </button>
                      ))}
                  </div>
                </div>
              )}
              {activeFilters.locations.length > 0 && (
                <div className="mt-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Selected Locations
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {activeFilters.locations.map((location) => (
                      <div
                        key={location}
                        className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs px-2 py-1 rounded-full"
                      >
                        {location}
                        <button
                          onClick={() => handleRemoveLocation(location)}
                          className="ml-1 text-primary hover:text-[var(--primary-dark)]"
                        >
                          <TbX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom Fields Section */}
        <div className="border border-gray-200 rounded-lg p-3">
          {renderSectionHeader(
            "Custom Fields",
            "custom",
            <TbAdjustments size={18} className="text-primary" />
          )}
          {expandedSections.custom && (
            <div className="mt-2 space-y-2">
              <div className="text-sm text-gray-600">
                Custom field filtering coming soon...
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={onClearAllFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Clear All
        </button>
        <button
          onClick={onApplyFilters}
          className="px-4 py-2 text-sm btn-primary text-white rounded-md hover:btn-primary-hover"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
