import React from "react";
import {
  TbSearch,
  TbArrowRight,
  TbTag,
  TbFolder,
  TbBox,
  TbUser,
  TbCurrencyDollar,
  TbCalendar,
  TbBarcode,
  TbInfoCircle,
} from "react-icons/tb";

/**
 * Component for displaying helpful search suggestions
 */
const SearchSuggestions = ({
  onSuggestionClick,
  recentSearches = [],
  popularCategories = [],
  popularTags = [],
  lowStockItems = [],
  className = "",
}) => {
  // Example search queries to suggest
  const exampleQueries = [
    {
      query: "category:=Electronics",
      label: "All Electronics",
      icon: <TbFolder />,
    },
    {
      query: "price:>100",
      label: "Items over $100",
      icon: <TbCurrencyDollar />,
    },
    { query: "quantity:<5", label: "Low stock items", icon: <TbBox /> },
    {
      query: "tags:(urgent OR important)",
      label: "Urgent or Important",
      icon: <TbTag />,
    },
    {
      query: "updatedAt:>2023-01-01",
      label: "Updated this year",
      icon: <TbCalendar />,
    },
  ];

  return (
    <div className={`py-6 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Search Suggestions
        </h2>

        {/* Recent Searches */}
        {recentSearches && recentSearches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <TbSearch size={16} className="mr-2" />
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(search)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors flex items-center"
                >
                  <span>{search}</span>
                  <TbArrowRight size={14} className="ml-1 text-gray-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Example Queries */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <TbInfoCircle size={16} className="mr-2" />
            Try These Searches
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(example.query)}
                className="flex items-center px-3 py-2 bg-[#e6f3f1] hover:bg-[#e6f3f1] rounded-md text-sm text-[#0a7662] transition-colors justify-between group"
              >
                <span className="flex items-center">
                  <span className="mr-2">{example.icon}</span>
                  <span>{example.label}</span>
                </span>
                <TbArrowRight
                  size={16}
                  className="text-[#0a7662] opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        {popularCategories && popularCategories.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <TbFolder size={16} className="mr-2" />
              Popular Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(`category:=${category}`)}
                  className="px-3 py-1.5 bg-[#e6f3f1] hover:bg-[#e6f3f1] rounded-full text-sm text-[#0a7662] transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Tags */}
        {popularTags && popularTags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <TbTag size={16} className="mr-2" />
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(`tags:${tag}`)}
                  className="px-3 py-1.5 bg-[#e6f3f1] hover:bg-[#e6f3f1] rounded-full text-sm text-[#0a7662] transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Low Stock Items */}
        {lowStockItems && lowStockItems.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <TbBox size={16} className="mr-2" />
              Low Stock Items
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {lowStockItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(`name:"${item.name}"`)}
                  className="flex items-center justify-between px-3 py-2 bg-green-50 hover:bg-green-100 rounded-md text-sm text-green-700 transition-colors"
                >
                  <span className="flex items-center">
                    <TbBox size={16} className="mr-2" />
                    <span>{item.name}</span>
                  </span>
                  <span className="font-medium">{item.quantity} left</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Tips */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Search Tips
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-start">
              <TbArrowRight
                size={16}
                className="mr-2 mt-0.5 flex-shrink-0 text-gray-500"
              />
              <span>
                Use{" "}
                <code className="bg-gray-100 px-1 rounded">field:value</code>{" "}
                syntax for specific searches (e.g.,{" "}
                <code className="bg-gray-100 px-1 rounded">
                  category:Electronics
                </code>
                )
              </span>
            </li>
            <li className="flex items-start">
              <TbArrowRight
                size={16}
                className="mr-2 mt-0.5 flex-shrink-0 text-gray-500"
              />
              <span>
                Combine searches with{" "}
                <code className="bg-gray-100 px-1 rounded">AND</code> or{" "}
                <code className="bg-gray-100 px-1 rounded">OR</code> (e.g.,{" "}
                <code className="bg-gray-100 px-1 rounded">
                  laptop AND price:&lt;1000
                </code>
                )
              </span>
            </li>
            <li className="flex items-start">
              <TbArrowRight
                size={16}
                className="mr-2 mt-0.5 flex-shrink-0 text-gray-500"
              />
              <span>
                Use quotes for exact phrases:{" "}
                <code className="bg-gray-100 px-1 rounded">
                  name:&quot;iPhone 13&quot;
                </code>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;
