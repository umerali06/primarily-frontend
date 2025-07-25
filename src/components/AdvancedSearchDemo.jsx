import React, { useState, useEffect } from "react";
import EnhancedSearchBar from "./EnhancedSearchBar";
import EnhancedSearchResults from "./EnhancedSearchResults";
import {
  sortSearchResults,
  generateSearchSuggestions,
} from "../utils/searchUtils.jsx";
import {
  parseAdvancedQuery,
  applyAdvancedSearch,
  getQueryDescription,
} from "../utils/advancedSearchUtils";

// Sample data for demonstration
const sampleItems = [
  {
    id: "1",
    name: "Laptop Dell XPS 13",
    description: "High-performance laptop with 16GB RAM and 512GB SSD",
    category: "Electronics",
    location: "Office",
    tags: ["laptop", "dell", "computer"],
    quantity: 5,
    price: 1299.99,
    images: ["https://via.placeholder.com/150?text=Dell+XPS"],
    updatedAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    name: "iPhone 13 Pro",
    description: "Apple iPhone with A15 Bionic chip and Pro camera system",
    category: "Electronics",
    location: "Store Room",
    tags: ["phone", "apple", "mobile"],
    quantity: 10,
    price: 999.99,
    images: ["https://via.placeholder.com/150?text=iPhone"],
    updatedAt: "2023-06-20T14:45:00Z",
  },
  {
    id: "3",
    name: "Office Desk Chair",
    description: "Ergonomic office chair with lumbar support",
    category: "Furniture",
    location: "Office",
    tags: ["chair", "ergonomic", "furniture"],
    quantity: 8,
    price: 249.99,
    images: ["https://via.placeholder.com/150?text=Chair"],
    updatedAt: "2023-04-10T09:15:00Z",
  },
  {
    id: "4",
    name: "Wireless Mouse",
    description: "Bluetooth wireless mouse for laptops and computers",
    category: "Electronics",
    location: "Office",
    tags: ["mouse", "bluetooth", "computer"],
    quantity: 15,
    price: 29.99,
    images: ["https://via.placeholder.com/150?text=Mouse"],
    updatedAt: "2023-07-05T16:20:00Z",
  },
  {
    id: "5",
    name: "Whiteboard Markers",
    description: "Set of 4 colored whiteboard markers",
    category: "Office Supplies",
    location: "Supply Closet",
    tags: ["markers", "office", "supplies"],
    quantity: 20,
    price: 8.99,
    updatedAt: "2023-03-25T11:10:00Z",
  },
  {
    id: "6",
    name: 'Dell Monitor 27"',
    description: "27-inch 4K UHD monitor with USB-C connectivity",
    category: "Electronics",
    location: "Office",
    tags: ["monitor", "dell", "computer"],
    quantity: 3,
    price: 349.99,
    images: ["https://via.placeholder.com/150?text=Dell+Monitor"],
    updatedAt: "2023-06-15T13:40:00Z",
  },
  {
    id: "7",
    name: "Conference Table",
    description: "Large conference table for meetings",
    category: "Furniture",
    location: "Conference Room",
    tags: ["table", "conference", "furniture"],
    quantity: 1,
    price: 899.99,
    images: ["https://via.placeholder.com/150?text=Table"],
    updatedAt: "2023-02-18T08:30:00Z",
  },
  {
    id: "8",
    name: "Apple MacBook Pro",
    description: "MacBook Pro with M1 chip and 16GB RAM",
    category: "Electronics",
    location: "Design Department",
    tags: ["laptop", "apple", "computer"],
    quantity: 4,
    price: 1799.99,
    images: ["https://via.placeholder.com/150?text=MacBook"],
    updatedAt: "2023-07-10T15:25:00Z",
  },
  {
    id: "9",
    name: "Standing Desk",
    description: "Adjustable height standing desk",
    category: "Furniture",
    location: "Office",
    tags: ["desk", "ergonomic", "furniture"],
    quantity: 6,
    price: 499.99,
    images: ["https://via.placeholder.com/150?text=Standing+Desk"],
    updatedAt: "2023-05-22T10:15:00Z",
  },
  {
    id: "10",
    name: "Wireless Keyboard",
    description: "Bluetooth wireless keyboard with numeric keypad",
    category: "Electronics",
    location: "Office",
    tags: ["keyboard", "bluetooth", "computer"],
    quantity: 12,
    price: 59.99,
    images: ["https://via.placeholder.com/150?text=Keyboard"],
    updatedAt: "2023-06-30T09:45:00Z",
  },
  {
    id: "11",
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness",
    category: "Office Supplies",
    location: "Office",
    tags: ["lamp", "lighting", "desk"],
    quantity: 8,
    price: 39.99,
    images: ["https://via.placeholder.com/150?text=Lamp"],
    updatedAt: "2023-04-05T14:20:00Z",
  },
  {
    id: "12",
    name: "Printer Paper",
    description: "A4 printer paper, 500 sheets",
    category: "Office Supplies",
    location: "Supply Closet",
    tags: ["paper", "printer", "supplies"],
    quantity: 50,
    price: 5.99,
    updatedAt: "2023-07-01T11:30:00Z",
  },
];

/**
 * Demo component to showcase the advanced search functionality
 */
const AdvancedSearchDemo = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "laptop",
    "price:>100",
    "category:=Furniture",
  ]);
  const [viewMode, setViewMode] = useState("list");
  const [groupBy, setGroupBy] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryDescription, setQueryDescription] = useState("");

  // Simulate search function
  const performSearch = (searchQuery, fields) => {
    setIsLoading(true);
    setQuery(searchQuery);

    // Simulate API delay
    setTimeout(() => {
      if (!searchQuery.trim()) {
        setResults([]);
        setQueryDescription("");
        setIsLoading(false);
        return;
      }

      let filteredResults = [];

      // Check if it's an advanced query
      if (
        searchQuery.includes(":") ||
        searchQuery.includes(" AND ") ||
        searchQuery.includes(" OR ")
      ) {
        // Parse and apply advanced query
        const parsedQuery = parseAdvancedQuery(searchQuery);
        filteredResults = applyAdvancedSearch(sampleItems, parsedQuery);
        setQueryDescription(getQueryDescription(parsedQuery));
      } else {
        // Simple search implementation
        filteredResults = sampleItems.filter((item) => {
          const lowerQuery = searchQuery.toLowerCase();

          // Check name
          if (
            fields.includes("name") &&
            item.name.toLowerCase().includes(lowerQuery)
          ) {
            return true;
          }

          // Check description
          if (
            fields.includes("description") &&
            item.description.toLowerCase().includes(lowerQuery)
          ) {
            return true;
          }

          // Check category
          if (
            fields.includes("category") &&
            item.category.toLowerCase().includes(lowerQuery)
          ) {
            return true;
          }

          // Check location
          if (
            fields.includes("location") &&
            item.location.toLowerCase().includes(lowerQuery)
          ) {
            return true;
          }

          // Check tags
          if (
            fields.includes("tags") &&
            item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
          ) {
            return true;
          }

          return false;
        });

        setQueryDescription(`Items containing "${searchQuery}"`);
      }

      // Update recent searches
      if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
        setRecentSearches((prev) => [searchQuery, ...prev].slice(0, 5));
      }

      setResults(filteredResults);
      setIsLoading(false);
    }, 800); // Simulate network delay
  };

  // Handle search
  const handleSearch = (searchQuery, fields) => {
    performSearch(searchQuery, fields);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setQueryDescription("");
  };

  // Handle save search
  const handleSaveSearch = (searchQuery, fields) => {
    alert(`Search saved: ${searchQuery} (Fields: ${fields.join(", ")})`);
  };

  // Generate suggestions based on query
  const getSuggestions = (query) => {
    return generateSearchSuggestions(query, sampleItems, 5);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Advanced Search Demo</h1>

      <div className="mb-6">
        <EnhancedSearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search items or use advanced syntax (field:value)"
          initialValue={query}
          suggestions={getSuggestions(query)}
          recentSearches={recentSearches}
          isLoading={isLoading}
          searchFields={["name", "description", "tags", "category", "location"]}
          autoFocus
          onSaveSearch={handleSaveSearch}
        />
      </div>

      {queryDescription && (
        <div className="mb-4 p-3 bg-[#e6f3f1] border border-[#e6f3f1] rounded-lg">
          <p className="text-sm text-[#0a7662]">
            <strong>Search:</strong> {queryDescription}
          </p>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">View:</span>
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 text-sm ${
                viewMode === "list"
                  ? "bg-[#e6f3f1] text-[#0a7662]"
                  : "bg-white text-gray-700"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-sm ${
                viewMode === "grid"
                  ? "bg-[#e6f3f1] text-[#0a7662]"
                  : "bg-white text-gray-700"
              }`}
            >
              Grid
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Group by:</span>
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

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="relevance">Relevance</option>
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="price">Price</option>
            <option value="quantity">Quantity</option>
          </select>
          <button
            onClick={() =>
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <EnhancedSearchResults
          results={sortSearchResults(results, sortBy, sortDirection, query)}
          query={query}
          isLoading={isLoading}
          error={null}
          totalResults={results.length}
          onItemClick={(item) => alert(`Clicked: ${item.name}`)}
          onClearSearch={handleClearSearch}
          groupBy={groupBy}
          viewMode={viewMode}
          sortBy={sortBy}
          sortDirection={sortDirection}
        />
      </div>

      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">
          Try These Example Queries:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <code className="text-sm font-mono text-[#0a7662]">
              category:=Electronics AND price:>100
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Electronics items over $100
            </p>
          </div>
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <code className="text-sm font-mono text-[#0a7662]">
              tags:(laptop OR computer) AND price:[500 TO 2000]
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Laptops or computers between $500-$2000
            </p>
          </div>
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <code className="text-sm font-mono text-[#0a7662]">
              location:=Office AND category:!=Electronics
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Office items that are not electronics
            </p>
          </div>
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <code className="text-sm font-mono text-[#0a7662]">
              name:^Dell OR name:^Apple
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Items with names starting with Dell or Apple
            </p>
          </div>
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <code className="text-sm font-mono text-[#0a7662]">
              quantity:&lt;5 AND category:=Electronics
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Low stock electronics items
            </p>
          </div>
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <code className="text-sm font-mono text-[#0a7662]">
              category:(Furniture OR "Office Supplies")
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Items in Furniture or Office Supplies categories
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchDemo;
