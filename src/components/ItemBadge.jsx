import React from "react";

/**
 * ItemBadge component for displaying status badges with consistent styling
 */
const ItemBadge = ({ type, label, className = "", size = "sm" }) => {
  // Determine badge style based on type
  const getBadgeStyle = () => {
    switch (type) {
      case "success":
        return "bg-primary-light text-[var(--primary-dark)]";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "danger":
        return "bg-green-100 text-green-800";
      case "info":
        return "bg-primary-light text-[var(--primary-dark)]";
      case "neutral":
        return "bg-gray-100 text-gray-800";
      case "primary":
        return "bg-indigo-100 text-indigo-800";
      case "secondary":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Determine size class
  const getSizeClass = () => {
    switch (size) {
      case "xs":
        return "px-1.5 py-0.5 text-xs";
      case "sm":
        return "px-2 py-1 text-xs";
      case "md":
        return "px-2.5 py-1.5 text-sm";
      case "lg":
        return "px-3 py-2 text-sm";
      default:
        return "px-2 py-1 text-xs";
    }
  };

  return (
    <span
      className={`${getBadgeStyle()} ${getSizeClass()} rounded-full font-medium inline-flex items-center ${className}`}
    >
      {label}
    </span>
  );
};

export default ItemBadge;
