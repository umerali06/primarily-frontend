import React from "react";
import {
  TbChartBar,
  TbSearch,
  TbTag,
  TbFolder,
  TbCalendar,
  TbArrowUp,
  TbArrowDown,
  TbEqual,
  TbInfoCircle,
} from "react-icons/tb";

/**
 * Component for displaying search analytics and insights
 */
const SearchAnalytics = ({
  searchHistory = [],
  topSearches = [],
  topCategories = [],
  topTags = [],
  searchTrends = [],
  className = "",
}) => {
  // Calculate search trend direction
  const getTrendDirection = (trend) => {
    if (trend > 10)
      return {
        icon: <TbArrowUp className="text-[#0a7662]" />,
        text: "trending up",
      };
    if (trend < -10)
      return {
        icon: <TbArrowDown className="text-green-500" />,
        text: "trending down",
      };
    return { icon: <TbEqual className="text-gray-500" />, text: "stable" };
  };

  return (
    <div className={`${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <TbChartBar size={20} className="mr-2 text-[#0a7662]" />
          Search Analytics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Searches */}
          <div className="bg-[#e6f3f1] rounded-lg p-4">
            <div className="text-sm text-[#0a7662] mb-1">Total Searches</div>
            <div className="text-2xl font-bold text-[#0a7662]">
              {searchHistory.length}
            </div>
            <div className="text-xs text-[#0a7662] mt-1">Last 30 days</div>
          </div>

          {/* Unique Search Terms */}
          <div className="bg-[#e6f3f1] rounded-lg p-4">
            <div className="text-sm text-[#0a7662] mb-1">
              Unique Search Terms
            </div>
            <div className="text-2xl font-bold text-[#0a7662]">
              {new Set(searchHistory.map((s) => s.query)).size}
            </div>
            <div className="text-xs text-[#0a7662] mt-1">Last 30 days</div>
          </div>

          {/* Average Results */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-700 mb-1">Avg. Results</div>
            <div className="text-2xl font-bold text-purple-900">
              {searchHistory.length > 0
                ? Math.round(
                    searchHistory.reduce(
                      (sum, s) => sum + (s.resultCount || 0),
                      0
                    ) / searchHistory.length
                  )
                : 0}
            </div>
            <div className="text-xs text-purple-600 mt-1">Per search</div>
          </div>

          {/* Zero Results Rate */}
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="text-sm text-amber-700 mb-1">Zero Results Rate</div>
            <div className="text-2xl font-bold text-amber-900">
              {searchHistory.length > 0
                ? Math.round(
                    (searchHistory.filter((s) => s.resultCount === 0).length /
                      searchHistory.length) *
                      100
                  )
                : 0}
              %
            </div>
            <div className="text-xs text-amber-600 mt-1">
              Searches with no results
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Searches */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <TbSearch size={16} className="mr-2" />
              Top Searches
            </h3>
            <div className="space-y-2">
              {topSearches.map((search, index) => {
                const trend = getTrendDirection(search.trend);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                  >
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-3 w-4 text-center">
                        {index + 1}
                      </span>
                      <span className="text-gray-800">{search.term}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 text-sm mr-2">
                        {search.count}
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        {trend.icon}
                        <span className="ml-1">{trend.text}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Categories & Tags */}
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <TbFolder size={16} className="mr-2" />
                Top Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {topCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-[#e6f3f1] px-3 py-1.5 rounded-full text-sm"
                  >
                    <span className="text-[#0a7662]">{category.name}</span>
                    <span className="ml-2 px-1.5 py-0.5 bg-[#e6f3f1] text-[#0a7662] rounded-full text-xs">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <TbTag size={16} className="mr-2" />
                Top Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {topTags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-[#e6f3f1] px-3 py-1.5 rounded-full text-sm"
                  >
                    <span className="text-[#0a7662]">#{tag.name}</span>
                    <span className="ml-2 px-1.5 py-0.5 bg-[#e6f3f1] text-[#0a7662] rounded-full text-xs">
                      {tag.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Trends */}
        {searchTrends.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <TbCalendar size={16} className="mr-2" />
              Search Trends
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="h-40 flex items-end justify-between">
                {searchTrends.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-[#e6f3f1]0 rounded-t"
                      style={{
                        height: `${
                          (day.count /
                            Math.max(...searchTrends.map((d) => d.count))) *
                          100
                        }%`,
                      }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">
                      {day.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Insights */}
        <div className="mt-6 bg-[#e6f3f1] p-4 rounded-lg">
          <h3 className="text-sm font-medium text-[#0a7662] mb-2 flex items-center">
            <TbInfoCircle size={16} className="mr-2" />
            Search Insights
          </h3>
          <ul className="text-sm text-[#0a7662] space-y-2">
            <li className="flex items-start">
              <TbArrowUp
                size={16}
                className="mr-2 mt-0.5 flex-shrink-0 text-[#0a7662]"
              />
              <span>
                Searches for "laptop" have increased by 25% this month
              </span>
            </li>
            <li className="flex items-start">
              <TbArrowDown
                size={16}
                className="mr-2 mt-0.5 flex-shrink-0 text-green-500"
              />
              <span>30% of searches for "printer" return zero results</span>
            </li>
            <li className="flex items-start">
              <TbInfoCircle
                size={16}
                className="mr-2 mt-0.5 flex-shrink-0 text-[#0a7662]"
              />
              <span>
                Most users search by product name rather than category
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchAnalytics;
