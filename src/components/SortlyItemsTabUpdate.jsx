import React, { useState, useEffect } from "react";
import PrimarilyItemsTabOptimized from "./PrimarilyItemsTabOptimized";
import useInventory from "../hooks/useInventory";
import "../styles/animations.css";
import "../styles/transitions.css";

/**
 * This component serves as a wrapper for the PrimarilyItemsTabOptimized component
 * It handles fetching folders and other initial data needed for the items dashboard
 *
 * This version uses the optimized components with enhanced list and table views
 * and virtualization for large datasets
 */
const PrimarilyItemsTabUpdate = () => {
  const [selectedFolder, setSelectedFolder] = useState("all");
  const { folders, fetchFolders, foldersLoading } = useInventory();

  // Fetch folders on component mount
  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <div className="h-full">
      {foldersLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600 text-lg">
            Loading dashboard...
          </span>
        </div>
      ) : (
        <PrimarilyItemsTabOptimized
          folders={folders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
        />
      )}
    </div>
  );
};

export default PrimarilyItemsTabUpdate;
