import React, { useState, useEffect } from "react";
import {
  TbPlus,
  TbSearch,
  TbFilter,
  TbGrid3X3,
  TbList,
  TbTable,
  TbDownload,
  TbUpload,
  TbSettings,
  TbCheck,
  TbX,
  TbInfoCircle,
  TbScan,
} from "react-icons/tb";
import useInventory from "../hooks/useInventory";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ItemHistoryModal from "./ItemHistoryModal";
import BulkOperationsModal from "./BulkOperationsModal";
import BulkImportModal from "./BulkImportModal";
import ExportModal from "./ExportModal";
import ItemDetailsSidebar from "./ItemDetailsSidebar";
import toast from "react-hot-toast";

const ItemsTab = ({
  folders,
  selectedFolder,
  setSelectedFolder,
  onOpenBarcodeScanner,
}) => {
  const [viewMode, setViewMode] = useState("grid");
  // Barcode scanner state
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  // Handle barcode scan success
  const handleBarcodeItemFound = (item) => {
    // Highlight found item or open details
    setSelectedItems([item._id]);
    toast.success(`Found item: ${item.name}`);
  };

  // Handle create item from barcode
  const handleCreateItemFromBarcode = (barcode) => {
    setShowAddModal(true);
    // Pre-fill barcode in add modal
    // This would need to be implemented in AddItemModal
  }; // grid, list, table
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDetailsSidebar, setShowDetailsSidebar] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters] = useState({
    lowStock: false,
    hasImages: false,
    priceRange: { min: "", max: "" },
  });

  const {
    items,
    itemsLoading,
    fetchItems,
    deleteItem,
    searchItems,
    setSorting,
    setFilters,
  } = useInventory();

  useEffect(() => {
    fetchItems();
  }, []);

  // Update store filter when selectedFolder changes
  useEffect(() => {
    let folderId;
    if (selectedFolder === "all") {
      folderId = null; // No folder filter
    } else if (selectedFolder === "null") {
      folderId = "null"; // Items with no folder (string "null")
    } else {
      folderId = selectedFolder; // Specific folder ID
    }

    setFilters({ folderId });
    fetchItems();
  }, [selectedFolder, setFilters, fetchItems]);

  // Filter items based on search and filters
  const filteredItems = (Array.isArray(items) ? items : []).filter((item) => {
    // Search filter
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Folder filter is now handled by the API via store filters

    // Low stock filter
    if (filters.lowStock && item.quantity > item.minLevel) {
      return false;
    }

    // Has images filter
    if (filters.hasImages && (!item.images || item.images.length === 0)) {
      return false;
    }

    // Price range filter
    if (
      filters.priceRange.min &&
      item.price < parseFloat(filters.priceRange.min)
    ) {
      return false;
    }
    if (
      filters.priceRange.max &&
      item.price > parseFloat(filters.priceRange.max)
    ) {
      return false;
    }

    return true;
  });

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        await searchItems(searchQuery);
      } catch {
        toast.error("Search failed");
      }
    } else {
      fetchItems();
    }
  };

  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newOrder);
    setSorting(field, newOrder);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item._id));
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleDeleteItem = (item) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  const handleViewHistory = (item) => {
    setHistoryItem(item);
    setShowHistoryModal(true);
  };

  const handleViewDetails = (item) => {
    setDetailsItem(item);
    setShowDetailsSidebar(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      await deleteItem(deletingItem._id);
      toast.success("Item deleted successfully");
      setShowDeleteModal(false);
      setDeletingItem(null);
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredItems.map((item) => {
        if (!item || !item._id) return null;
        return (
          <div
            key={item._id}
            className={`bg-white border rounded-xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${
              selectedItems.includes(item._id)
                ? "ring-2 ring-primary ring-opacity-50 shadow-lg border-[var(--bg-primary)]"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={(e) => {
              if (e.shiftKey || e.ctrlKey || e.metaKey) {
                // If modifier key is pressed, use selection behavior
                handleSelectItem(item._id);
              } else {
                // Otherwise, open details sidebar
                handleViewDetails(item);
              }
            }}
          >
            {/* Item Image */}
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden relative group">
              {item.images && item.images.length > 0 ? (
                <>
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
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                      e.target.style.display = "none";
                      const fallback = e.target.nextSibling;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-full h-full flex flex-col items-center justify-center text-gray-400"
                    style={{ display: "none" }}
                  >
                    <TbGrid3X3 size={40} className="mb-2" />
                    <span className="text-xs">No Image</span>
                  </div>
                  {item.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                      +{item.images.length - 1}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <TbGrid3X3 size={40} className="mb-2" />
                  <span className="text-xs">No Image</span>
                </div>
              )}

              {/* Selection indicator */}
              {selectedItems.includes(item._id) && (
                <div className="absolute top-2 left-2 btn-primary text-white rounded-full p-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Item Info */}
            <div className="space-y-3">
              {/* Item Name - Heading */}
              <h3
                className="font-semibold text-lg text-gray-900 truncate leading-tight"
                title={item.name || "Unnamed Item"}
              >
                {item.name || "Unnamed Item"}
              </h3>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Price - Prominent */}
              {item.price && (
                <div className="text-xl font-bold text-primary">
                  PKR {Number(item.price).toLocaleString()}
                </div>
              )}

              {/* Quantity and Unit */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  <span className="font-medium">Qty:</span> {item.quantity || 0}{" "}
                  {item.unit || ""}
                </span>
                {item.location && (
                  <span className="text-gray-500 text-xs">
                    📍 {item.location}
                  </span>
                )}
              </div>

              {/* Status Indicators */}
              <div className="flex items-center justify-between">
                {/* Low Stock Warning */}
                {(item.quantity || 0) <= (item.minLevel || 0) ? (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                    ⚠️ Low Stock
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs bg-primary-light text-[var(--primary-dark)] rounded-full font-medium">
                    ✅ In Stock
                  </span>
                )}

                {/* Creation Date */}
                {item.createdAt && (
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Tags */}
              {item.tags &&
                Array.isArray(item.tags) &&
                item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-light text-[var(--primary-dark)] text-xs rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{item.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(item);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-primary hover:bg-primary-light rounded-md text-sm font-medium transition-colors"
              >
                <TbInfoCircle size={16} /> Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditItem(item);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-primary hover:bg-primary-light rounded-md text-sm font-medium transition-colors"
              >
                ✏️ Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewHistory(item);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
              >
                📊 History
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-md text-sm font-medium transition-colors"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {filteredItems.map((item) => {
        if (!item || !item._id) return null;
        return (
          <div
            key={item._id}
            className={`bg-white border rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer ${
              selectedItems.includes(item._id)
                ? "ring-2 ring-primary ring-opacity-50"
                : "border-gray-200"
            }`}
            onClick={(e) => {
              if (e.shiftKey || e.ctrlKey || e.metaKey) {
                // If modifier key is pressed, use selection behavior
                handleSelectItem(item._id);
              } else {
                // Otherwise, open details sidebar
                handleViewDetails(item);
              }
            }}
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selectedItems.includes(item._id)}
              onChange={() => handleSelectItem(item._id)}
              className="text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Item Image */}
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {item.images && item.images.length > 0 ? (
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
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Image failed to load:", e.target.src);
                    e.target.style.display = "none";
                    const fallback = e.target.nextSibling;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <TbGrid3X3 size={20} />
                </div>
              )}
              <div
                className="w-full h-full flex items-center justify-center text-gray-400"
                style={{ display: "none" }}
              >
                <TbGrid3X3 size={20} />
              </div>
            </div>

            {/* Item Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 truncate">
                {item.name || "Unnamed Item"}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {item.description || ""}
              </p>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span>
                  Qty: {item.quantity || 0} {item.unit || ""}
                </span>
                {item.price && <span>PKR {item.price}</span>}
                {item.location && <span>Location: {item.location}</span>}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col items-end gap-2">
              {(item.quantity || 0) <= (item.minLevel || 0) && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  Low Stock
                </span>
              )}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditItem(item);
                  }}
                  className="text-primary hover:text-[var(--primary-dark)] text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewHistory(item);
                  }}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  History
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item);
                  }}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length === filteredItems.length &&
                    filteredItems.length > 0
                  }
                  onChange={handleSelectAll}
                  className="text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Name
                  {sortBy === "name" && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("quantity")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Quantity
                  {sortBy === "quantity" && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("price")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Price
                  {sortBy === "price" && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => {
              if (!item || !item._id) return null;
              return (
                <tr
                  key={item._id}
                  className={`hover:bg-gray-50 ${
                    selectedItems.includes(item._id) ? "bg-primary-light" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                      className="text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden mr-3">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <TbGrid3X3 size={16} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.name || "Unnamed Item"}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description || ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity || 0} {item.unit || ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.price ? `PKR ${item.price}` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.location || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(item.quantity || 0) <= (item.minLevel || 0) ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-primary-light text-[var(--primary-dark)] rounded-full">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-primary hover:text-[var(--primary-dark)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewHistory(item)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        History
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Items</h1>
            <p className="text-gray-600">
              {filteredItems.length} of {items.length} items
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <TbUpload size={16} />
              Import
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <TbDownload size={16} />
              Export
            </button>
            {selectedItems.length > 0 && (
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-primary border border-[var(--primary-light)] rounded-lg hover:bg-primary-light"
              >
                <TbSettings size={16} />
                Bulk Actions ({selectedItems.length})
              </button>
            )}
            <button
              onClick={async () => {
                console.log("🔄 Manual refresh clicked");
                try {
                  await fetchItems();
                  toast.success("Items refreshed successfully!");
                } catch (error) {
                  console.error("❌ Manual refresh failed:", error);
                  toast.error("Failed to refresh items");
                }
              }}
              disabled={itemsLoading}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                itemsLoading
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-primary border-[var(--primary-light)] hover:bg-primary-light"
              }`}
            >
              {itemsLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Refreshing...
                </>
              ) : (
                <>🔄 Refresh</>
              )}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover"
            >
              <TbPlus size={16} />
              Add Item
            </button>
            <button
              onClick={() => onOpenBarcodeScanner && onOpenBarcodeScanner()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="Scan Barcode"
            >
              <TbScan className="w-4 h-4" />
              Scan
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <TbSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              placeholder="Search items..."
            />
          </div>

          {/* Folder Filter */}
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            <option value="all">All Folders</option>
            {Array.isArray(folders) &&
              folders.map((folder) => (
                <option key={folder._id} value={folder._id}>
                  {folder.name}
                </option>
              ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "btn-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <TbGrid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "btn-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <TbList size={16} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 ${
                viewMode === "table"
                  ? "btn-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <TbTable size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {itemsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading items...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <TbGrid3X3 size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Items Found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedFolder !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first item"}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <>
            {viewMode === "grid" && renderGridView()}
            {viewMode === "list" && renderListView()}
            {viewMode === "table" && renderTableView()}
          </>
        )}
      </div>

      {/* Modals */}
      <AddItemModal
        open={showAddModal}
        onClose={async () => {
          console.log("🔄 AddItemModal closed, refreshing items...");
          setShowAddModal(false);
          // Force refresh after modal closes
          try {
            await fetchItems();
            console.log("✅ Items refreshed after modal close");
          } catch (error) {
            console.error(
              "❌ Failed to refresh items after modal close:",
              error
            );
          }
        }}
      />

      <EditItemModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
        }}
        item={editingItem}
      />

      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingItem(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        itemName={deletingItem?.name}
        type="item"
      />

      <ItemHistoryModal
        open={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setHistoryItem(null);
        }}
        item={historyItem}
      />

      <BulkOperationsModal
        open={showBulkModal}
        onClose={() => {
          setShowBulkModal(false);
          setSelectedItems([]);
        }}
        selectedItems={filteredItems.filter((item) =>
          selectedItems.includes(item._id)
        )}
      />

      <BulkImportModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onBack={() => setShowImportModal(false)}
      />

      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        selectedItems={filteredItems.filter((item) =>
          selectedItems.includes(item._id)
        )}
      />
    </div>
  );
};

export default ItemsTab;
