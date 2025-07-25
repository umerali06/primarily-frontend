import React, { useState } from "react";
import EmptyStateHandler from "./EmptyStateHandler";
import SearchSuggestions from "./SearchSuggestions";
import SearchAnalytics from "./SearchAnalytics";

/**
 * Demo component to showcase the empty state improvements
 */
const EmptyStateDemo = () => {
  const [activeDemo, setActiveDemo] = useState("noResults");

  // Sample data for demo
  const sampleData = {
    recentSearches: ["laptop", "office chair", "printer paper", "monitor"],
    popularCategories: [
      { name: "Electronics", count: 42 },
      { name: "Office Supplies", count: 28 },
      { name: "Furniture", count: 15 },
      { name: "Tools", count: 9 },
    ],
    popularTags: [
      { name: "urgent", count: 18 },
      { name: "reorder", count: 12 },
      { name: "new", count: 10 },
      { name: "fragile", count: 8 },
      { name: "valuable", count: 7 },
    ],
    lowStockItems: [
      { name: "Printer Paper", quantity: 2 },
      { name: "Ink Cartridges", quantity: 1 },
      { name: "Sticky Notes", quantity: 3 },
    ],
    searchHistory: Array(30)
      .fill()
      .map((_, i) => ({
        query: ["laptop", "monitor", "desk", "chair", "paper"][
          Math.floor(Math.random() * 5)
        ],
        resultCount: Math.floor(Math.random() * 20),
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      })),
    topSearches: [
      { term: "laptop", count: 42, trend: 15 },
      { term: "monitor", count: 28, trend: 5 },
      { term: "desk", count: 23, trend: -12 },
      { term: "chair", count: 19, trend: 0 },
      { term: "paper", count: 15, trend: -5 },
    ],
    searchTrends: Array(7)
      .fill()
      .map((_, i) => ({
        label: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        count: Math.floor(Math.random() * 50) + 10,
      })),
  };

  // Demo options
  const demoOptions = [
    { id: "noResults", label: "No Results" },
    { id: "noSearch", label: "No Search" },
    { id: "noItems", label: "No Items" },
    { id: "filtered", label: "Filtered (No Results)" },
    { id: "error", label: "Error State" },
    { id: "suggestions", label: "Search Suggestions" },
    { id: "analytics", label: "Search Analytics" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Empty State Improvements Demo</h1>

      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Select Demo:
        </div>
        <div className="flex flex-wrap gap-2">
          {demoOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveDemo(option.id)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                activeDemo === option.id
                  ? "bg-primary-light text-[var(--primary-dark)]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {activeDemo === "noResults" && (
          <>
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              No Results Empty State
            </h2>
            <EmptyStateHandler
              type="noResults"
              query="nonexistent item"
              onClear={() => alert("Clear search clicked")}
              onAdvancedSearch={() => alert("Advanced search clicked")}
            />
          </>
        )}

        {activeDemo === "noSearch" && (
          <>
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              No Search Empty State
            </h2>
            <EmptyStateHandler
              type="noSearch"
              onAdvancedSearch={() => alert("Advanced search clicked")}
            />
          </>
        )}

        {activeDemo === "noItems" && (
          <>
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              No Items Empty State
            </h2>
            <EmptyStateHandler
              type="noItems"
              onAddItem={() => alert("Add item clicked")}
              onImport={() => alert("Import clicked")}
            />
          </>
        )}

        {activeDemo === "filtered" && (
          <>
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Filtered (No Results) Empty State
            </h2>
            <EmptyStateHandler
              type="filtered"
              filterCount={3}
              onClear={() => alert("Clear filters clicked")}
            />
          </>
        )}

        {activeDemo === "error" && (
          <>
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Error Empty State
            </h2>
            <EmptyStateHandler
              type="error"
              error="An error occurred while searching. The search service is currently unavailable."
              onClear={() => alert("Clear search clicked")}
            />
          </>
        )}

        {activeDemo === "suggestions" && (
          <>
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Search Suggestions
            </h2>
            <SearchSuggestions
              onSuggestionClick={(query) => alert(`Search for: ${query}`)}
              recentSearches={sampleData.recentSearches}
              popularCategories={sampleData.popularCategories.map(
                (c) => c.name
              )}
              popularTags={sampleData.popularTags.map((t) => t.name)}
              lowStockItems={sampleData.lowStockItems}
            />
          </>
        )}

        {activeDemo === "analytics" && (
          <>
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Search Analytics
            </h2>
            <SearchAnalytics
              searchHistory={sampleData.searchHistory}
              topSearches={sampleData.topSearches}
              topCategories={sampleData.popularCategories}
              topTags={sampleData.popularTags}
              searchTrends={sampleData.searchTrends}
            />
          </>
        )}
      </div>

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-2">
          About This Demo
        </h2>
        <p className="text-sm text-gray-600">
          This demo showcases the improved empty state handling in the
          Primarily-like Items Dashboard. Each empty state provides
          context-specific information and actions to help users move forward.
          The search suggestions and analytics components provide additional
          guidance and insights.
        </p>
      </div>
    </div>
  );
};

export default EmptyStateDemo;
