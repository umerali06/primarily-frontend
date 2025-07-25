import React, { useState, useEffect, useMemo } from "react";
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

const PrimarilyItemsTab = ({ folders, selectedFolder, setSelectedFolder }) => {
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
            "actions",
          ],
          columnWidths: {
            name: 250,
            quantity: 120,
            price: 120,
            location: 150,
            status: 120,
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

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <EnhancedItemsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        selectedItems={selectedItems}
        onBulkDelete={handleBulkDelete}
        onShowBulkModal={() => setShowBulkModal(true)}
        onShowImportModal={() => setShowImportModal(true)}
        onShowExportModal={() => setShowExportModal(true)}
        onShowAddModal={() => setShowAddModal(true)}
        isFilterPanelOpen={isFilterPanelOpen}
        onToggleFilterPanel={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        useVirtualization={useVirtualization}
        onToggleVirtualization={toggleVirtualization}
        totalItems={filteredItems.length}
        folders={folders}
        selectedFolder={selectedFolder}
        onFolderChange={setSelectedFolder}
      />

      {/* Active Filters */}
      {renderActiveFilters()}

      {/* Filter Panel */}
      {renderFilterPanel()}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ViewTransition viewMode={viewMode}>
          {viewMode === "grid" && renderGridView()}
          {viewMode === "list" && renderListView()}
          {viewMode === "table" && renderTableView()}
        </ViewTransition>
      </div>

      {/* Pagination */}
      {itemsPagination && itemsPagination.totalPages > 1 && (
        <div className="flex justify-center items-center py-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(itemsPagination.currentPage - 1)}
              disabled={itemsPagination.currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {itemsPagination.currentPage} of {itemsPagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(itemsPagination.currentPage + 1)}
              disabled={
                itemsPagination.currentPage === itemsPagination.totalPages
              }
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddItemModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={() => {
          setShowAddModal(false);
          fetchItems();
        }}
        folders={folders}
        selectedFolder={selectedFolder}
      />

      <EditItemModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onSave={() => {
          setShowEditModal(false);
          setEditingItem(null);
          fetchItems();
        }}
        folders={folders}
      />

      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingItem(null);
        }}
        onConfirm={confirmDelete}
        itemName={deletingItem?.name}
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
        onClose={() => setShowBulkModal(false)}
        selectedItems={selectedItems}
        onBulkUpdate={(updates) => {
          bulkUpdateItems(selectedItems, updates);
          setShowBulkModal(false);
          setSelectedItems([]);
        }}
        onBulkDelete={() => {
          handleBulkDelete();
          setShowBulkModal(false);
        }}
      />

      <BulkImportModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={() => {
          setShowImportModal(false);
          fetchItems();
        }}
        folders={folders}
        selectedFolder={selectedFolder}
      />

      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        items={filteredItems}
        selectedItems={selectedItems}
      />
    </div>
  );
};

export default PrimarilyItemsTab;
