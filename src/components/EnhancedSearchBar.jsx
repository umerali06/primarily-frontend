import React, { useState, useEffect, useRef } from "react";
import {
  TbSearch,
  TbX,
  TbHistory,
  TbArrowRight,
  TbSettings,
  TbChevronDown,
  TbChevronUp,
  TbTag,
  TbFolder,
  TbBox,
  TbUser,
  TbFilter,
  TbInfoCircle,
  TbWand,
} from "react-icons/tb";
import AdvancedSearchBuilder from "./AdvancedSearchBuilder";
import SearchSyntaxHelp from "./SearchSyntaxHelp";

/**
 * Enhanced search bar component with suggestions, history, and advanced options
 */
const EnhancedSearchBar = ({
  onSearch,
  onClear,
  placeholder = "Search items...",
  initialValue = "",
  suggestions = [],
  recentSearches = [],
  isLoading = false,
  searchFields = ["name", "description", "tags", "category", "location"],
  className = "",
  autoFocus = false,
  maxRecentSearches = 5,
  onSaveSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedFields, setSelectedFields] = useState(searchFields);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAdvancedBuilder, setShowAdvancedBuilder] = useState(false);
  const [showSyntaxHelp, setShowSyntaxHelp] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-focus the search input if autoFocus is true
  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery, selectedFields);
    }
  };

  // Handle key press events
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      setShowDropdown(false);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    } else {
      setShowDropdown(true);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      setShowDropdown(true);
    } else {
      onClear && onClear();
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    onClear && onClear();
    searchInputRef.current?.focus();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    onSearch(suggestion, selectedFields);
    setShowDropdown(false);
  };

  // Handle recent search click
  const handleRecentSearchClick = (recentSearch) => {
    setSearchQuery(recentSearch);
    onSearch(recentSearch, selectedFields);
    setShowDropdown(false);
  };

  // Toggle search field selection
  const toggleSearchField = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  // Get icon for search field
  const getFieldIcon = (field) => {
    switch (field) {
      case "name":
        return <TbBox size={16} />;
      case "description":
        return <TbArrowRight size={16} />;
      case "tags":
        return <TbTag size={16} />;
      case "category":
        return <TbFolder size={16} />;
      case "location":
        return <TbUser size={16} />;
      default:
        return <TbSearch size={16} />;
    }
  };

  // Get label for search field
  const getFieldLabel = (field) => {
    return field.charAt(0).toUpperCase() + field.slice(1);
  };

  // Save current search
  const handleSaveSearch = () => {
    if (searchQuery.trim() && onSaveSearch) {
      onSaveSearch(searchQuery, selectedFields);
      setShowDropdown(false);
    }
  };

  // Handle advanced search
  const handleAdvancedSearch = (advancedQuery) => {
    setSearchQuery(advancedQuery);
    onSearch(advancedQuery, selectedFields);
    setShowAdvancedBuilder(false);
  };

  // Check if query looks like an advanced query
  const isAdvancedQuery = (query) => {
    return (
      query.includes(":") || query.includes(" AND ") || query.includes(" OR ")
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center bg-white border rounded-lg overflow-hidden transition-all ${
          isFocused
            ? "ring-2 ring-primary ring-opacity-50 border-transparent"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <div className="flex-1 flex items-center">
          <div className="pl-3 text-gray-400">
            <TbSearch size={20} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-3 py-2 focus:outline-none text-gray-700"
            aria-label="Search"
            data-testid="search-input"
          />
        </div>

        <div className="flex items-center">
          {isLoading && (
            <div className="px-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}

          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="p-2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <TbX size={18} />
            </button>
          )}

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 ${
              showAdvanced
                ? "text-primary"
                : "text-gray-400 hover:text-gray-600"
            }`}
            aria-label="Advanced search options"
            title="Advanced search options"
          >
            <TbSettings size={18} />
          </button>

          <button
            onClick={() => setShowAdvancedBuilder(true)}
            className="p-2 text-gray-400 hover:text-gray-600"
            aria-label="Advanced search builder"
            title="Advanced search builder"
          >
            <TbWand size={18} />
          </button>

          <button
            onClick={handleSearch}
            className="px-4 py-2 btn-primary text-white hover:btn-primary-hover transition-colors"
            aria-label="Search"
          >
            Search
          </button>
        </div>
      </div>

      {/* Advanced search options */}
      {showAdvanced && (
        <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-md animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-gray-700">Search in:</div>
            <button
              onClick={() => setShowSyntaxHelp(true)}
              className="text-primary hover:text-[var(--primary-dark)] text-sm flex items-center"
              aria-label="Show search syntax help"
            >
              <TbInfoCircle size={16} className="mr-1" />
              Search Syntax Help
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchFields.map((field) => (
              <button
                key={field}
                onClick={() => toggleSearchField(field)}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                  selectedFields.includes(field)
                    ? "bg-primary-light text-[var(--primary-dark)]"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {getFieldIcon(field)}
                <span className="ml-1">{getFieldLabel(field)}</span>
              </button>
            ))}
          </div>

          {isAdvancedQuery(searchQuery) && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-1">
                Advanced query detected
              </div>
              <div className="text-sm text-gray-700 bg-primary-light p-2 rounded">
                Using advanced search syntax. Click the{" "}
                <TbWand size={14} className="inline" /> icon to build complex
                queries or <TbInfoCircle size={14} className="inline" /> for
                syntax help.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dropdown for suggestions and recent searches */}
      {showDropdown && (searchQuery || recentSearches.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-slide-down"
        >
          {/* Suggestions */}
          {searchQuery && suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 px-2 pb-1">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center text-sm"
                >
                  <TbSearch size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-700">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="text-xs font-medium text-gray-500 px-2 pb-1">
                Recent Searches
              </div>
              {recentSearches
                .slice(0, maxRecentSearches)
                .map((recentSearch, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(recentSearch)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center text-sm"
                  >
                    <TbHistory size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-700">{recentSearch}</span>
                  </button>
                ))}
            </div>
          )}

          {/* Advanced search options */}
          <div className="p-2 border-t border-gray-100">
            <button
              onClick={() => {
                setShowAdvancedBuilder(true);
                setShowDropdown(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-primary-light text-primary rounded-md flex items-center text-sm"
            >
              <TbWand size={16} className="mr-2" />
              <span>Advanced Search Builder</span>
            </button>
          </div>

          {/* Save search option */}
          {searchQuery && onSaveSearch && (
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={handleSaveSearch}
                className="w-full text-left px-3 py-2 hover:bg-primary-light text-primary rounded-md flex items-center text-sm"
              >
                <TbArrowRight size={16} className="mr-2" />
                <span>Save this search</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Advanced Search Builder Modal */}
      {showAdvancedBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <AdvancedSearchBuilder
            onSearch={handleAdvancedSearch}
            onClose={() => setShowAdvancedBuilder(false)}
            initialQuery={searchQuery}
            className="w-full max-w-4xl"
          />
        </div>
      )}

      {/* Search Syntax Help Modal */}
      {showSyntaxHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <SearchSyntaxHelp onClose={() => setShowSyntaxHelp(false)} />
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
