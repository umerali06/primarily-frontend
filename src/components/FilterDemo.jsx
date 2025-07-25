import React, { useState, useEffect } from "react";
import AdvancedFilterSystem from "./AdvancedFilterSystem";

/**
 * Demo component to showcase the advanced filter system
 */
const FilterDemo = () => {
  // Sample data
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

  // Sample items
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  // Generate sample items
  useEffect(() => {
    const generateItems = () => {
      const result = [];
      for (let i = 1; i <= 100; i++) {
        const randomCategory =
          sampleCategories[Math.floor(Math.random() * sampleCategories.length)];
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

        result.push({
          id: i,
          name: `Item ${i}`,
          description: `This is a sample item ${i}`,
          category: randomCategory,
          location: randomLocation,
          tags: itemTags,
          price: Math.floor(Math.random() * 10000) / 100,
          quantity: Math.floor(Math.random() * 100),
          minLevel: Math.floor(Math.random() * 10),
          hasImages: Math.random() > 0.5,
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
          ),
        });
      }
      return result;
    };

    const sampleItems = generateItems();
    setItems(sampleItems);
    setFilteredItems(sampleItems);
  }, []);

  // Handle filter changes
  const handleFiltersChange = (filters) => {
    // Apply filters to items
    const filtered = items.filter((item) => {
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

    setFilteredItems(filtered);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Advanced Filter System Demo</h1>

      <AdvancedFilterSystem
        onFiltersChange={handleFiltersChange}
        categories={sampleCategories}
        tags={sampleTags}
        locations={sampleLocations}
      />

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            Items ({filteredItems.length} of {items.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.slice(0, 10).map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
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
                    <div className="text-sm text-gray-900">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${item.price.toFixed(2)}
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
                      {item.quantity <= item.minLevel && " (Low)"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-primary-light text-[var(--primary-dark)] rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No items match the current filters
                  </td>
                </tr>
              )}
              {filteredItems.length > 10 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    ... and {filteredItems.length - 10} more items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FilterDemo;
