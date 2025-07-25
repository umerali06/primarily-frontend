import React from "react";
import {
  TbSearch,
  TbMoodSad,
  TbArrowRight,
  TbFilter,
  TbRefresh,
  TbBulb,
  TbTag,
  TbCategory,
  TbBox,
  TbUser,
  TbInfoCircle,
} from "react-icons/tb";

/**
 * Component for displaying enhanced empty states in search results
 */
const SearchEmptyStates = ({
  query = "",
  didYouMean = [],
  relatedSearches = [],
  popularCategories = [],
  popularTags = [],
  recentSearches = [],
  onSearch,
  onClearSearch,
  onFilterChange,
}) => {
  // Different empty state types
  const EmptyStateTypes = {
    NO_QUERY: "no_query",
    NO_RESULTS: "no_results",
    FILTER_NO_RESULTS: "filter_no_results",
    ERROR: "error",
  };

  // Determine the type of empty state to show
  const getEmptyStateType = () => {
    if (!query) {
      return EmptyStateTypes.NO_QUERY;
    }

    // If we have suggestions, it's a no results state
    return EmptyStateTypes.NO_RESULTS;
  };

  // No query state - initial search state
  const renderNoQueryState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-gray-300 mb-6">
        <TbSearch size={64} className="mx-auto" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-3">
        Search Your Inventory
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Enter a search term to find items by name, description, tags, category,
        or other attributes.
      </p>

      {recentSearches.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Recent Searches
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {recentSearches.slice(0, 5).map((search, index) => (
              <button
                key={index}
                onClick={() => onSearch(search)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {popularCategories.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Popular Categories
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {popularCategories.map((category, index) => (
              <button
                key={index}
                onClick={() =>
                  onFilterChange && onFilterChange("category", category)
                }
                className="flex items-center px-3 py-1.5 bg-[#e6f3f1] hover:bg-[#e6f3f1] rounded-full text-sm text-[#0a7662] transition-colors"
              >
                <TbCategory size={14} className="mr-1" />
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {popularTags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Popular Tags
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {popularTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => onFilterChange && onFilterChange("tag", tag)}
                className="flex items-center px-3 py-1.5 bg-purple-50 hover:bg-purple-100 rounded-full text-sm text-purple-700 transition-colors"
              >
                <TbTag size={14} className="mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // No results state - when search returns no results
  const renderNoResultsState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-gray-300 mb-6">
        <TbMoodSad size={64} className="mx-auto" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">
        No Results Found
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We couldn't find any items matching "{query}". Try adjusting your search
        terms or explore the suggestions below.
      </p>

      <div className="flex justify-center mb-8">
        <button
          onClick={onClearSearch}
          className="px-4 py-2 btn-primary text-white rounded-md hover:btn-primary-hover transition-colors flex items-center"
        >
          <TbRefresh size={16} className="mr-2" />
          Clear Search
        </button>
      </div>

      {didYouMean.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Did You Mean
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {didYouMean.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSearch(suggestion)}
                className="px-3 py-1.5 bg-[#e6f3f1] hover:bg-[#e6f3f1] rounded-full text-sm text-[#0a7662] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {relatedSearches.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Related Searches
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {relatedSearches.map((related, index) => (
              <button
                key={index}
                onClick={() => onSearch(related)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {related}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#e6f3f1] border border-[#e6f3f1] rounded-lg p-4 max-w-lg mx-auto">
        <h4 className="flex items-center text-sm font-medium text-[#0a7662] mb-2">
          <TbBulb size={16} className="mr-2" />
          Search Tips
        </h4>
        <ul className="text-sm text-[#0a7662] text-left space-y-2">
          <li className="flex items-start">
            <TbArrowRight size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span>Try using more general terms or check for typos</span>
          </li>
          <li className="flex items-start">
            <TbArrowRight size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span>
              Search specific fields with syntax like{" "}
              <code className="bg-[#e6f3f1] px-1 rounded">name:keyword</code> or{" "}
              <code className="bg-[#e6f3f1] px-1 rounded">
                category:Electronics
              </code>
            </span>
          </li>
          <li className="flex items-start">
            <TbArrowRight size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span>Use the advanced search builder for complex queries</span>
          </li>
        </ul>
      </div>
    </div>
  );

  // Filter no results state - when filters return no results
  const renderFilterNoResultsState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-gray-300 mb-6">
        <TbFilter size={64} className="mx-auto" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">
        No Matching Items
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Your current filters don't match any items. Try adjusting or removing
        some filters.
      </p>

      <div className="flex justify-center mb-8">
        <button
          onClick={onClearSearch}
          className="px-4 py-2 btn-primary text-white rounded-md hover:btn-primary-hover transition-colors flex items-center"
        >
          <TbRefresh size={16} className="mr-2" />
          Clear All Filters
        </button>
      </div>
    </div>
  );

  // Error state - when search encounters an error
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-red-400 mb-6">
        <TbInfoCircle size={64} className="mx-auto" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">Search Error</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We encountered an error while searching. Please try again or contact
        support if the problem persists.
      </p>

      <div className="flex justify-center">
        <button
          onClick={onClearSearch}
          className="px-4 py-2 btn-primary text-white rounded-md hover:btn-primary-hover transition-colors flex items-center"
        >
          <TbRefresh size={16} className="mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );

  // Render the appropriate empty state
  const renderEmptyState = () => {
    const emptyStateType = getEmptyStateType();

    switch (emptyStateType) {
      case EmptyStateTypes.NO_QUERY:
        return renderNoQueryState();
      case EmptyStateTypes.NO_RESULTS:
        return renderNoResultsState();
      case EmptyStateTypes.FILTER_NO_RESULTS:
        return renderFilterNoResultsState();
      case EmptyStateTypes.ERROR:
        return renderErrorState();
      default:
        return renderNoQueryState();
    }
  };

  return <div className="py-4">{renderEmptyState()}</div>;
};

export default SearchEmptyStates;
