import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  TbPlus,
  TbSearch,
  TbFilter,
  TbDownload,
  TbUpload,
  TbSettings,
  TbCheck,
  TbX,
  TbRefresh,
  TbChevronDown,
  TbAdjustments,
  TbTag,
  TbFolder,
  TbEye,
  TbTrash,
  TbEdit,
  TbCopy,
  TbClipboard,
  TbArrowsSort,
  TbDeviceLaptop,
  TbKeyboard,
} from "react-icons/tb";
import useInventory from "../hooks/useInventory";
import useViewPreferences from "../hooks/useViewPreferences";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ItemHistoryModal from "./ItemHistoryModal";
import BulkOperationsModal from "./BulkOperationsModal";
import BulkImportModal from "./BulkImportModal";
import ExportModal from "./ExportModal";
import toast from "react-hot-toast";
import EnhancedItemsGrid from "./EnhancedItemsGrid";
import EnhancedItemsHeader from "./EnhancedItemsHeader";
import EnhancedListView from "./EnhancedListView";
import EnhancedTableView from "./EnhancedTableView";
import VirtualizedEnhancedListView from "./VirtualizedEnhancedListView";
import VirtualizedEnhancedTableView from "./VirtualizedEnhancedTableView";
import ViewToggle from "./ViewToggle";
import ViewTransition from "./ViewTransition";
import ColumnCustomizer from "./ColumnCustomizer";
import ItemDetailsSidebar from "./ItemDetailsSidebar";
import KeyboardShortcutsGuide from "./KeyboardShortcutsGuide";

/**
 * Optimized version of the PrimarilyItemsTab component with enhanced list and table views
 * and virtualization for large datasets
 */
const PrimarilyItemsTabOptimized = ({
  folders,
  selectedFolder,
  setSelectedFolder,
}) => {
  // Use custom hook for view preferences
  const [viewPreferences, updateViewPreferences] = useViewPreferences(
    "primarilyViewPreferences",
    {
      viewMode: "grid",
      useVirtualization: true, // Enable virtualization by default for better performance
      columnSettings: {
        grid: {
          columns: {
            sm: 2,
            md: 3,
            lg: 4,
            xl: 5,
          },
        },
        table: {
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
        },
      },
      sortSettings: {
        sortBy: "updatedAt",
        sortOrder: "desc",
      },
    }
  );

  // State management
  const [viewMode, setViewMode] = useState(viewPreferences.viewMode);
  const [useVirtualization, setUseVirtualization] = useState(
    viewPreferences.useVirtualization
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);
  const [sortBy, setSortBy] = useState(viewPreferences.sortSettings.sortBy);
  const [sortOrder, setSortOrder] = useState(
    viewPreferences.sortSettings.sortOrder
  );
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    lowStock: false,
    hasImages: false,
    priceRange: { min: "", max: "" },
    tags: [],
    categories: [],
    dateRange: { start: null, end: null },
  });
  const [showDetailsSidebar, setShowDetailsSidebar] = useState(false);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Get inventory data and functions from the hook
  const {
    items,
    itemsLoading,
    fetchItems,
    deleteItem,
    searchItems,
    setSorting,
    bulkDeleteItems,
    bulkUpdateItems,
    itemsPagination,
    setPagination,
  } = useInventory();

  // Custom view mode setter that also updates preferences
  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    updateViewPreferences({ viewMode: newMode });
  };

  // Toggle virtualization
  const toggleVirtualization = () => {
    const newValue = !useVirtualization;
    setUseVirtualization(newValue);
    updateViewPreferences({ useVirtualization: newValue });
  };

  // Custom sort setter that also updates preferences
  const handleSortSettingsChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    updateViewPreferences({
      sortSettings: {
        sortBy: newSortBy,
        sortOrder: newSortOrder,
      },
    });
  };

  // Initial data fetch
  useEffect(() => {
    fetchItems();
  }, []);

  // Global keyboard shortcuts
  const handleGlobalKeyDown = useCallback((event) => {
    // Show keyboard shortcuts guide when '?' is pressed
    if (
      event.key === "?" &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      setShowKeyboardShortcuts(true);
    }
  }, []);

  // Set up global keyboard shortcuts
  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [handleGlobalKeyDown]);

  // Auto-refresh items when selectedFolder changes
  useEffect(() => {
    if (selectedFolder !== "all") {
      fetchItems({
        folderId: selectedFolder === "all" ? null : selectedFolder,
      });
    }
  }, [selectedFolder]);

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    return (Array.isArray(items) ? items : []).filter((item) => {
      if (!item) return false;

      // Search filter
      if (
        searchQuery &&
        !item.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Folder filter
      if (selectedFolder !== "all" && item.folderId !== selectedFolder) {
        return false;
      }

      // Low stock filter
      if (activeFilters.lowStock && item.quantity > (item.minLevel || 0)) {
        return false;
      }

      // Has images filter
      if (
        activeFilters.hasImages &&
        (!item.images || item.images.length === 0)
      ) {
        return false;
      }

      // Price range filter
      if (
        activeFilters.priceRange.min &&
        item.price < parseFloat(activeFilters.priceRange.min)
      ) {
        return false;
      }
      if (
        activeFilters.priceRange.max &&
        item.price > parseFloat(activeFilters.priceRange.max)
      ) {
        return false;
      }

      // Tags filter
      if (
        activeFilters.tags.length > 0 &&
        (!item.tags ||
          !activeFilters.tags.some((tag) =>
            item.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
          ))
      ) {
        return false;
      }

      // Categories filter
      if (
        activeFilters.categories.length > 0 &&
        (!item.category || !activeFilters.categories.includes(item.category))
      ) {
        return false;
      }

      // Date range filter
      if (activeFilters.dateRange.start && item.createdAt) {
        const itemDate = new Date(item.createdAt);
        const startDate = new Date(activeFilters.dateRange.start);
        if (itemDate < startDate) {
          return false;
        }
      }

      if (activeFilters.dateRange.end && item.createdAt) {
        const itemDate = new Date(item.createdAt);
        const endDate = new Date(activeFilters.dateRange.end);
        if (itemDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [items, searchQuery, selectedFolder, activeFilters]);

  // Handle search
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

  // Handle sort
  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    handleSortSettingsChange(field, newOrder);
    setSorting(field, newOrder);
  };

  // Handle item selection
  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item._id));
    }
  };

  // Handle item editing
  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  // Handle item deletion
  const handleDeleteItem = (item) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  // Handle viewing item history
  const handleViewHistory = (item) => {
    setHistoryItem(item);
    setShowHistoryModal(true);
  };

  // Handle item details view
  const handleViewDetails = (item) => {
    setSelectedItemForDetails(item);
    setShowDetailsSidebar(true);
  };

  // Confirm delete
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

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    try {
      await bulkDeleteItems(selectedItems);
      toast.success(`${selectedItems.length} items deleted successfully`);
      setSelectedItems([]);
    } catch {
      toast.error("Failed to delete items");
    }
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({
      lowStock: false,
      hasImages: false,
      priceRange: { min: "", max: "" },
      tags: [],
      categories: [],
      dateRange: { start: null, end: null },
    });
    setSearchQuery("");
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(page, itemsPagination.limit);
  };

  // Render filter panel
  const renderFilterPanel = () => {
    if (!isFilterPanelOpen) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Filters</h3>
          <button
            onClick={() => setIsFilterPanelOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <TbX size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Stock filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Stock Level
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="lowStock"
                checked={activeFilters.lowStock}
                onChange={(e) =>
                  handleFilterChange("lowStock", e.target.checked)
                }
                className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 border-gray-300 rounded"
              />
              <label htmlFor="lowStock" className="ml-2 text-sm text-gray-600">
                Low Stock Items
              </label>
            </div>
          </div>

          {/* Images filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Images</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasImages"
                checked={activeFilters.hasImages}
                onChange={(e) =>
                  handleFilterChange("hasImages", e.target.checked)
                }
                className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 border-gray-300 rounded"
              />
              <label htmlFor="hasImages" className="ml-2 text-sm text-gray-600">
                Has Images
              </label>
            </div>
          </div>

          {/* Price range filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={activeFilters.priceRange.min}
                onChange={(e) =>
                  handleFilterChange("priceRange", {
                    ...activeFilters.priceRange,
                    min: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
              <input
                type="number"
                placeholder="Max"
                value={activeFilters.priceRange.max}
                onChange={(e) =>
                  handleFilterChange("priceRange", {
                    ...activeFilters.priceRange,
                    max: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear All
          </button>
          <button
            onClick={() => setIsFilterPanelOpen(false)}
            className="px-4 py-2 text-sm btn-primary text-white rounded-md hover:btn-primary-hover"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  };

  // Render active filters
  const renderActiveFilters = () => {
    const hasActiveFilters =
      activeFilters.lowStock ||
      activeFilters.hasImages ||
      activeFilters.priceRange.min ||
      activeFilters.priceRange.max ||
      activeFilters.tags.length > 0 ||
      activeFilters.categories.length > 0 ||
      activeFilters.dateRange.start ||
      activeFilters.dateRange.end ||
      searchQuery;

    if (!hasActiveFilters) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {searchQuery && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            Search: {searchQuery}
            <button
              onClick={() => setSearchQuery("")}
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {activeFilters.lowStock && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            Low Stock
            <button
              onClick={() => handleFilterChange("lowStock", false)}
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {activeFilters.hasImages && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            Has Images
            <button
              onClick={() => handleFilterChange("hasImages", false)}
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {activeFilters.priceRange.min && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            Min Price: {activeFilters.priceRange.min}
            <button
              onClick={() =>
                handleFilterChange("priceRange", {
                  ...activeFilters.priceRange,
                  min: "",
                })
              }
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {activeFilters.priceRange.max && (
          <div className="flex items-center bg-primary-light text-[var(--primary-dark)] text-xs font-medium px-2.5 py-1 rounded-full">
            Max Price: {activeFilters.priceRange.max}
            <button
              onClick={() =>
                handleFilterChange("priceRange", {
                  ...activeFilters.priceRange,
                  max: "",
                })
              }
              className="ml-1 text-primary hover:text-[var(--primary-dark)]"
            >
              <TbX size={14} />
            </button>
          </div>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-600 hover:text-gray-800 underline ml-2"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  };

  // Render grid view
  const renderGridView = () => (
    <EnhancedItemsGrid
      items={filteredItems}
      selectedItems={selectedItems}
      onSelectItem={handleSelectItem}
      onEditItem={handleEditItem}
      onDeleteItem={handleDeleteItem}
      onViewHistory={handleViewHistory}
      onViewDetails={handleViewDetails}
      columnSettings={viewPreferences.columnSettings.grid.columns}
    />
  );

  // Render list view
  const renderListView = () => {
    // Use virtualized list view for large datasets
    if (useVirtualization && filteredItems.length > 50) {
      return (
        <div style={{ height: "calc(100vh - 300px)" }}>
          <VirtualizedEnhancedListView
            items={filteredItems}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onViewHistory={handleViewHistory}
            onViewDetails={handleViewDetails}
          />
        </div>
      );
    }

    // Use standard enhanced list view for smaller datasets
    return (
      <EnhancedListView
        items={filteredItems}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        onViewHistory={handleViewHistory}
        onViewDetails={handleViewDetails}
      />
    );
  };

  // Render table view
  const renderTableView = () => {
    // Use virtualized table view for large datasets
    if (useVirtualization && filteredItems.length > 50) {
      return (
        <div style={{ height: "calc(100vh - 300px)" }}>
          <VirtualizedEnhancedTableView
            items={filteredItems}
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
            columnSettings={viewPreferences.columnSettings.table}
          />
        </div>
      );
    }

    // Use standard enhanced table view for smaller datasets
    return (
      <EnhancedTableView
        items={filteredItems}
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
        columnSettings={viewPreferences.columnSettings.table}
      />
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <EnhancedItemsHeader
        selectedFolder={selectedFolder}
        folders={folders}
        setSelectedFolder={setSelectedFolder}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setShowAddModal={setShowAddModal}
        setShowBulkModal={setShowBulkModal}
        setShowImportModal={setShowImportModal}
        setShowExportModal={setShowExportModal}
        handleBulkDelete={handleBulkDelete}
        isFilterPanelOpen={isFilterPanelOpen}
        setIsFilterPanelOpen={setIsFilterPanelOpen}
      />

      {/* Filter Panel */}
      {renderFilterPanel()}

      {/* Active Filters */}
      {renderActiveFilters()}

      {/* View Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} setViewMode={handleViewModeChange} />

          <div className="flex items-center gap-2 ml-4">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <TbDeviceLaptop size={16} />
              <span>Virtualization:</span>
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-virtualization"
                checked={useVirtualization}
                onChange={toggleVirtualization}
                className="sr-only"
              />
              <label
                htmlFor="toggle-virtualization"
                className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                  useVirtualization ? "btn-primary" : ""
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                    useVirtualization ? "translate-x-4" : "translate-x-0"
                  }`}
                ></span>
              </label>
            </div>
            <span className="text-xs text-gray-500">
              {filteredItems.length > 50
                ? useVirtualization
                  ? "On (Recommended)"
                  : "Off (Not recommended for large datasets)"
                : useVirtualization
                ? "On"
                : "Off"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === "grid" && (
            <ColumnCustomizer
              columnSettings={viewPreferences.columnSettings.grid.columns}
              onSave={(newSettings) => {
                updateViewPreferences({
                  columnSettings: {
                    ...viewPreferences.columnSettings,
                    grid: {
                      ...viewPreferences.columnSettings.grid,
                      columns: newSettings,
                    },
                  },
                });
              }}
            />
          )}

          <div className="text-sm text-gray-600">
            {filteredItems.length} items
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {itemsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <TbSearch size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No items found
            </h3>
            <p className="text-gray-500 max-w-md">
              {searchQuery || Object.values(activeFilters).some((v) => v)
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by adding your first item to this folder."}
            </p>
            {(searchQuery || Object.values(activeFilters).some((v) => v)) && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 btn-primary text-white rounded-md hover:btn-primary-hover"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <ViewTransition viewMode={viewMode}>
            {viewMode === "grid" && renderGridView()}
            {viewMode === "list" && renderListView()}
            {viewMode === "table" && renderTableView()}
          </ViewTransition>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddItemModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          folderId={selectedFolder === "all" ? null : selectedFolder}
          onSuccess={() => {
            fetchItems();
            setShowAddModal(false);
          }}
        />
      )}

      {showEditModal && editingItem && (
        <EditItemModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingItem(null);
          }}
          item={editingItem}
          onSuccess={() => {
            fetchItems();
            setShowEditModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {showDeleteModal && deletingItem && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingItem(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Item"
          message={`Are you sure you want to delete "${deletingItem.name}"? This action cannot be undone.`}
        />
      )}

      {showHistoryModal && historyItem && (
        <ItemHistoryModal
          isOpen={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setHistoryItem(null);
          }}
          item={historyItem}
        />
      )}

      {showBulkModal && (
        <BulkOperationsModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          selectedItems={selectedItems}
          onSuccess={() => {
            fetchItems();
            setShowBulkModal(false);
            setSelectedItems([]);
          }}
        />
      )}

      {showImportModal && (
        <BulkImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          folderId={selectedFolder === "all" ? null : selectedFolder}
          onSuccess={() => {
            fetchItems();
            setShowImportModal(false);
          }}
        />
      )}

      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          selectedItems={selectedItems}
          allItems={filteredItems}
        />
      )}

      {/* Item Details Sidebar */}
      {showDetailsSidebar && selectedItemForDetails && (
        <ItemDetailsSidebar
          item={selectedItemForDetails}
          isOpen={showDetailsSidebar}
          onClose={() => {
            setShowDetailsSidebar(false);
            setSelectedItemForDetails(null);
          }}
          onEdit={() => {
            setEditingItem(selectedItemForDetails);
            setShowEditModal(true);
          }}
          onDelete={() => {
            setDeletingItem(selectedItemForDetails);
            setShowDeleteModal(true);
          }}
          onViewHistory={() => {
            setHistoryItem(selectedItemForDetails);
            setShowHistoryModal(true);
          }}
        />
      )}

      {/* Keyboard Shortcuts Guide */}
      <KeyboardShortcutsGuide
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {/* Keyboard Shortcuts Button */}
      <button
        className="fixed bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        onClick={() => setShowKeyboardShortcuts(true)}
        title="Keyboard Shortcuts"
      >
        <TbKeyboard size={24} className="text-gray-700" />
      </button>
    </div>
  );
};

export default PrimarilyItemsTabOptimized;
