import React from "react";
import { TbEdit } from "react-icons/tb";

const ItemContextMenu = ({ item, itemMenuRef, onEdit }) => (
  <div
    ref={itemMenuRef}
    className="absolute right-0 top-8 z-50 bg-white rounded-xl shadow-lg py-2 w-56 flex flex-col animate-fadeIn"
    onClick={(e) => e.stopPropagation()}
    role="menu"
    aria-label="Item actions"
  >
    <button
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 focus:bg-gray-100 focus:outline-none"
      role="menuitem"
      tabIndex={0}
      onClick={() => onEdit && onEdit(item)}
    >
      <TbEdit className="text-lg" /> Edit
    </button>
    {/* Add more item actions here as needed */}
  </div>
);

export default ItemContextMenu;
