import React from "react";
import { TbDotsVertical } from "react-icons/tb";
import ItemContextMenu from "./ItemContextMenu";

const ItemsGrid = ({
  filteredItems,
  openContextMenu,
  handleContextMenuOpen,
  itemMenuRef,
  onEdit,
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 px-2 sm:px-4">
    {filteredItems.map((item) => (
      <div
        key={item.id}
        className="bg-white rounded-xl p-3 flex flex-col h-full w-full border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group relative"
      >
        {/* Badge */}
        {item.isNew && (
          <span className="absolute top-2 left-2 bg-primary-light0 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            NEW
          </span>
        )}

        {/* Image Container (Fixed Aspect Ratio) */}
        <div className="relative w-full pt-[100%] mb-3 overflow-hidden rounded-lg bg-gray-50">
          <img
            src={item.img}
            alt={item.name}
            className="absolute top-0 left-0 w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300?text=No+Image";
            }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow px-1">
          {/* Name */}
          <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 leading-tight min-h-[2.5rem]">
            {item.name}
          </h3>

          {/* Price */}
          <div className="mt-auto">
            <span className="text-base font-bold text-indigo-600">
              PKR {item.value.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          className="absolute top-3 right-3 p-1 bg-white/80 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            handleContextMenuOpen("item", item.id);
          }}
          aria-label="Open item menu"
        >
          <TbDotsVertical size={16} className="text-gray-600" />
        </button>

        {/* Context Menu */}
        {openContextMenu.type === "item" && openContextMenu.id === item.id && (
          <ItemContextMenu
            item={item}
            itemMenuRef={itemMenuRef}
            onEdit={onEdit}
          />
        )}
      </div>
    ))}
  </div>
);

export default ItemsGrid;
