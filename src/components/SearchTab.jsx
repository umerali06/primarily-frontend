import React, { useState, useEffect } from "react";
import {
  TbSearch,
  TbFilter,
  TbX,
  TbFolder,
  TbTag,
  TbBarcode,
  TbAdjustments,
  TbBookmark,
  TbTrash,
  TbLayoutGrid,
  TbLayoutList,
  TbCategory,
  TbMap2,
  TbSortAscending,
  TbSortDescending,
  TbArrowsSort,
  TbMenu,
} from "react-icons/tb";
import useInventory from "../hooks/useInventory";
import toast from "react-hot-toast";
import EnhancedSearchResults from "./EnhancedSearchResults";
import SearchSuggestions from "./SearchSuggestions";
import {
  generateSearchSuggestions,
  sortSearchResults,
} from "../utils/searchUtils.jsx";

const filterCategories = [
  {
    title: "Folders",
    desc: "Get a list of items in specific folders",
  },
  {
    title: "Quantity",
    desc: "Filter items based on their stock levels",
  },
  {
    title: "Min Level",
    desc: "Identify items below or above their min levels",
  },
  {
    title: "Barcode / QR code",
    desc: "Find all items matching specific barcodes or qr codes",
  },
  {
    title: "Custom filters",
    desc: "Add filters matching any custom fields in your system",
  },
  {
    title: "Summaries",
    desc: "Group items with the same Primarily ID",
  },
];

const SearchTab = ({ GREEN }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    folders: [],
    tags: [],
    minQuantity: "",
    maxQuantity: "",
    minPrice: "",
    maxPrice: "",
    lowStock: false,
    hasImages: false,
    barcode: "",
    sku: "",
    location: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState("");
  const [viewMode, setViewMode] = useState("list"); // list, grid
  const [groupBy, setGroupBy] = useState(null); // null, category, location, tags
  const [sortBy, setSortBy] = useState("relevance"); // relevance, name, date, price
  const [sortDirection, setSortDirection] = useState("desc"); // asc, desc

  const {
    folders = [],
    tags = [],
    searchItems,
    fetchFolders,
    fetchTags,
    items = [],
  } = useInventory();

  useEffect(() => {
    fetchFolders();
    fetchTags();
    loadSavedSearches();
  }, []);

  const loadSavedSearches = () => {
    const saved = localStorage.getItem("savedSearches");
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  };

  const handleSearch = async () => {
    if (
      !searchQuery.trim() &&
      Object.values(filters).every(
        (v) => !v || (Array.isArray(v) && v.length === 0)
      )
    ) {
      toast.error("Please enter a search query or apply filters");
      return;
    }

    setIsSearching(true);
    try {
      const searchParams = {
        q: searchQuery,
        ...filters,
        folders: filters.folders.length > 0 ? filters.folders : undefined,
        tags: filters.tags.length > 0 ? filters.tags : undefined,
      };

      const response = await searchItems(searchQuery, searchParams);
      const items = response?.items || [];

      // Sort results by relevance initially
      setSearchResults(items);
      setSortBy("relevance");

      if (items.length === 0) {
        toast("No items found matching your search criteria", {
          icon: "ℹ️",
        });
      } else {
        toast.success(`Found ${items.length} items matching your search`);
      }
    } catch (error) {
      toast.error("Search failed");
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      folders: [],
      tags: [],
      minQuantity: "",
      maxQuantity: "",
      minPrice: "",
      maxPrice: "",
      lowStock: false,
      hasImages: false,
      barcode: "",
      sku: "",
      location: "",
    });
    setSearchQuery("");
    setSearchResults([]);
  };

  const saveSearch = () => {
    if (!saveSearchName.trim()) {
      toast.error("Please enter a name for the saved search");
      return;
    }

    const searchData = {
      id: Date.now(),
      name: saveSearchName,
      query: searchQuery,
      filters: filters,
      createdAt: new Date().toISOString(),
    };

    const updatedSavedSearches = [...savedSearches, searchData];
    setSavedSearches(updatedSavedSearches);
    localStorage.setItem("savedSearches", JSON.stringify(updatedSavedSearches));

    setShowSaveDialog(false);
    setSaveSearchName("");
    toast.success("Search saved successfully!");
  };

  const loadSavedSearch = (savedSearch) => {
    setSearchQuery(savedSearch.query);
    setFilters(savedSearch.filters);
    handleSearch();
  };

  const deleteSavedSearch = (searchId) => {
    const updatedSavedSearches = savedSearches.filter((s) => s.id !== searchId);
    setSavedSearches(updatedSavedSearches);
    localStorage.setItem("savedSearches", JSON.stringify(updatedSavedSearches));
    toast.success("Saved search deleted");
  };

  return (
    <div className="flex h-full min-h-[600px] relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Filters */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col p-4 lg:p-6 gap-6 overflow-y-auto transition-transform duration-300 ease-in-out h-full lg:h-auto`}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <TbX size={20} />
        </button>
        <div>
          <div className="font-bold text-xl mb-4 flex items-center gap-2">
            <TbFilter size={24} />
            Filters
          </div>

          {/* Search Query */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Query
            </label>
            <div className="relative">
              <TbSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                placeholder="Search items..."
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>

          {/* Folders filter */}
          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <TbFolder size={16} />
              Folders
            </div>
            <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {Array.isArray(folders) &&
                folders.map((folder) => (
                  <label
                    key={folder._id}
                    className="flex items-center gap-2 mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.folders.includes(folder._id)}
                      onChange={(e) => {
                        const newFolders = e.target.checked
                          ? [...filters.folders, folder._id]
                          : filters.folders.filter((id) => id !== folder._id);
                        handleFilterChange("folders", newFolders);
                      }}
                      className="text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                    />
                    <span className="text-sm truncate">{folder.name}</span>
                  </label>
                ))}
              {(!Array.isArray(folders) || folders.length === 0) && (
                <div className="text-sm text-gray-500 p-2">
                  No folders available
                </div>
              )}
            </div>
          </div>

          {/* Tags filter */}
          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <TbTag size={16} />
              Tags
            </div>
            <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {Array.isArray(tags) &&
                tags.map((tag) => (
                  <label
                    key={tag._id}
                    className="flex items-center gap-2 mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag.name)}
                      onChange={(e) => {
                        const newTags = e.target.checked
                          ? [...filters.tags, tag.name]
                          : filters.tags.filter((name) => name !== tag.name);
                        handleFilterChange("tags", newTags);
                      }}
                      className="text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                    />
                    <span className="text-sm truncate">{tag.name}</span>
                  </label>
                ))}
              {(!Array.isArray(tags) || tags.length === 0) && (
                <div className="text-sm text-gray-500 p-2">
                  No tags available
                </div>
              )}
            </div>
          </div>

          {/* Quantity Range */}
          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">
              Quantity Range
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minQuantity}
                onChange={(e) =>
                  handleFilterChange("minQuantity", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxQuantity}
                onChange={(e) =>
                  handleFilterChange("maxQuantity", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">
              Price Range (PKR)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Additional Filters */}
          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">
              Additional Filters
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.lowStock}
                  onChange={(e) =>
                    handleFilterChange("lowStock", e.target.checked)
                  }
                  className="text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                />
                <span className="text-sm">Low Stock Items</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasImages}
                  onChange={(e) =>
                    handleFilterChange("hasImages", e.target.checked)
                  }
                  className="text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                />
                <span className="text-sm">Items with Images</span>
              </label>
            </div>
          </div>

          {/* Barcode/SKU Search */}
          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <TbBarcode size={16} />
              Barcode/SKU
            </div>
            <input
              type="text"
              placeholder="Enter barcode or SKU"
              value={filters.barcode}
              onChange={(e) => handleFilterChange("barcode", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            />
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <div className="font-semibold text-gray-700 mb-2">Location</div>
            <input
              type="text"
              placeholder="Enter location"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => {
                handleSearch();
                setSidebarOpen(false); // Close sidebar on mobile after search
              }}
              disabled={isSearching}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-150 ${
                isSearching
                  ? "bg-gray-400 cursor-not-allowed"
                  : "btn-primary hover:btn-primary-hover"
              }`}
            >
              {isSearching ? "SEARCHING..." : "SEARCH"}
            </button>

            <button
              onClick={clearFilters}
              className="w-full py-2 rounded-lg font-medium text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              CLEAR FILTERS
            </button>

            <button
              onClick={() => setShowSaveDialog(true)}
              className="w-full py-2 rounded-lg font-medium text-primary border border-primary hover:bg-primary-light"
            >
              SAVE SEARCH
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 lg:p-6 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden mb-4 p-2 text-gray-600 hover:text-gray-800 self-start"
        >
          <TbMenu size={24} />
        </button>
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-2xl lg:text-3xl font-bold mb-2"
            style={{ color: GREEN?.main || "#16A34A" }}
          >
            Advanced Search
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Find items across your inventory using powerful search and filtering
          </p>
        </div>

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TbBookmark size={20} />
              Saved Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map((savedSearch) => (
                <div
                  key={savedSearch.id}
                  className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2"
                >
                  <button
                    onClick={() => loadSavedSearch(savedSearch)}
                    className="text-sm font-medium text-gray-700 hover:text-primary"
                  >
                    {savedSearch.name}
                  </button>
                  <button
                    onClick={() => deleteSavedSearch(savedSearch.id)}
                    className="text-gray-400 hover:text-green-600"
                  >
                    <TbX size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Controls - responsive */}
        <div className="mb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-700">View:</div>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-primary-light text-primary"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  title="List view"
                >
                  <TbLayoutList size={18} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-primary-light text-primary"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  title="Grid view"
                >
                  <TbLayoutGrid size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-700">Group by:</div>
              <select
                value={groupBy || "none"}
                onChange={(e) =>
                  setGroupBy(e.target.value === "none" ? null : e.target.value)
                }
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value="none">None</option>
                <option value="category">Category</option>
                <option value="location">Location</option>
                <option value="tags">Tags</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-700">Sort by:</div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="name">Name</option>
              <option value="date">Date Updated</option>
              <option value="price">Price</option>
              <option value="quantity">Quantity</option>
            </select>
            <button
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
              className="p-1 border border-gray-300 rounded-md"
              title={sortDirection === "asc" ? "Ascending" : "Descending"}
            >
              {sortDirection === "asc" ? (
                <TbSortAscending size={18} />
              ) : (
                <TbSortDescending size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-hidden">
          <EnhancedSearchResults
            results={sortSearchResults(
              searchResults,
              sortBy,
              sortDirection,
              searchQuery
            )}
            query={searchQuery}
            isLoading={isSearching}
            error={null}
            totalResults={searchResults.length}
            onItemClick={(item) =>
              toast.success(`Viewing details for ${item.name}`)
            }
            onClearSearch={clearFilters}
            groupBy={groupBy}
            viewMode={viewMode}
            sortBy={sortBy}
            sortDirection={sortDirection}
          />

          {!searchQuery && !isSearching && searchResults.length === 0 && (
            <SearchSuggestions
              onSuggestionClick={(query) => {
                setSearchQuery(query);
                handleSearch();
              }}
              recentSearches={savedSearches
                .slice(0, 3)
                .map((search) => search.query)}
              popularCategories={[
                "Electronics",
                "Office Supplies",
                "Furniture",
                "Tools",
              ]}
              popularTags={["urgent", "reorder", "new", "fragile", "valuable"]}
              lowStockItems={[
                { name: "Printer Paper", quantity: 2 },
                { name: "Ink Cartridges", quantity: 1 },
                { name: "Sticky Notes", quantity: 3 },
              ]}
            />
          )}
        </div>
      </main>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Search</h3>
            <input
              type="text"
              value={saveSearchName}
              onChange={(e) => setSaveSearchName(e.target.value)}
              placeholder="Enter search name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveSearch}
                className="px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTab;
