import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import FolderBreadcrumb from "./FolderBreadcrumb";
import useFolders from "../hooks/useFolders";
import {
  TbFolder,
  TbFolderOpen,
  TbChevronRight,
  TbHome,
  TbSearch,
} from "react-icons/tb";
import toast from "react-hot-toast";

const MoveToFolderModal = ({ open, onClose, folder, onMove }) => {
  const [selectedParent, setSelectedParent] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  const { folders, folderHierarchy, moveFolder, fetchFolderHierarchy } =
    useFolders();

  useEffect(() => {
    if (open) {
      fetchFolderHierarchy();
      setSelectedParent(null);
      setCurrentPath([]);
      setSearchTerm("");
      setExpandedFolders(new Set());
    }
  }, [open, fetchFolderHierarchy]);

  // Build folder tree structure
  const buildFolderTree = (folders, parentId = null) => {
    return folders
      .filter((f) => f.parentId === parentId && f._id !== folder?._id) // Exclude the folder being moved
      .map((f) => ({
        ...f,
        children: buildFolderTree(folders, f._id),
      }));
  };

  // Check if a folder is a descendant of the folder being moved
  const isDescendant = (folderId, targetId) => {
    if (!folderId || !targetId) return false;

    const findFolder = (id) => folders.find((f) => f._id === id);
    let current = findFolder(folderId);

    while (current) {
      if (current._id === targetId) return true;
      current = findFolder(current.parentId);
    }

    return false;
  };

  // Filter folders to prevent circular references
  const getValidFolders = () => {
    if (!folder) return [];

    return folders.filter((f) => {
      // Exclude the folder itself
      if (f._id === folder._id) return false;

      // Exclude descendants to prevent circular references
      if (isDescendant(folder._id, f._id)) return false;

      return true;
    });
  };

  const validFolders = getValidFolders();
  const folderTree = buildFolderTree(validFolders);

  // Filter folders based on search term
  const filteredFolders = searchTerm
    ? validFolders.filter((f) =>
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

      const folderData = validFolders.find((f) => f._id === folderId);
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
      const targetFolder = validFolders.find((f) => f._id === folderId);
      if (targetFolder) {
        handleFolderSelect(targetFolder);
      }
    }
  };

  const handleMove = async () => {
    if (!folder) return;

    setIsLoading(true);
    try {
      await moveFolder(folder._id, selectedParent?._id || null);

      if (onMove) {
        onMove(folder, selectedParent);
      }

      const destination = selectedParent ? selectedParent.name : "Root";
      toast.success(`Folder moved to "${destination}" successfully!`);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to move folder");
    } finally {
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
        >
          {folderItem.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(folderItem._id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
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

  if (!folder) return null;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Move Folder"
      maxWidth="max-w-2xl"
      closeOnBackdrop={!isLoading}
    >
      <div className="space-y-4">
        {/* Source Folder Info */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Moving:</span> {folder.name}
          </p>
          <p className="text-xs text-yellow-600 mt-1">
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

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
          />
          <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

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
          >
            <TbHome className="w-5 h-5" />
            <span>Root (No parent folder)</span>
          </button>

          {/* Folder List */}
          <div className="p-2">
            {validFolders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TbFolder className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No available folders</p>
                <p className="text-xs text-gray-400 mt-1">
                  All folders are either the source folder or its descendants
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Moving...
              </>
            ) : (
              "Move Folder"
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default MoveToFolderModal;
