import React, { useState, useEffect, useMemo } from "react";
import DataManagementToolbar from "./DataManagementToolbar";
import SortableColumnHeader from "./SortableColumnHeader";
import ItemBadge from "./ItemBadge";
import useSorting from "../hooks/useSorting";
import useFilters from "../hooks/useFilters";
import { applySorting } from "../utils/sortUtils";
import ViewToggle from "./ViewToggle";
import ViewTransition from "./ViewTransition";
import EnhancedItemsGrid from "./EnhancedItemsGrid";
import EnhancedListView from "./EnhancedListView";
import EnhancedTableView from "./EnhancedTableView";

/**
 * Comprehensive demo that showcases both filtering and sorting systems
 */
const DataManagementDemo = () => {
  // Sample data
  const [items, setItems] = useState([]);
  const [processedItems, setProcessedItems] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [isLoading, setIsLoading] = useState(true);

  // Available sort fields
  const availableSortFields = [
    { value: "name", label: "Name" },
    { value: "category", label: "Category" },
    { value: "price", label: "Price" },
    { value: "quantity", label: "Quantity" },
    { value: "location", label: "Location" },
    { value: "createdAt", label: "Created Date" },
    { value: "updatedAt", label: "Updated Date" },
  ];

  // Sample categories, tags, and locations
  const sampleCategories = [
    "Electronics",
    "Office Supplies",
    "Furniture",
    "Kitchen",
    "Bathroom",
    "Outdoor",
    "Tools",
    "Clothing",
  ];

  const sampleTags = [
    "new",
    "fragile",
    "heavy",
    "valuable",
    "perishable",
    "seasonal",
    "clearance",
    "damaged",
    "refurbished",
    "warranty",
  ];

  const sampleLocations = [
    "Warehouse A",
    "Warehouse B",
    "Office 101",
    "Office 102",
    "Storage Room",
    "Front Desk",
    "Showroom",
    "Basement",
  ];

  // Use the sorting and filtering hooks
  const [
    sortConfig,
    setSortField,
    clearSorting,
    toggleSortOrder,
    addSortField,
    removeSortField,
    promoteToPrimary,
  ] = useSorting("demoSorting");
  const [filters, setFilter, clearFilters, applyFilterPreset] =
    useFilters("demoFilters");

  // Generate sample items
  useEffect(() => {
    const generateItems = () => {
      setIsLoading(true);

      setTimeout(() => {
        const result = [];
        for (let i = 1; i <= 100; i++) {
          const randomCategory =
            sampleCategories[
              Math.floor(Math.random() * sampleCategories.length)
            ];
          const randomLocation =
            sampleLocations[Math.floor(Math.random() * sampleLocations.length)];

          // Generate 1-3 random tags
          const itemTags = [];
          const tagCount = Math.floor(Math.random() * 3) + 1;
          for (let j = 0; j < tagCount; j++) {
            const randomTag =
              sampleTags[Math.floor(Math.random() * sampleTags.length)];
            if (!itemTags.includes(randomTag)) {
              itemTags.push(randomTag);
            }
          }

          const createdDate = new Date();
          createdDate.setDate(
            createdDate.getDate() - Math.floor(Math.random() * 30)
          );

          const updatedDate = new Date(createdDate);
          updatedDate.setDate(
            updatedDate.getDate() + Math.floor(Math.random() * 10)
          );

          const quantity = Math.floor(Math.random() * 100);
          const minLevel = Math.floor(Math.random() * 10);

          result.push({
            id: i,
            name: `Item ${i}`,
            description: `This is a sample item ${i} for demonstration purposes.`,
            category: randomCategory,
            location: randomLocation,
            tags: itemTags,
            price: Math.floor(Math.random() * 10000) / 100,
            quantity: quantity,
            minLevel: minLevel,
            hasImages: Math.random() > 0.5,
            createdAt: createdDate,
            updatedAt: updatedDate,
          });
        }

        setItems(result);
        setIsLoading(false);
      }, 500); // Simulate loading delay
    };

    generateItems();
  }, []);

  // Apply filters and sorting to items
  useEffect(() => {
    // Apply filters
    const filteredItems = items.filter((item) => {
      // Search query filter
      if (
        filters.searchQuery &&
        !item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !item.description
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Stock filters
      if (filters.lowStock && item.quantity > item.minLevel) {
        return false;
      }

      if (filters.outOfStock && item.quantity > 0) {
        return false;
      }

      // Has images filter
      if (filters.hasImages && !item.hasImages) {
        return false;
      }

      // Price range filter
      if (
        filters.priceRange?.min &&
        item.price < parseFloat(filters.priceRange.min)
      ) {
        return false;
      }

      if (
        filters.priceRange?.max &&
        item.price > parseFloat(filters.priceRange.max)
      ) {
        return false;
      }

      // Category filter
      if (
        filters.categories?.length > 0 &&
        !filters.categories.includes(item.category)
      ) {
        return false;
      }

      // Location filter
      if (
        filters.locations?.length > 0 &&
        !filters.locations.includes(item.location)
      ) {
        return false;
      }

      // Tags filter
      if (filters.tags?.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) =>
          item.tags.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      // Date range filter
      if (
        filters.dateRange?.start &&
        item.createdAt < filters.dateRange.start
      ) {
        return false;
      }

      if (filters.dateRange?.end) {
        const endDate = new Date(filters.dateRange.end);
        endDate.setHours(23, 59, 59, 999); // End of day
        if (item.createdAt > endDate) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    const sortedItems = applySorting(filteredItems, sortConfig);

    setProcessedItems(sortedItems);
  }, [items, filters, sortConfig]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    // Update each filter individually to maintain proper state
    Object.entries(newFilters).forEach(([key, value]) => {
      setFilter(key, value);
    });
  };

  // Handle sort changes
  const handleSortChange = (newSortConfig) => {
    // This would typically update the sort configuration
    // For demo purposes, we'll just log it
    console.log("Sort changed:", newSortConfig);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);

    // Simulate refresh delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  // Format price for display
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Render the appropriate view based on viewMode
  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading items...</p>
        </div>
      );
    }

    if (processedItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 bg-white border border-gray-200 rounded-lg">
          <div className="text-gray-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No items found
          </h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Try adjusting your filters to find what you're looking for.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors"
          >
            Clear Filters
          </button>
        </div>
      );
    }

    switch (viewMode) {
      case "grid":
        return (
          <EnhancedItemsGrid
            items={processedItems}
            selectedItems={[]}
            onSelectItem={() => {}}
            onEditItem={() => {}}
            onDeleteItem={() => {}}
            onViewHistory={() => {}}
            onViewDetails={() => {}}
            columnSettings={{ sm: 2, md: 3, lg: 4, xl: 5 }}
          />
        );
      case "list":
        return (
          <EnhancedListView
            items={processedItems}
            selectedItems={[]}
            onSelectItem={() => {}}
            onEditItem={() => {}}
            onDeleteItem={() => {}}
            onViewHistory={() => {}}
            onViewDetails={() => {}}
          />
        );
      case "table":
        return (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <SortableColumnHeader
                        field="name"
                        label="Name"
                        sortConfig={sortConfig}
                        setSortField={setSortField}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <SortableColumnHeader
                        field="category"
                        label="Category"
                        sortConfig={sortConfig}
                        setSortField={setSortField}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <SortableColumnHeader
                        field="price"
                        label="Price"
                        sortConfig={sortConfig}
                        setSortField={setSortField}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <SortableColumnHeader
                        field="quantity"
                        label="Quantity"
                        sortConfig={sortConfig}
                        setSortField={setSortField}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <SortableColumnHeader
                        field="location"
                        label="Location"
                        sortConfig={sortConfig}
                        setSortField={setSortField}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <SortableColumnHeader
                        field="createdAt"
                        label="Created"
                        sortConfig={sortConfig}
                        setSortField={setSortField}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processedItems.slice(0, 20).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {item.hasImages ? (
                              <img
                                src={`https://picsum.photos/seed/${item.id}/200/200`}
                                alt={item.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <span className="text-gray-400">No img</span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatPrice(item.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${
                            item.quantity <= item.minLevel
                              ? "text-green-600 font-medium"
                              : "text-gray-900"
                          }`}
                        >
                          {item.quantity}
                          {item.quantity <= item.minLevel && (
                            <ItemBadge
                              type="warning"
                              label="Low Stock"
                              size="xs"
                              className="ml-2"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <ItemBadge
                              key={tag}
                              type="info"
                              label={tag}
                              size="xs"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))}
                  {processedItems.length > 20 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        ... and {processedItems.length - 20} more items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Data Management Demo</h1>
      <p className="text-gray-600 mb-6">
        This demo showcases the integration of advanced filtering and sorting
        capabilities.
      </p>

      <div className="mb-4 flex justify-between items-center">
        <div className="text-lg font-medium">
          Items ({processedItems.length} of {items.length})
        </div>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      <DataManagementToolbar
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        onRefresh={handleRefresh}
        categories={sampleCategories}
        tags={sampleTags}
        locations={sampleLocations}
        availableSortFields={availableSortFields}
      />

      <ViewTransition viewMode={viewMode}>{renderView()}</ViewTransition>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-medium mb-2">Advanced Filtering</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Multiple filter types (text, range, date, etc.)</li>
              <li>Save and reuse filter presets</li>
              <li>Visual indicators for active filters</li>
              <li>One-click filter removal</li>
              <li>Expandable/collapsible filter sections</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-medium mb-2">Enhanced Sorting</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Multi-level sorting with primary and secondary fields</li>
              <li>Click column headers to sort</li>
              <li>Visual indicators for sort direction and priority</li>
              <li>Persistent sort preferences</li>
              <li>Advanced sort configuration panel</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-medium mb-2">View Options</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Grid view with cards</li>
              <li>List view with enhanced information density</li>
              <li>Table view with sortable columns</li>
              <li>Smooth transitions between views</li>
              <li>Persistent view preferences</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-medium mb-2">
              Performance Optimizations
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Virtualized rendering for large datasets</li>
              <li>Efficient filtering and sorting algorithms</li>
              <li>Memoization to prevent unnecessary re-renders</li>
              <li>Lazy loading of images and content</li>
              <li>Optimized state management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagementDemo;
