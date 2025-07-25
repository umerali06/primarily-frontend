import React, { useState } from "react";
import EnhancedListView from "./EnhancedListView";
import EnhancedTableView from "./EnhancedTableView";
import VirtualizedEnhancedListView from "./VirtualizedEnhancedListView";
import VirtualizedEnhancedTableView from "./VirtualizedEnhancedTableView";
import ViewToggle from "./ViewToggle";
import ViewTransition from "./ViewTransition";

/**
 * Demo component showing how to use the enhanced list and table views
 */
const EnhancedViewsDemo = () => {
  // Sample data
  const sampleItems = [
    {
      _id: "1",
      name: "Laptop Computer",
      description: "High-performance laptop for development work",
      quantity: 5,
      unit: "pcs",
      price: 1299.99,
      location: "Office",
      minLevel: 2,
      category: "Electronics",
      tags: ["tech", "work", "essential"],
      images: ["https://via.placeholder.com/150"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "2",
      name: "Office Chair",
      description: "Ergonomic office chair with lumbar support",
      quantity: 3,
      unit: "pcs",
      price: 249.99,
      location: "Storage",
      minLevel: 5,
      category: "Furniture",
      tags: ["office", "ergonomic"],
      images: ["https://via.placeholder.com/150"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "3",
      name: "Wireless Mouse",
      description: "Bluetooth wireless mouse with long battery life",
      quantity: 1,
      unit: "pcs",
      price: 49.99,
      location: "Office",
      minLevel: 2,
      category: "Electronics",
      tags: ["tech", "accessories"],
      images: ["https://via.placeholder.com/150"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Generate more sample items for virtualization demo
  const generateLargeDataset = (count) => {
    const items = [...sampleItems];
    for (let i = 4; i <= count; i++) {
      items.push({
        _id: i.toString(),
        name: `Item ${i}`,
        description: `Description for item ${i}`,
        quantity: Math.floor(Math.random() * 20),
        unit: "pcs",
        price: Math.floor(Math.random() * 1000) + 0.99,
        location:
          i % 3 === 0 ? "Office" : i % 3 === 1 ? "Storage" : "Warehouse",
        minLevel: Math.floor(Math.random() * 5),
        category:
          i % 4 === 0
            ? "Electronics"
            : i % 4 === 1
            ? "Furniture"
            : i % 4 === 2
            ? "Office Supplies"
            : "Miscellaneous",
        tags: [`tag${i % 5}`, `tag${i % 7}`],
        images: ["https://via.placeholder.com/150"],
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 10000000)
        ).toISOString(),
        updatedAt: new Date(
          Date.now() - Math.floor(Math.random() * 1000000)
        ).toISOString(),
      });
    }
    return items;
  };

  // State
  const [viewMode, setViewMode] = useState("list");
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [useVirtualization, setUseVirtualization] = useState(false);
  const [datasetSize, setDatasetSize] = useState(3);
  const [columnSettings, setColumnSettings] = useState({
    visibleColumns: [
      "name",
      "quantity",
      "price",
      "location",
      "status",
      "tags",
      "actions",
    ],
    columnWidths: {
      name: 250,
      quantity: 120,
      price: 120,
      location: 150,
      status: 120,
      tags: 150,
      actions: 120,
    },
    frozenColumns: ["name"],
  });

  // Generate items based on dataset size
  const items =
    datasetSize > 3 ? generateLargeDataset(datasetSize) : sampleItems;

  // Handlers
  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item._id));
    }
  };

  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newOrder);
  };

  const handleEditItem = (item) => {
    console.log("Edit item:", item);
  };

  const handleDeleteItem = (item) => {
    console.log("Delete item:", item);
  };

  const handleViewHistory = (item) => {
    console.log("View history:", item);
  };

  const handleViewDetails = (item) => {
    console.log("View details:", item);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Enhanced Views Demo
      </h1>

      {/* Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-700">
              Current View: {viewMode}
            </h2>
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Use Virtualization:
                <input
                  type="checkbox"
                  checked={useVirtualization}
                  onChange={() => setUseVirtualization(!useVirtualization)}
                  className="ml-2 h-4 w-4 text-primary focus:ring-primary ring-opacity-50 border-gray-300 rounded"
                />
              </label>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Dataset Size:
              </label>
              <select
                value={datasetSize}
                onChange={(e) => setDatasetSize(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
              >
                <option value={3}>Small (3 items)</option>
                <option value={50}>Medium (50 items)</option>
                <option value={500}>Large (500 items)</option>
                <option value={5000}>Very Large (5000 items)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* View Content */}
      <ViewTransition viewMode={viewMode}>
        {viewMode === "list" && !useVirtualization && (
          <EnhancedListView
            items={items}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onViewHistory={handleViewHistory}
            onViewDetails={handleViewDetails}
          />
        )}

        {viewMode === "list" && useVirtualization && (
          <div style={{ height: "600px" }}>
            <VirtualizedEnhancedListView
              items={items}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onViewHistory={handleViewHistory}
              onViewDetails={handleViewDetails}
            />
          </div>
        )}

        {viewMode === "table" && !useVirtualization && (
          <EnhancedTableView
            items={items}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onViewHistory={handleViewHistory}
            onViewDetails={handleViewDetails}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            columnSettings={columnSettings}
          />
        )}

        {viewMode === "table" && useVirtualization && (
          <div style={{ height: "600px" }}>
            <VirtualizedEnhancedTableView
              items={items}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onSelectAll={handleSelectAll}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onViewHistory={handleViewHistory}
              onViewDetails={handleViewDetails}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              columnSettings={columnSettings}
            />
          </div>
        )}
      </ViewTransition>

      {/* Selected Items Info */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-700 mb-2">
          Selected Items: {selectedItems.length}
        </h3>
        {selectedItems.length > 0 && (
          <div className="text-sm text-gray-600">
            IDs: {selectedItems.join(", ")}
          </div>
        )}
      </div>

      {/* Performance Info */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-700 mb-2">
          Performance Information
        </h3>
        <div className="text-sm text-gray-600">
          <p>Total Items: {items.length}</p>
          <p>Virtualization: {useVirtualization ? "Enabled" : "Disabled"}</p>
          <p className="mt-2 text-xs text-gray-500">
            Note: With virtualization enabled, only the items visible in the
            viewport are rendered, which significantly improves performance with
            large datasets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedViewsDemo;
