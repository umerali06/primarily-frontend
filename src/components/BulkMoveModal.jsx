import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import FolderBreadcrumb from "./FolderBreadcrumb";
import useFolders from "../hooks/useFolders";
import useInventory from "../hooks/useInventory";
import {
  TbFolder,
  TbFolderOpen,
  TbChevronRight,
  TbHome,
  TbSearch,
  TbArrowRight,
  TbCheck,
  TbX,
  TbLoader,
  TbAlertCircle,
  TbInfoCircle,
  TbRefresh,
} from "react-icons/tb";
import toast from "react-hot-toast";

const BulkMoveModal = ({ open, onClose, selectedItems = [], onMove }) => {
  const [selectedParent, setSelectedParent] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [moveProgress, setMoveProgress] = useState(0);
  const [moveStatus, setMoveStatus] = useState({
    total: 0,
    completed: 0,
    failed: 0,
    inProgress: false,
  });
  const [errors, setErrors] = useState([]);
  const [recentFolders, setRecentFolders] = useState([]);

  const { folders, folderHierarchy, fetchFolderHierarchy } = useFolders();
  const { bulkUpdateItems } = useInventory();

  useEffect(() => {
    if (open) {
      fetchFolderHierarchy();
      setSelectedParent(null);
      setCurrentPath([]);
      setSearchTerm("");
      setExpandedFolders(new Set());
      setMoveProgress(0);
      setMoveStatus({
        total: selectedItems.length,
        completed: 0,
        failed: 0,
        inProgress: false,
      });
      setErrors([]);

      // Load recent folders from localStorage
      try {
        const savedRecentFolders = localStorage.getItem("recentFolders");
        if (savedRecentFolders) {
          setRecentFolders(JSON.parse(savedRecentFolders));
        }
      } catch (error) {
        console.error("Error loading recent folders:", error);
      }
    }
  }, [open, fetchFolderHierarchy, selectedItems]);

  // Build folder tree structure
  const buildFolderTree = (folders, parentId = null) => {
    return folders
      .filter((f) => f.parentId === parentId)
      .map((f) => ({
        ...f,
        children: buildFolderTree(folders, f._id),
      }));
  };

  const folderTree = buildFolderTree(folders);

  // Filter folders based on search term
  const filteredFolders = searchTerm
    ? folders.filter((f) =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : folderTree;

  const toggleExpanded = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFolderSelect = (selectedFolder) => {
    setSelectedParent(selectedFolder);

    // Build path to selected folder
    const buildPath = (folderId) => {
      if (!folderId) return [];

      const folderData = folders.find((f) => f._id === folderId);
      if (!folderData) return [];

      const parentPath = buildPath(folderData.parentId);
      return [...parentPath, folderData];
    };

    setCurrentPath(buildPath(selectedFolder._id));
  };

  const handleBreadcrumbNavigate = (folderId) => {
    if (folderId === null) {
      setSelectedParent(null);
      setCurrentPath([]);
    } else {
      const targetFolder = folders.find((f) => f._id === folderId);
      if (targetFolder) {
        handleFolderSelect(targetFolder);
      }
    }
  };

  const addToRecentFolders = (folder) => {
    try {
      // Add to recent folders (max 5)
      let updatedRecent = recentFolders.filter((f) => f._id !== folder._id);
      updatedRecent.unshift(folder);
      updatedRecent = updatedRecent.slice(0, 5);

      setRecentFolders(updatedRecent);
      localStorage.setItem("recentFolders", JSON.stringify(updatedRecent));
    } catch (error) {
      console.error("Error saving recent folders:", error);
    }
  };

  const handleMove = async () => {
    if (selectedItems.length === 0) return;

    setIsLoading(true);
    setMoveStatus({
      total: selectedItems.length,
      completed: 0,
      failed: 0,
      inProgress: true,
    });
    setErrors([]);

    const destination = selectedParent ? selectedParent._id : null;
    const destinationName = selectedParent ? selectedParent.name : "Root";

    try {
      // If selected folder, add to recent folders
      if (selectedParent) {
        addToRecentFolders(selectedParent);
      }

      // Get all item IDs
      const itemIds = selectedItems.map((item) => item._id);

      // Process in batches of 20 items
      const batchSize = 20;
      const batches = [];

      for (let i = 0; i < itemIds.length; i += batchSize) {
        batches.push(itemIds.slice(i, i + batchSize));
      }

      const failedItems = [];

      // Process each batch
      for (let i = 0; i < batches.length; i++) {
        const batchIds = batches[i];
        try {
          await bulkUpdateItems(batchIds, { folderId: destination });

          // Update progress
          setMoveStatus((prev) => ({
            ...prev,
            completed: prev.completed + batchIds.length,
          }));

          // Calculate progress percentage
          const progressPercent = Math.round(((i + 1) / batches.length) * 100);
          setMoveProgress(progressPercent);
        } catch (error) {
          console.error(`Error moving batch ${i}:`, error);

          // Add failed items
          failedItems.push(...batchIds);

          // Update failed count
          setMoveStatus((prev) => ({
            ...prev,
            failed: prev.failed + batchIds.length,
          }));

          // Add error
          setErrors((prev) => [
            ...prev,
            `Failed to move batch ${i + 1}: ${
              error.message || "Unknown error"
            }`,
          ]);
        }
      }

      // Show success/failure message
      if (failedItems.length === 0) {
        toast.success(
          `Successfully moved ${selectedItems.length} items to "${destinationName}"`
        );

        if (onMove) {
          onMove(selectedItems, selectedParent);
        }

        // Close after a short delay to show completion
        setTimeout(() => {
          onClose();
        }, 1000);
      } else if (failedItems.length < selectedItems.length) {
        toast.success(
          `Moved ${
            selectedItems.length - failedItems.length
          } items to "${destinationName}". ${failedItems.length} items failed.`
        );
      } else {
        toast.error(`Failed to move items to "${destinationName}"`);
      }
    } catch (error) {
      console.error("Error in bulk move operation:", error);
      toast.error(error.response?.data?.message || "Failed to move items");

      setErrors((prev) => [
        ...prev,
        `Operation failed: ${error.message || "Unknown error"}`,
      ]);
    } finally {
      setMoveStatus((prev) => ({
        ...prev,
        inProgress: false,
      }));
      setIsLoading(false);
    }
  };

  const renderFolderTree = (folders, level = 0) => {
    return folders.map((folderItem) => (
      <div key={folderItem._id}>
        <button
          onClick={() => handleFolderSelect(folderItem)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors duration-150 ${
            selectedParent?._id === folderItem._id
              ? "bg-primary-light text-primary font-medium"
              : "text-gray-700"
          }`}
          style={{ paddingLeft: `${12 + level * 20}px` }}
          disabled={isLoading || moveStatus.inProgress}
        >
          {folderItem.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(folderItem._id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
              disabled={isLoading || moveStatus.inProgress}
            >
              <TbChevronRight
                className={`w-4 h-4 transition-transform duration-150 ${
                  expandedFolders.has(folderItem._id) ? "rotate-90" : ""
                }`}
              />
            </button>
          )}

          {selectedParent?._id === folderItem._id ? (
            <TbFolderOpen className="w-5 h-5 text-primary" />
          ) : (
            <TbFolder className="w-5 h-5 text-gray-400" />
          )}

          <span className="flex-1 truncate">{folderItem.name}</span>
          <span className="text-xs text-gray-400">
            ({folderItem.itemCount || 0})
          </span>
        </button>

        {expandedFolders.has(folderItem._id) &&
          folderItem.children.length > 0 && (
            <div className="ml-4">
              {renderFolderTree(folderItem.children, level + 1)}
            </div>
          )}
      </div>
    ));
  };

  const renderSearchResults = () => {
    return filteredFolders.map((folderItem) => (
      <button
        key={folderItem._id}
        onClick={() => handleFolderSelect(folderItem)}
        className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors duration-150 ${
          selectedParent?._id === folderItem._id
            ? "bg-primary-light text-primary font-medium"
            : "text-gray-700"
        }`}
        disabled={isLoading || moveStatus.inProgress}
      >
        {selectedParent?._id === folderItem._id ? (
          <TbFolderOpen className="w-5 h-5 text-primary" />
        ) : (
          <TbFolder className="w-5 h-5 text-gray-400" />
        )}

        <span className="flex-1 truncate">{folderItem.name}</span>
        <span className="text-xs text-gray-400">
          ({folderItem.itemCount || 0})
        </span>
      </button>
    ));
  };

  const renderProgressBar = () => {
    return (
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">Moving items...</span>
          <span>{moveProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="btn-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${moveProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{moveStatus.completed} completed</span>
          {moveStatus.failed > 0 && (
            <span className="text-green-500">{moveStatus.failed} failed</span>
          )}
          <span>{moveStatus.total} total</span>
        </div>
      </div>
    );
  };

  const renderRecentFolders = () => {
    if (recentFolders.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Recent Folders
        </h3>
        <div className="flex flex-wrap gap-2">
          {recentFolders.map((folder) => (
            <button
              key={folder._id}
              onClick={() => handleFolderSelect(folder)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              disabled={isLoading || moveStatus.inProgress}
            >
              <TbFolder className="w-4 h-4" />
              <span>{folder.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!open) return null;

  return (
    <BaseModal
      open={open}
      onClose={moveStatus.inProgress ? null : onClose}
      title="Move Items"
      maxWidth="max-w-2xl"
      closeOnBackdrop={!isLoading && !moveStatus.inProgress}
      zIndex="z-[60]"
    >
      <div className="space-y-4">
        {/* Source Items Info */}
        <div className="p-3 bg-primary-light border border-[var(--bg-primary)] rounded-lg">
          <p className="text-sm text-[var(--primary-dark)]">
            <span className="font-medium">Moving:</span> {selectedItems.length}{" "}
            items
          </p>
          <p className="text-xs text-primary mt-1">
            Select a destination folder or choose root to move to the top level.
          </p>
        </div>

        {/* Current Selection */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Destination:</p>
          <FolderBreadcrumb
            currentPath={currentPath}
            onNavigate={handleBreadcrumbNavigate}
          />
          {!selectedParent && (
            <p className="text-xs text-gray-500 mt-1">
              Will be moved to root level (no parent folder)
            </p>
          )}
        </div>

        {/* Recent Folders */}
        {renderRecentFolders()}

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
            disabled={isLoading || moveStatus.inProgress}
          />
          <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Progress Bar (when moving) */}
        {moveStatus.inProgress && renderProgressBar()}

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="border border-red-200 rounded-lg bg-green-50 p-3">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <TbAlertCircle className="w-5 h-5" />
              <span className="font-medium">Errors occurred</span>
            </div>
            <ul className="text-sm text-green-600 space-y-1 max-h-24 overflow-y-auto">
              {errors.map((error, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-500">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Folder Tree */}
        <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
          {/* Root Option */}
          <button
            onClick={() => {
              setSelectedParent(null);
              setCurrentPath([]);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 border-b border-gray-100 transition-colors duration-150 ${
              !selectedParent
                ? "bg-primary-light text-primary font-medium"
                : "text-gray-700"
            }`}
            disabled={isLoading || moveStatus.inProgress}
          >
            <TbHome className="w-5 h-5" />
            <span>Root (No parent folder)</span>
          </button>

          {/* Folder List */}
          <div className="p-2">
            {folders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TbFolder className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No available folders</p>
                <p className="text-xs text-gray-400 mt-1">
                  Create folders to organize your items
                </p>
              </div>
            ) : searchTerm ? (
              <div className="space-y-1">
                {filteredFolders.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">
                    No folders found
                  </p>
                ) : (
                  renderSearchResults()
                )}
              </div>
            ) : (
              <div className="space-y-1">{renderFolderTree(folderTree)}</div>
            )}
          </div>
        </div>

        {/* Selected Items Preview */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Selected Items ({selectedItems.length})
          </h3>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
            {selectedItems.slice(0, 50).map((item, index) => (
              <div
                key={item._id}
                className={`flex items-center gap-3 p-2 ${
                  index !== Math.min(selectedItems.length - 1, 49)
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="w-6 h-6 bg-primary-light rounded-full flex items-center justify-center">
                  <TbCheck className="text-primary" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
            {selectedItems.length > 50 && (
              <div className="p-2 text-center text-sm text-gray-500">
                ...and {selectedItems.length - 50} more items
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={isLoading || moveStatus.inProgress}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            disabled={isLoading || moveStatus.inProgress}
            className="w-full sm:w-auto px-6 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading || moveStatus.inProgress ? (
              <>
                <TbLoader className="w-4 h-4 animate-spin" />
                Moving...
              </>
            ) : (
              <>
                <TbArrowRight className="w-4 h-4" />
                Move {selectedItems.length} Items
              </>
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default BulkMoveModal;
