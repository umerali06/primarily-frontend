import React, { useState, useEffect, useMemo } from "react";
import SortControls from "./SortControls";
import ActiveSortIndicator from "./ActiveSortIndicator";
import SortableColumnHeader from "./SortableColumnHeader";
import useSorting from "../hooks/useSorting";

/**
 * Demo component to showcase the enhanced sorting capabilities
 */
const SortDemo = () => {
  // Sample data
  const [items, setItems] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);

  // Available sort fields
  const availableSortFields = [
    { value: "name", label: "Name" },
    { value: "category", label: "Category" },
    { value: "price", label: "Price" },
    { value: "quantity", label: "Quantity" },
    { value: "createdAt", label: "Created Date" },
    { value: "updatedAt", label: "Updated Date" },
  ];

  // Use the sorting hook
  const [
    sortConfig,
    setSortField,
    clearSorting,
    toggleSortOrder,
    addSortField,
    removeSortField,
    promoteToPrimary,
  ] = useSorting("sortDemoSorting");

  // Generate sample items
  useEffect(() => {
    const generateItems = () => {
      const categories = [
        "Electronics",
        "Office Supplies",
        "Furniture",
        "Kitchen",
        "Bathroom",
        "Outdoor",
        "Tools",
        "Clothing",
      ];

      const result = [];
      for (let i = 1; i <= 50; i++) {
        const randomCategory =
          categories[Math.floor(Math.random() * categories.length)];

        const createdDate = new Date();
        createdDate.setDate(
          createdDate.getDate() - Math.floor(Math.random() * 30)
        );

        const updatedDate = new Date(createdDate);
        updatedDate.setDate(
          updatedDate.getDate() + Math.floor(Math.random() * 10)
        );

        result.push({
          id: i,
          name: `Item ${i}`,
          category: randomCategory,
          price: Math.floor(Math.random() * 10000) / 100,
          quantity: Math.floor(Math.random() * 100),
          createdAt: createdDate,
          updatedAt: updatedDate,
        });
      }
      return result;
    };

    const sampleItems = generateItems();
    setItems(sampleItems);
  }, []);

  // Apply sorting to items
  useEffect(() => {
    // Create a copy of the items array
    const itemsToSort = [...items];

    // Sort the items based on the sort configuration
    const sorted = itemsToSort.sort((a, b) => {
      // Primary sort
      const primaryField = sortConfig.primary.field;
      const primaryOrder = sortConfig.primary.order;

      // Compare primary field
      const primaryComparison = compareValues(
        a[primaryField],
        b[primaryField],
        primaryOrder
      );

      // If primary fields are equal, use secondary sorts
      if (primaryComparison === 0 && sortConfig.secondary.length > 0) {
        // Loop through secondary sorts
        for (const secondarySort of sortConfig.secondary) {
          const secondaryField = secondarySort.field;
          const secondaryOrder = secondarySort.order;

          // Compare secondary field
          const secondaryComparison = compareValues(
            a[secondaryField],
            b[secondaryField],
            secondaryOrder
          );

          // If secondary fields are not equal, return the comparison
          if (secondaryComparison !== 0) {
            return secondaryComparison;
          }
        }
      }

      // Return primary comparison if no secondary sorts or all secondary fields are equal
      return primaryComparison;
    });

    setSortedItems(sorted);
  }, [items, sortConfig]);

  // Helper function to compare values
  const compareValues = (a, b, order) => {
    // Handle dates
    if (a instanceof Date && b instanceof Date) {
      return order === "asc" ? a - b : b - a;
    }

    // Handle strings
    if (typeof a === "string" && typeof b === "string") {
      return order === "asc" ? a.localeCompare(b) : b.localeCompare(a);
    }

    // Handle numbers and other values
    if (a < b) return order === "asc" ? -1 : 1;
    if (a > b) return order === "asc" ? 1 : -1;
    return 0;
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  // Format price for display
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Enhanced Sorting Demo</h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Items ({items.length})</h2>
        <SortControls
          sortConfig={sortConfig}
          setSortField={setSortField}
          clearSorting={clearSorting}
          toggleSortOrder={toggleSortOrder}
          addSortField={addSortField}
          removeSortField={removeSortField}
          promoteToPrimary={promoteToPrimary}
          availableSortFields={availableSortFields}
        />
      </div>

      <ActiveSortIndicator
        sortConfig={sortConfig}
        setSortField={setSortField}
        clearSorting={clearSorting}
        availableSortFields={availableSortFields}
      />

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
                    field="createdAt"
                    label="Created"
                    sortConfig={sortConfig}
                    setSortField={setSortField}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortableColumnHeader
                    field="updatedAt"
                    label="Updated"
                    sortConfig={sortConfig}
                    setSortField={setSortField}
                  />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(item.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Sorting Features</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Click on column headers to sort by that field</li>
          <li>Click again to toggle between ascending and descending order</li>
          <li>Use the Sort button to access advanced sorting options</li>
          <li>Add multiple sort fields for multi-level sorting</li>
          <li>Rearrange sort fields to change sort priority</li>
          <li>Active sort indicators show current sort configuration</li>
          <li>Sort settings are saved between sessions</li>
        </ul>
      </div>
    </div>
  );
};

export default SortDemo;
