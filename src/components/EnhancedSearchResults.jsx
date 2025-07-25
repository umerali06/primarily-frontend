import React, { useState, useMemo } from "react";
import {
  TbSearch,
  TbX,
  TbTag,
  TbFolder,
  TbBox,
  TbUser,
  TbChevronDown,
  TbChevronUp,
  TbArrowRight,
  TbInfoCircle,
  TbCategory,
  TbCalendar,
  TbCurrencyDollar,
  TbBarcode,
} from "react-icons/tb";
import ItemCard from "./ItemCard";
import ItemBadge from "./ItemBadge";
import EmptyStateHandler from "./EmptyStateHandler";

/**
 * Enhanced search results component with highlighting, grouping, and improved relevance
 */
const EnhancedSearchResults = ({
  results = [],
  query = "",
  isLoading = false,
  error = null,
  totalResults = 0,
  onItemClick,
  onClearSearch,
  groupBy = null, // null, 'category', 'location', 'tags'
  viewMode = "list", // list, grid
  sortBy = "relevance", // relevance, name, date, price
  sortDirection = "desc", // asc, desc
  didYouMean = [],
  relatedSearches = [],
  popularCategories = [],
  popularTags = [],
  recentSearches = [],
  onSearch,
}) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600">Searching for "{query}"...</p>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <EmptyStateHandler type="error" error={error} onClear={onClearSearch} />
    );
  }

  // If no results, show empty state
  if (results.length === 0 && query) {
    return (
      <EmptyStateHandler
        type="noResults"
        query={query}
        onClear={onClearSearch}
        onAdvancedSearch={() =>
          window.dispatchEvent(
            new CustomEvent("openAdvancedSearch", { detail: { query } })
          )
        }
      />
    );
  }

  // If no query, show empty state
  if (!query) {
    return (
      <EmptyStateHandler
        type="noSearch"
        onAdvancedSearch={() =>
          window.dispatchEvent(
            new CustomEvent("openAdvancedSearch", { detail: { query: "" } })
          )
        }
      />
    );
  }

  // Calculate relevance score for each item
  const calculateRelevance = (item) => {
    let score = 0;
    const lowerQuery = query.toLowerCase();

    // Exact name match gets highest score
    if (item.name?.toLowerCase() === lowerQuery) {
      score += 100;
    }
    // Name contains query
    else if (item.name?.toLowerCase().includes(lowerQuery)) {
      score += 50;
    }

    // Description contains query
    if (item.description?.toLowerCase().includes(lowerQuery)) {
      score += 30;
    }

    // Tags contain query
    if (item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
      score += 40;
    }

    // Category contains query
    if (item.category?.toLowerCase().includes(lowerQuery)) {
      score += 35;
    }

    // Location contains query
    if (item.location?.toLowerCase().includes(lowerQuery)) {
      score += 25;
    }

    // Recently updated items get a boost
    if (item.updatedAt) {
      const daysSinceUpdate =
        (new Date() - new Date(item.updatedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate < 7) {
        score += 10;
      }
    }

    return score;
  };

  // Sort and process results
  const processedResults = useMemo(() => {
    let sortedResults = [...results];

    // Apply sorting
    if (sortBy === "relevance") {
      sortedResults.forEach((item) => {
        item.relevanceScore = calculateRelevance(item);
      });
      sortedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else if (sortBy === "name") {
      sortedResults.sort((a, b) => {
        const nameA = a.name?.toLowerCase() || "";
        const nameB = b.name?.toLowerCase() || "";
        return sortDirection === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    } else if (sortBy === "date") {
      sortedResults.sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
        const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });
    } else if (sortBy === "price") {
      sortedResults.sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return sortDirection === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    return sortedResults;
  }, [results, sortBy, sortDirection, query]);

  // Highlight search terms in text
  const highlightText = (text, query) => {
    if (!query || !text) return text;

    try {
      // Escape special regex characters in the query
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Split by the query pattern (case insensitive)
      const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));

      return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="bg-yellow-200 font-medium">
            {part}
          </span>
        ) : (
          part
        )
      );
    } catch (error) {
      // If there's an error with the regex, return the original text
      console.error("Error highlighting text:", error);
      return text;
    }
  };

  // Group results if groupBy is specified
  const groupedResults = () => {
    if (!groupBy) return { ungrouped: processedResults };

    return processedResults.reduce((groups, item) => {
      const groupValue = item[groupBy];

      // Handle arrays (like tags)
      if (Array.isArray(groupValue)) {
        groupValue.forEach((value) => {
          if (!groups[value]) groups[value] = [];
          groups[value].push(item);
        });
      } else {
        const key = groupValue || "Other";
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
      }

      return groups;
    }, {});
  };

  // Toggle group expansion
  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  // Get group icon
  const getGroupIcon = (group) => {
    switch (groupBy) {
      case "category":
        return <TbCategory size={18} className="text-primary" />;
      case "location":
        return <TbUser size={18} className="text-primary" />;
      case "tags":
        return <TbTag size={18} className="text-purple-600" />;
      default:
        return <TbBox size={18} className="text-gray-600" />;
    }
  };

  // Get field icon
  const getFieldIcon = (field) => {
    switch (field) {
      case "category":
        return <TbCategory size={14} className="mr-1" />;
      case "location":
        return <TbUser size={14} className="mr-1" />;
      case "quantity":
        return <TbBox size={14} className="mr-1" />;
      case "price":
        return <TbCurrencyDollar size={14} className="mr-1" />;
      case "barcode":
        return <TbBarcode size={14} className="mr-1" />;
      case "updatedAt":
        return <TbCalendar size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  // Render results based on view mode and grouping
  const renderResults = () => {
    const groups = groupedResults();

    return Object.entries(groups).map(([groupName, items]) => {
      // Skip rendering empty groups
      if (items.length === 0) return null;

      // For ungrouped results or if groupBy is null
      if (groupName === "ungrouped") {
        return (
          <div key="ungrouped" className="space-y-4">
            <div className="text-sm text-gray-500">
              Showing {results.length}{" "}
              {results.length === 1 ? "result" : "results"}
              {totalResults > results.length && ` of ${totalResults}`}
            </div>
            {renderItemsList(items)}
          </div>
        );
      }

      // For grouped results
      const isExpanded = expandedGroups[groupName] !== false; // Default to expanded

      return (
        <div key={groupName} className="mb-6">
          <div
            className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg cursor-pointer"
            onClick={() => toggleGroup(groupName)}
          >
            <div className="flex items-center">
              {getGroupIcon(groupName)}
              <h3 className="font-medium text-gray-800 ml-2">
                {highlightText(groupName, query)}{" "}
                <span className="text-gray-500 text-sm">({items.length})</span>
              </h3>
            </div>
            {isExpanded ? (
              <TbChevronUp size={18} className="text-gray-500" />
            ) : (
              <TbChevronDown size={18} className="text-gray-500" />
            )}
          </div>

          {isExpanded && (
            <div className="mt-3 pl-2">{renderItemsList(items)}</div>
          )}
        </div>
      );
    });
  };

  // Render items list based on view mode
  const renderItemsList = (items) => {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <ItemCard
              key={item.id || item._id}
              item={item}
              onViewDetails={() => onItemClick && onItemClick(item)}
              highlightText={(text) => highlightText(text, query)}
            />
          ))}
        </div>
      );
    }

    // Default to list view
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id || item._id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => onItemClick && onItemClick(item)}
          >
            <div className="flex items-start">
              {item.images && item.images.length > 0 && (
                <div className="flex-shrink-0 mr-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={(() => {
                        const image = item.images[0];
                        if (typeof image === "string") {
                          return image;
                        } else if (image?.url) {
                          return image.url;
                        } else if (image?.filename) {
                          // Construct URL from filename
                          const baseUrl =
                            import.meta.env.VITE_API_URL?.replace("/api", "") ||
                            "http://localhost:5001";
                          return `${baseUrl}/uploads/items/${image.filename}`;
                        }
                        return null;
                      })()}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML =
                          '<div class="h-full w-full bg-gray-200 flex items-center justify-center"><span class="text-gray-400 text-xs">No Image</span></div>';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {highlightText(item.name, query)}
                </h3>

                {item.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {highlightText(item.description, query)}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  {item.category && (
                    <div className="flex items-center text-xs text-gray-500">
                      {getFieldIcon("category")}
                      {highlightText(item.category, query)}
                    </div>
                  )}

                  {item.location && (
                    <div className="flex items-center text-xs text-gray-500">
                      {getFieldIcon("location")}
                      {highlightText(item.location, query)}
                    </div>
                  )}

                  {item.quantity !== undefined && (
                    <div className="flex items-center text-xs text-gray-500">
                      {getFieldIcon("quantity")}
                      {item.quantity} {item.unit || "pcs"}
                    </div>
                  )}

                  {item.price !== undefined && (
                    <div className="flex items-center text-xs text-gray-500">
                      {getFieldIcon("price")}${item.price.toFixed(2)}
                    </div>
                  )}

                  {item.updatedAt && (
                    <div className="flex items-center text-xs text-gray-500">
                      {getFieldIcon("updatedAt")}
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag, index) => (
                      <ItemBadge
                        key={index}
                        type="info"
                        label={highlightText(tag, query)}
                        size="xs"
                      />
                    ))}
                  </div>
                )}

                {/* Show relevance score for debugging */}
                {sortBy === "relevance" &&
                  item.relevanceScore !== undefined && (
                    <div className="text-xs text-gray-400 mt-1">
                      Relevance: {item.relevanceScore}
                    </div>
                  )}
              </div>

              <div className="flex-shrink-0 ml-2">
                <TbArrowRight size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return <div className="py-4">{renderResults()}</div>;
};

export default EnhancedSearchResults;
