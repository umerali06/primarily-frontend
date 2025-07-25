import React, { useState, useEffect } from "react";
import {
  TbGrid3X3,
  TbList,
  TbTable,
  TbLayoutGrid,
  TbLayoutList,
  TbLayoutCards,
} from "react-icons/tb";

const ViewToggle = ({ viewMode, setViewMode }) => {
  const [animating, setAnimating] = useState(false);
  const [previousViewMode, setPreviousViewMode] = useState(viewMode);

  // Handle view mode change with animation
  const handleViewModeChange = (newMode) => {
    if (newMode === viewMode) return;

    setPreviousViewMode(viewMode);
    setAnimating(true);
    setViewMode(newMode);

    // Reset animation state after animation completes
    setTimeout(() => {
      setAnimating(false);
    }, 300);
  };

  // Determine animation direction
  const getAnimationDirection = () => {
    const modes = ["grid", "list", "table"];
    const prevIndex = modes.indexOf(previousViewMode);
    const currentIndex = modes.indexOf(viewMode);

    if (prevIndex < currentIndex) {
      return "animate-slide-right";
    } else {
      return "animate-slide-left";
    }
  };

  return (
    <div className="relative">
      {/* View toggle buttons with enhanced styling */}
      <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => handleViewModeChange("grid")}
          className={`p-2.5 transition-all duration-200 relative ${
            viewMode === "grid"
              ? "btn-primary text-white font-medium px-3"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          aria-label="Grid view"
          title="Grid view"
        >
          <TbLayoutCards
            size={18}
            className="transition-transform duration-200 hover:scale-110"
          />
          <span
            className={`ml-1.5 text-xs font-medium transition-opacity duration-200 ${
              viewMode === "grid" ? "inline-block" : "hidden"
            }`}
          >
            Grid
          </span>
          {viewMode === "grid" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
          )}
        </button>
        <button
          onClick={() => handleViewModeChange("list")}
          className={`p-2.5 transition-all duration-200 relative ${
            viewMode === "list"
              ? "btn-primary text-white font-medium px-3"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          aria-label="List view"
          title="List view"
        >
          <TbLayoutList
            size={18}
            className="transition-transform duration-200 hover:scale-110"
          />
          <span
            className={`ml-1.5 text-xs font-medium transition-opacity duration-200 ${
              viewMode === "list" ? "inline-block" : "hidden"
            }`}
          >
            List
          </span>
          {viewMode === "list" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
          )}
        </button>
        <button
          onClick={() => handleViewModeChange("table")}
          className={`p-2.5 transition-all duration-200 relative ${
            viewMode === "table"
              ? "btn-primary text-white font-medium px-3"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          aria-label="Table view"
          title="Table view"
        >
          <TbLayoutGrid
            size={18}
            className="transition-transform duration-200 hover:scale-110"
          />
          <span
            className={`ml-1.5 text-xs font-medium transition-opacity duration-200 ${
              viewMode === "table" ? "inline-block" : "hidden"
            }`}
          >
            Table
          </span>
          {viewMode === "table" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
          )}
        </button>
      </div>

      {/* Animation indicator */}
      {animating && (
        <div
          className={`absolute -bottom-1 left-0 right-0 flex justify-center ${getAnimationDirection()}`}
        >
          <div className="h-0.5 w-8 btn-primary rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default ViewToggle;
