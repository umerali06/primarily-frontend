import React, { useState } from "react";
import {
  TbGrid3X3,
  TbEdit,
  TbHistory,
  TbTrash,
  TbEye,
  TbCopy,
  TbTag,
  TbFolder,
  TbHeart,
  TbHeartFilled,
  TbShare,
  TbDots,
} from "react-icons/tb";
import ImageGallery from "./ImageGallery";
import ItemBadge from "./ItemBadge";

/**
 * Enhanced ItemCard component with improved visual hierarchy and interactions
 */
const ItemCard = ({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onViewHistory,
  onViewDetails,
  showActions = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Toggle favorite status
  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Here you would typically call an API to update the favorite status
  };

  // Format price with currency symbol and thousands separators
  const formatPrice = (price) => {
    if (!price) return null;
    return `PKR ${Number(price).toLocaleString()}`;
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Determine stock status and corresponding style
  const getStockStatus = () => {
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

  const stockStatus = getStockStatus();

  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 shadow hover:shadow-md ${
        isSelected
          ? "ring-2 ring-primary ring-opacity-50 border-[var(--bg-primary)]"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowActionMenu(false);
      }}
      onClick={() => onSelect(item._id)}
    >
      {/* Image Container with Aspect Ratio */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group">
        {item.images && item.images.length > 0 ? (
          <ImageGallery images={item.images} alt={item.name} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <TbGrid3X3 size={40} className="mb-2" />
            <span className="text-xs">No Image</span>
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-2 left-2 bg-primary-light0 text-white rounded-full p-1.5 shadow-sm">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Favorite Button */}
        <button
          className={`absolute top-2 ${
            isSelected ? "left-10" : "left-2"
          } p-1.5 rounded-full transition-colors ${
            isFavorite
              ? "bg-white text-green-500"
              : "bg-black bg-opacity-30 text-white hover:bg-white hover:text-green-500"
          }`}
          onClick={toggleFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? <TbHeartFilled size={16} /> : <TbHeart size={16} />}
        </button>

        {/* Quick Actions Overlay - Visible on Hover */}
        {isHovered && showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-3 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(item);
              }}
              className="p-2.5 bg-white rounded-full text-gray-700 hover:text-primary hover:bg-primary-light transition-colors shadow-sm"
              title="View Details"
            >
              <TbEye size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-2.5 bg-white rounded-full text-gray-700 hover:text-primary hover:bg-primary-light transition-colors shadow-sm"
              title="Edit Item"
            >
              <TbEdit size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="p-2.5 bg-white rounded-full text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors shadow-sm"
              title="Delete Item"
            >
              <TbTrash size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="p-4 space-y-3">
        {/* Category - Small text above name */}
        {item.category && (
          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {item.category}
          </div>
        )}

        {/* Item Name - Heading */}
        <h3
          className="font-semibold text-lg text-gray-900 truncate leading-tight"
          title={item.name || "Unnamed Item"}
        >
          {item.name || "Unnamed Item"}
        </h3>

        {/* Description - Limited to 2 lines */}
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Price - Prominent */}
        {item.price && (
          <div className="text-xl font-bold text-primary">
            {formatPrice(item.price)}
          </div>
        )}

        {/* Quantity and Location */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            <span className="font-medium">Qty:</span> {item.quantity || 0}{" "}
            {item.unit || ""}
          </span>
          {item.location && (
            <span className="text-gray-500 text-xs flex items-center">
              <span className="mr-1">📍</span> {item.location}
            </span>
          )}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between">
          {/* Stock Status */}
          <ItemBadge
            type={stockStatus.type}
            label={stockStatus.label}
            size="sm"
          />

          {/* Creation Date */}
          {item.createdAt && (
            <span className="text-xs text-gray-400">
              {formatDate(item.createdAt)}
            </span>
          )}
        </div>

        {/* Tags */}
        {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <ItemBadge key={index} type="info" label={`#${tag}`} size="xs" />
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

      {/* Action Buttons */}
      {showActions && (
        <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-primary hover:bg-primary-light rounded-md text-xs font-medium transition-colors"
            >
              <TbEdit size={14} /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewHistory(item);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-xs font-medium transition-colors"
            >
              <TbHistory size={14} /> History
            </button>
          </div>

          {/* More Actions Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActionMenu(!showActionMenu);
              }}
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            >
              <TbDots size={16} />
            </button>

            {showActionMenu && (
              <div className="absolute bottom-full right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle duplicate action
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                >
                  <TbCopy size={14} /> Duplicate
                </button>
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle share action
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                >
                  <TbShare size={14} /> Share
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50 text-left"
                >
                  <TbTrash size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
