import React, { useEffect, useRef } from "react";
import {
  TbGrid3X3,
  TbEdit,
  TbHistory,
  TbTrash,
  TbEye,
  TbChevronRight,
  TbTag,
  TbFolder,
  TbDots,
} from "react-icons/tb";
import { createListKeyboardHandler } from "../utils/keyboardNavUtils";
import ItemBadge from "./ItemBadge";

/**
 * Enhanced list view component with improved information density and visual design
 */
const EnhancedListView = ({
  items,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onEditItem,
  onDeleteItem,
  onViewHistory,
  onViewDetails,
}) => {
  const containerRef = useRef(null);

  // Set up keyboard navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = createListKeyboardHandler({
      items,
      selectedItems,
      onSelectItem,
      onSelectAll,
      onDeleteItem,
      onEditItem,
      onViewDetails,
    });

    container.addEventListener("keydown", handleKeyDown);

    // Focus the container to enable keyboard navigation
    if (items.length > 0 && !container.contains(document.activeElement)) {
      container.tabIndex = -1;
      container.focus();
    }

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    items,
    selectedItems,
    onSelectItem,
    onSelectAll,
    onDeleteItem,
    onEditItem,
    onViewDetails,
  ]);
  // Format price with currency symbol and thousands separators
  const formatPrice = (price) => {
    if (!price) return "-";
    return `PKR ${Number(price).toLocaleString()}`;
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Determine stock status and corresponding style
  const getStockStatus = (item) => {
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
  };

  // Get image URL based on different formats
  const getImageUrl = (item) => {
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
  };

  return (
    <div
      ref={containerRef}
      className="space-y-2"
      tabIndex="-1"
      aria-label="Items list"
      role="list"
    >
      {items.map((item) => {
        if (!item || !item._id) return null;

        const stockStatus = getStockStatus(item);

        return (
          <div
            key={item._id}
            className={`bg-white border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 ${
              selectedItems.includes(item._id)
                ? "ring-2 ring-primary ring-opacity-50 border-[var(--bg-primary)]"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className="flex items-stretch cursor-pointer"
              onClick={() => onSelectItem(item._id)}
            >
              {/* Checkbox */}
              <div className="flex items-center justify-center px-4 border-r border-gray-100">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => onSelectItem(item._id)}
                  className="h-5 w-5 text-primary focus:ring-primary ring-opacity-50 border-gray-300 rounded"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Item Image */}
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                {getImageUrl(item) ? (
                  <img
                    src={getImageUrl(item)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const fallback = e.target.nextSibling;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <TbGrid3X3 size={20} />
                  </div>
                )}
                <div
                  className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400"
                  style={{ display: "none" }}
                >
                  <TbGrid3X3 size={20} />
                </div>
              </div>

              {/* Item Info */}
              <div className="flex-1 p-4 flex items-center">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-800 truncate mr-2">
                      {item.name || "Unnamed Item"}
                    </h3>
                    <ItemBadge
                      type={stockStatus.type}
                      label={stockStatus.label}
                      size="xs"
                    />
                  </div>

                  <p className="text-sm text-gray-600 truncate mt-1">
                    {item.description || ""}
                  </p>

                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>
                      <span className="font-medium">Qty:</span>{" "}
                      {item.quantity || 0} {item.unit || ""}
                    </span>
                    {item.price && <span>{formatPrice(item.price)}</span>}
                    {item.location && <span>📍 {item.location}</span>}
                    {item.createdAt && (
                      <span className="text-gray-400 text-xs">
                        Added: {formatDate(item.createdAt)}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {item.tags &&
                    Array.isArray(item.tags) &&
                    item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <ItemBadge
                            key={index}
                            type="info"
                            label={`#${tag}`}
                            size="xs"
                          />
                        ))}
                        {item.tags.length > 3 && (
                          <ItemBadge
                            type="neutral"
                            label={`+${item.tags.length - 3} more`}
                            size="xs"
                          />
                        )}
                      </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(item);
                    }}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary-light rounded-full transition-colors"
                    title="View Details"
                  >
                    <TbEye size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditItem(item);
                    }}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary-light rounded-full transition-colors"
                    title="Edit Item"
                  >
                    <TbEdit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewHistory(item);
                    }}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary-light rounded-full transition-colors"
                    title="View History"
                  >
                    <TbHistory size={18} />
                  </button>
                  <div className="relative group">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-primary-light rounded-full transition-colors"
                      title="More Actions"
                    >
                      <TbDots size={18} />
                    </button>
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 hidden group-hover:block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle move to folder action
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                      >
                        <TbFolder size={14} /> Move to...
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle add tags action
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                      >
                        <TbTag size={14} /> Add Tags
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50 text-left"
                      >
                        <TbTrash size={14} /> Delete
                      </button>
                    </div>
                  </div>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(item);
                    }}
                  >
                    <TbChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EnhancedListView;
