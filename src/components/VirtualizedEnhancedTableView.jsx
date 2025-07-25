import React, {
  useState,
  useCallback,
  memo,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  TbGrid3X3,
  TbEdit,
  TbHistory,
  TbTrash,
  TbEye,
  TbArrowUp,
  TbArrowDown,
  TbSettings,
  TbPin,
  TbPinnedOff,
  TbGripVertical,
} from "react-icons/tb";
import ItemBadge from "./ItemBadge";
import ResizableColumn from "./ResizableColumn";
import VirtualizedTable from "./VirtualizedTable";
import { createTableKeyboardHandler } from "../utils/keyboardNavUtils";

// Memoized table row component for better performance
const TableRow = memo(
  ({
    item,
    selectedItems,
    onSelectItem,
    onEditItem,
    onDeleteItem,
    onViewHistory,
    onViewDetails,
    visibleColumns,
    getImageUrl,
    formatPrice,
    formatDate,
    getStockStatus,
  }) => {
    if (!item || !item._id) return null;

    const stockStatus = getStockStatus(item);
    const isSelected = selectedItems.includes(item._id);

    return (
      <tr
        className={`hover:bg-gray-50 ${isSelected ? "bg-primary-light" : ""}`}
        onClick={() => onSelectItem(item._id)}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectItem(item._id)}
            className="h-5 w-5 text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 border-gray-300 rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </td>

        {visibleColumns.includes("name") && (
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                {getImageUrl(item) ? (
                  <img
                    src={getImageUrl(item)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <TbGrid3X3 size={16} />
                  </div>
                )}
                <div
                  className="w-full h-full flex items-center justify-center text-gray-400"
                  style={{ display: "none" }}
                >
                  <TbGrid3X3 size={16} />
                </div>
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
        )}

        {visibleColumns.includes("quantity") && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {item.quantity || 0} {item.unit || ""}
          </td>
        )}

        {visibleColumns.includes("price") && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {formatPrice(item.price)}
          </td>
        )}

        {visibleColumns.includes("location") && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {item.location || "-"}
          </td>
        )}

        {visibleColumns.includes("status") && (
          <td className="px-6 py-4 whitespace-nowrap">
            <ItemBadge
              type={stockStatus.type}
              label={stockStatus.label}
              size="sm"
            />
          </td>
        )}

        {visibleColumns.includes("tags") && (
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex flex-wrap gap-1">
              {item.tags && Array.isArray(item.tags) && item.tags.length > 0 ? (
                <>
                  {item.tags.slice(0, 2).map((tag, index) => (
                    <ItemBadge
                      key={index}
                      type="info"
                      label={`#${tag}`}
                      size="xs"
                    />
                  ))}
                  {item.tags.length > 2 && (
                    <ItemBadge
                      type="neutral"
                      label={`+${item.tags.length - 2}`}
                      size="xs"
                    />
                  )}
                </>
              ) : (
                <span className="text-gray-400 text-sm">-</span>
              )}
            </div>
          </td>
        )}

        {visibleColumns.includes("createdAt") && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatDate(item.createdAt)}
          </td>
        )}

        {visibleColumns.includes("updatedAt") && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatDate(item.updatedAt)}
          </td>
        )}

        {visibleColumns.includes("actions") && (
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
            <div className="flex justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(item);
                }}
                className="text-gray-500 hover:text-primary"
                title="View Details"
              >
                <TbEye size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditItem(item);
                }}
                className="text-gray-500 hover:text-primary"
                title="Edit Item"
              >
                <TbEdit size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewHistory(item);
                }}
                className="text-gray-500 hover:text-primary"
                title="View History"
              >
                <TbHistory size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item);
                }}
                className="text-gray-500 hover:text-green-600"
                title="Delete Item"
              >
                <TbTrash size={18} />
              </button>
            </div>
          </td>
        )}
      </tr>
    );
  }
);

/**
 * Enhanced table view component with virtualization for large datasets
 */
const VirtualizedEnhancedTableView = ({
  items,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onEditItem,
  onDeleteItem,
  onViewHistory,
  onViewDetails,
  sortBy,
  sortOrder,
  onSort,
  columnSettings = {
    visibleColumns: [
      "name",
      "quantity",
      "price",
      "location",
      "status",
      "actions",
    ],
    columnWidths: {},
    frozenColumns: ["name"],
  },
}) => {
  const tableRef = useRef(null);

  // Set up keyboard navigation
  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    const handleKeyDown = createTableKeyboardHandler({
      items,
      selectedItems,
      onSelectItem,
      onSelectAll,
      onDeleteItem,
      onEditItem,
      onViewDetails,
      onSort,
      sortBy,
      sortOrder,
    });

    table.addEventListener("keydown", handleKeyDown);

    // Focus the table to enable keyboard navigation
    if (items.length > 0 && !table.contains(document.activeElement)) {
      table.tabIndex = -1;
      table.focus();
    }

    return () => {
      table.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    items,
    selectedItems,
    onSelectItem,
    onSelectAll,
    onDeleteItem,
    onEditItem,
    onViewDetails,
    onSort,
    sortBy,
    sortOrder,
  ]);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [localColumnSettings, setLocalColumnSettings] =
    useState(columnSettings);
  const [draggingColumn, setDraggingColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [columnWidths, setColumnWidths] = useState(
    columnSettings.columnWidths || {}
  );

  // All available columns
  const allColumns = [
    { id: "name", label: "Name", required: true },
    { id: "quantity", label: "Quantity" },
    { id: "price", label: "Price" },
    { id: "location", label: "Location" },
    { id: "status", label: "Status" },
    { id: "tags", label: "Tags" },
    { id: "createdAt", label: "Created" },
    { id: "updatedAt", label: "Updated" },
    { id: "actions", label: "Actions", required: true },
  ];

  // Format price with currency symbol and thousands separators
  const formatPrice = useCallback((price) => {
    if (!price) return "-";
    return `PKR ${Number(price).toLocaleString()}`;
  }, []);

  // Format date to a more readable format
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  // Determine stock status and corresponding style
  const getStockStatus = useCallback((item) => {
    const quantity = item.quantity || 0;
    const minLevel = item.minLevel || 0;

    if (quantity <= 0) {
      return {
        label: "Out of Stock",
        type: "danger",
      };
    } else if (quantity <= minLevel) {
      return {
        label: "Low Stock",
        type: "warning",
      };
    } else {
      return {
        label: "In Stock",
        type: "success",
      };
    }
  }, []);

  // Get image URL based on different formats
  const getImageUrl = useCallback((item) => {
    if (!item.images || item.images.length === 0) return null;

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
  }, []);

  // Handle column drag start
  const handleDragStart = (column) => {
    setDraggingColumn(column);
  };

  // Handle column drag over
  const handleDragOver = (e, column) => {
    e.preventDefault();
    setDragOverColumn(column);
  };

  // Handle column drop
  const handleDrop = (e) => {
    e.preventDefault();

    if (draggingColumn && dragOverColumn && draggingColumn !== dragOverColumn) {
      const visibleColumns = [...localColumnSettings.visibleColumns];
      const fromIndex = visibleColumns.indexOf(draggingColumn);
      const toIndex = visibleColumns.indexOf(dragOverColumn);

      if (fromIndex !== -1 && toIndex !== -1) {
        visibleColumns.splice(fromIndex, 1);
        visibleColumns.splice(toIndex, 0, draggingColumn);

        setLocalColumnSettings({
          ...localColumnSettings,
          visibleColumns,
        });
      }
    }

    setDraggingColumn(null);
    setDragOverColumn(null);
  };

  // Toggle column visibility
  const toggleColumnVisibility = (columnId) => {
    const column = allColumns.find((col) => col.id === columnId);
    if (column?.required) return; // Can't toggle required columns

    const visibleColumns = [...localColumnSettings.visibleColumns];
    const index = visibleColumns.indexOf(columnId);

    if (index === -1) {
      // Add column
      visibleColumns.push(columnId);
    } else {
      // Remove column
      visibleColumns.splice(index, 1);
    }

    setLocalColumnSettings({
      ...localColumnSettings,
      visibleColumns,
    });
  };

  // Handle column resize
  const handleColumnResize = useCallback((columnId, width) => {
    setColumnWidths((prev) => ({
      ...prev,
      [columnId]: width,
    }));
  }, []);

  // Save column settings
  const saveColumnSettings = () => {
    // Here you would typically call an API or update a state in a parent component
    const updatedSettings = {
      ...localColumnSettings,
      columnWidths,
    };
    // For now, we'll just close the settings panel
    setShowColumnSettings(false);
  };

  // Reset column settings
  const resetColumnSettings = () => {
    setLocalColumnSettings(columnSettings);
    setColumnWidths(columnSettings.columnWidths || {});
  };

  // Toggle column frozen state
  const toggleColumnFrozen = (columnId) => {
    const frozenColumns = [...(localColumnSettings.frozenColumns || [])];
    const index = frozenColumns.indexOf(columnId);

    if (index === -1) {
      // Add column to frozen columns
      frozenColumns.push(columnId);
    } else {
      // Remove column from frozen columns
      frozenColumns.splice(index, 1);
    }

    setLocalColumnSettings({
      ...localColumnSettings,
      frozenColumns,
    });
  };

  // Check if a column is frozen
  const isColumnFrozen = (columnId) => {
    return (localColumnSettings.frozenColumns || []).includes(columnId);
  };

  // Render column settings panel
  const renderColumnSettings = () => {
    if (!showColumnSettings) return null;

    return (
      <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-72">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-800">Column Settings</h3>
          <button
            onClick={() => setShowColumnSettings(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <TbArrowUp size={18} />
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {allColumns.map((column) => (
            <div
              key={column.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              draggable={localColumnSettings.visibleColumns.includes(column.id)}
              onDragStart={() => handleDragStart(column.id)}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDrop={handleDrop}
            >
              <div className="flex items-center">
                {localColumnSettings.visibleColumns.includes(column.id) && (
                  <TbGripVertical
                    size={16}
                    className="mr-2 text-gray-400 cursor-grab"
                  />
                )}
                <span className="text-sm">{column.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {localColumnSettings.visibleColumns.includes(column.id) && (
                  <button
                    onClick={() => toggleColumnFrozen(column.id)}
                    className={`p-1 rounded-md ${
                      isColumnFrozen(column.id)
                        ? "text-primary hover:text-primary bg-primary-light"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    }`}
                    title={
                      isColumnFrozen(column.id)
                        ? "Unfreeze column"
                        : "Freeze column"
                    }
                  >
                    {isColumnFrozen(column.id) ? (
                      <TbPin size={14} />
                    ) : (
                      <TbPinnedOff size={14} />
                    )}
                  </button>
                )}
                <input
                  type="checkbox"
                  checked={localColumnSettings.visibleColumns.includes(
                    column.id
                  )}
                  onChange={() => toggleColumnVisibility(column.id)}
                  disabled={column.required}
                  className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 border-gray-300 rounded"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={resetColumnSettings}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
          >
            Reset
          </button>
          <button
            onClick={saveColumnSettings}
            className="px-3 py-1.5 btn-primary text-white rounded-md hover:btn-primary-hover text-sm"
          >
            Apply
          </button>
        </div>
      </div>
    );
  };

  // Check if a column is visible
  const isColumnVisible = (columnId) => {
    return localColumnSettings.visibleColumns.includes(columnId);
  };

  // Get frozen columns
  const getFrozenColumns = () => {
    return localColumnSettings.frozenColumns || [];
  };

  // Calculate frozen columns width
  const getFrozenColumnsWidth = () => {
    const frozenCols = getFrozenColumns();
    return frozenCols.reduce((total, colId) => {
      return total + (columnWidths[colId] || 150);
    }, 0);
  };

  // Memoize the table header to prevent unnecessary re-renders
  const tableHeader = useMemo(
    () => (
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left">
            <input
              type="checkbox"
              checked={
                selectedItems.length === items.length && items.length > 0
              }
              onChange={onSelectAll}
              className="h-5 w-5 text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 border-gray-300 rounded"
            />
          </th>

          {isColumnVisible("name") && (
            <ResizableColumn
              width={columnWidths.name || 250}
              onResize={handleColumnResize}
              columnId="name"
            >
              <div
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  isColumnFrozen("name") ? "flex items-center" : ""
                }`}
              >
                {isColumnFrozen("name") && (
                  <TbPin size={14} className="text-primary mr-1" />
                )}
                <button
                  onClick={() => onSort("name")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Name
                  {sortBy === "name" && (
                    <span>
                      {sortOrder === "asc" ? (
                        <TbArrowUp size={14} />
                      ) : (
                        <TbArrowDown size={14} />
                      )}
                    </span>
                  )}
                </button>
              </div>
            </ResizableColumn>
          )}

          {isColumnVisible("quantity") && (
            <ResizableColumn
              width={columnWidths.quantity || 120}
              onResize={handleColumnResize}
              columnId="quantity"
            >
              <div
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  isColumnFrozen("quantity") ? "flex items-center" : ""
                }`}
              >
                {isColumnFrozen("quantity") && (
                  <TbPin size={14} className="text-primary mr-1" />
                )}
                <button
                  onClick={() => onSort("quantity")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Quantity
                  {sortBy === "quantity" && (
                    <span>
                      {sortOrder === "asc" ? (
                        <TbArrowUp size={14} />
                      ) : (
                        <TbArrowDown size={14} />
                      )}
                    </span>
                  )}
                </button>
              </div>
            </ResizableColumn>
          )}

          {isColumnVisible("price") && (
            <ResizableColumn
              width={columnWidths.price || 120}
              onResize={handleColumnResize}
              columnId="price"
            >
              <div
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  isColumnFrozen("price") ? "flex items-center" : ""
                }`}
              >
                {isColumnFrozen("price") && (
                  <TbPin size={14} className="text-primary mr-1" />
                )}
                <button
                  onClick={() => onSort("price")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Price
                  {sortBy === "price" && (
                    <span>
                      {sortOrder === "asc" ? (
                        <TbArrowUp size={14} />
                      ) : (
                        <TbArrowDown size={14} />
                      )}
                    </span>
                  )}
                </button>
              </div>
            </ResizableColumn>
          )}

          {isColumnVisible("location") && (
            <ResizableColumn
              width={columnWidths.location || 150}
              onResize={handleColumnResize}
              columnId="location"
            >
              <div
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  isColumnFrozen("location") ? "flex items-center" : ""
                }`}
              >
                {isColumnFrozen("location") && (
                  <TbPin size={14} className="text-primary mr-1" />
                )}
                Location
              </div>
            </ResizableColumn>
          )}

          {isColumnVisible("status") && (
            <ResizableColumn
              width={columnWidths.status || 120}
              onResize={handleColumnResize}
              columnId="status"
            >
              <div
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  isColumnFrozen("status") ? "flex items-center" : ""
                }`}
              >
                {isColumnFrozen("status") && (
                  <TbPin size={14} className="text-primary mr-1" />
                )}
                Status
              </div>
            </ResizableColumn>
          )}

          {isColumnVisible("tags") && (
            <ResizableColumn
              width={columnWidths.tags || 150}
              onResize={handleColumnResize}
              columnId="tags"
            >
              <div
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  isColumnFrozen("tags") ? "flex items-center" : ""
                }`}
              >
                {isColumnFrozen("tags") && (
                  <TbPin size={14} className="text-primary mr-1" />
                )}
                Tags
              </div>
            </ResizableColumn>
          )}

          {isColumnVisible("createdAt") && (
            <ResizableColumn
              width={columnWidths.createdAt || 150}
              onResize={handleColumnResize}
              columnId="createdAt"
            >
              <div
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  isColumnFrozen("createdAt") ? "flex items-center" : ""
                }`}
              >
                {isColumnFrozen("createdAt") && (
                  <TbPin size={14} className="text-primary mr-1" />
                )}
                <button
                  onClick={() => onSort("createdAt")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Created
                  {sortBy === "createdAt" && (
                    <span>
                      {sortOrder === "asc" ? (
                        <TbArrowUp size={14} />
                      ) : (
                        <TbArrowDown size={14} />
                      )}
                    </span>
                  )}
                </button>
              </div>
            </ResizableColumn>
          )}

          {isColumnVisible("updatedAt") && (
            <ResizableColumn
              width={columnWidths.updatedAt || 150}
              onResize={handleColumnResize}
              columnId="updatedAt"
            >
              <div
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  isColumnFrozen("updatedAt") ? "flex items-center" : ""
                }`}
              >
                {isColumnFrozen("updatedAt") && (
                  <TbPin size={14} className="text-primary mr-1" />
                )}
                <button
                  onClick={() => onSort("updatedAt")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Updated
                  {sortBy === "updatedAt" && (
                    <span>
                      {sortOrder === "asc" ? (
                        <TbArrowUp size={14} />
                      ) : (
                        <TbArrowDown size={14} />
                      )}
                    </span>
                  )}
                </button>
              </div>
            </ResizableColumn>
          )}

          {isColumnVisible("actions") && (
            <ResizableColumn
              width={columnWidths.actions || 120}
              onResize={handleColumnResize}
              columnId="actions"
            >
              <div className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                <button
                  onClick={() => setShowColumnSettings(!showColumnSettings)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded-md"
                  title="Column Settings"
                >
                  <TbSettings size={16} />
                </button>
                {renderColumnSettings()}
              </div>
            </ResizableColumn>
          )}
        </tr>
      </thead>
    ),
    [
      columnWidths,
      localColumnSettings,
      selectedItems,
      items.length,
      onSelectAll,
      onSort,
      sortBy,
      sortOrder,
      showColumnSettings,
    ]
  );

  // Render row function for virtualized table
  const renderRow = useCallback(
    (item, index) => {
      return (
        <TableRow
          key={item._id || index}
          item={item}
          selectedItems={selectedItems}
          onSelectItem={onSelectItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          onViewHistory={onViewHistory}
          onViewDetails={onViewDetails}
          visibleColumns={localColumnSettings.visibleColumns}
          getImageUrl={getImageUrl}
          formatPrice={formatPrice}
          formatDate={formatDate}
          getStockStatus={getStockStatus}
        />
      );
    },
    [
      selectedItems,
      onSelectItem,
      onEditItem,
      onDeleteItem,
      onViewHistory,
      onViewDetails,
      localColumnSettings.visibleColumns,
      getImageUrl,
      formatPrice,
      formatDate,
      getStockStatus,
    ]
  );

  return (
    <div
      ref={tableRef}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
      tabIndex="-1"
      aria-label="Virtualized items table"
      role="grid"
    >
      <div className="overflow-x-auto relative">
        {/* Shadow for frozen columns */}
        {getFrozenColumns().length > 0 && (
          <div
            className="absolute top-0 bottom-0 z-10 pointer-events-none"
            style={{
              left: `${getFrozenColumnsWidth()}px`,
              width: "8px",
              boxShadow: "0 0 6px rgba(0,0,0,0.15)",
            }}
          ></div>
        )}

        <VirtualizedTable
          items={items}
          renderRow={renderRow}
          headerContent={tableHeader}
          rowHeight={60}
          overscan={10}
        />
      </div>
    </div>
  );
};

export default VirtualizedEnhancedTableView;
