import React from "react";
import {
  TbSearch,
  TbFilter,
  TbX,
  TbAlertCircle,
  TbInfoCircle,
  TbPlus,
  TbArrowRight,
  TbRefresh,
  TbFileImport,
  TbDatabaseImport,
  TbWand,
} from "react-icons/tb";

/**
 * Component for handling various empty states with helpful suggestions
 */
const EmptyStateHandler = ({
  type = "noResults", // noResults, noItems, noSearch, error, filtered
  query = "",
  filterCount = 0,
  onClear,
  onAddItem,
  onImport,
  onAdvancedSearch,
  error = null,
  className = "",
}) => {
  // Render based on type
  switch (type) {
    case "noResults":
      return (
        <div className={`text-center py-12 ${className}`}>
          <div className="bg-gray-50 rounded-xl p-8 max-w-lg mx-auto">
            <div className="text-gray-400 mb-4">
              <TbSearch size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No results found for "{query}"
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any items matching your search criteria. Try
              adjusting your search terms or filters.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClear}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                <TbX size={18} className="mr-2" />
                Clear Search
              </button>
              {onAdvancedSearch && (
                <button
                  onClick={onAdvancedSearch}
                  className="px-4 py-2 bg-[#e6f3f1] border border-[var(--bg-primary)] rounded-md text-[#0a7662] hover:bg-[#e6f3f1] flex items-center justify-center"
                >
                  <TbWand size={18} className="mr-2" />
                  Try Advanced Search
                </button>
              )}
            </div>
          </div>
        </div>
      );

    case "filtered":
      return (
        <div className={`text-center py-12 ${className}`}>
          <div className="bg-gray-50 rounded-xl p-8 max-w-lg mx-auto">
            <div className="text-gray-400 mb-4">
              <TbFilter size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No items match your filters
            </h3>
            <p className="text-gray-600 mb-6">
              {filterCount > 1
                ? `You have ${filterCount} active filters that don't match any items.`
                : "Your current filter doesn't match any items."}
              Try adjusting or clearing your filters.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClear}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                <TbX size={18} className="mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      );

    case "noItems":
      return (
        <div className={`text-center py-12 ${className}`}>
          <div className="bg-gray-50 rounded-xl p-8 max-w-lg mx-auto">
            <div className="text-blue-100 mb-4">
              <TbInfoCircle size={64} className="mx-auto text-[#0a7662]" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No items in your inventory yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first item or importing items from a
              spreadsheet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {onAddItem && (
                <button
                  onClick={onAddItem}
                  className="px-4 py-2 btn-primary rounded-md text-white hover:btn-primary-hover flex items-center justify-center"
                >
                  <TbPlus size={18} className="mr-2" />
                  Add First Item
                </button>
              )}
              {onImport && (
                <button
                  onClick={onImport}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                >
                  <TbFileImport size={18} className="mr-2" />
                  Import Items
                </button>
              )}
            </div>
          </div>
        </div>
      );

    case "noSearch":
      return (
        <div className={`text-center py-12 ${className}`}>
          <div className="bg-gray-50 rounded-xl p-8 max-w-lg mx-auto">
            <div className="text-gray-300 mb-4">
              <TbSearch size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Search your inventory
            </h3>
            <p className="text-gray-600 mb-6">
              Enter a search term above to find items in your inventory. You can
              search by name, description, tags, and more.
            </p>
            {onAdvancedSearch && (
              <button
                onClick={onAdvancedSearch}
                className="px-4 py-2 bg-[#e6f3f1] border border-[var(--bg-primary)] rounded-md text-[#0a7662] hover:bg-[#e6f3f1] flex items-center justify-center mx-auto"
              >
                <TbWand size={18} className="mr-2" />
                Try Advanced Search
              </button>
            )}
          </div>
        </div>
      );

    case "error":
      return (
        <div className={`text-center py-12 ${className}`}>
          <div className="bg-green-50 rounded-xl p-8 max-w-lg mx-auto">
            <div className="text-red-400 mb-4">
              <TbAlertCircle size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Error while searching
            </h3>
            <p className="text-gray-600 mb-4">
              {error ||
                "Something went wrong while searching. Please try again."}
            </p>
            <div className="bg-white border border-gray-200 rounded-md p-3 mb-6 text-left text-sm text-gray-600 overflow-auto max-h-32">
              <code>{error?.toString() || "Unknown error"}</code>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClear}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                <TbX size={18} className="mr-2" />
                Clear Search
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 btn-primary rounded-md text-white hover:btn-primary-hover flex items-center justify-center"
              >
                <TbRefresh size={18} className="mr-2" />
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default EmptyStateHandler;
