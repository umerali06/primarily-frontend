import React, { useState, useEffect } from "react";
import { TbFolder, TbChevronDown } from "react-icons/tb";
import useFolders from "../hooks/useFolders";

const FolderDropdown = ({
  value,
  onChange,
  excludeId = null,
  disabled = false,
  error = null,
  placeholder = "Select parent folder",
  allowRoot = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { folders, loading, fetchFolders } = useFolders();
  const [filteredFolders, setFilteredFolders] = useState([]);

  useEffect(() => {
    if (!folders || folders.length === 0) {
      fetchFolders();
    }
  }, [folders, fetchFolders]);

  useEffect(() => {
    if (folders && folders.length > 0) {
      // Filter out the excluded folder and its descendants
      const filterFolders = (folderList, excludeId) => {
        if (!excludeId) return folderList;

        return folderList.filter((folder) => {
          // Exclude the folder itself
          if (folder._id === excludeId) return false;

          // Exclude descendants (check if excludeId is in the parent chain)
          let currentFolder = folder;
          while (currentFolder.parentId) {
            if (currentFolder.parentId === excludeId) return false;
            currentFolder = folderList.find(
              (f) => f._id === currentFolder.parentId
            );
            if (!currentFolder) break;
          }

          return true;
        });
      };

      const filtered = filterFolders(folders, excludeId);
      setFilteredFolders(filtered);
    }
  }, [folders, excludeId]);

  // Build folder hierarchy for display
  const buildFolderOptions = () => {
    const options = [];

    if (allowRoot) {
      options.push({
        value: "all",
        label: "📁 Root Folder",
        level: 0,
      });
    }

    // Create a map for quick lookup
    const folderMap = {};
    filteredFolders.forEach((folder) => {
      folderMap[folder._id] = { ...folder, children: [] };
    });

    // Build parent-child relationships
    const rootFolders = [];
    filteredFolders.forEach((folder) => {
      if (folder.parentId && folderMap[folder.parentId]) {
        folderMap[folder.parentId].children.push(folderMap[folder._id]);
      } else {
        rootFolders.push(folderMap[folder._id]);
      }
    });

    // Recursively add folders to options with proper indentation
    const addFolderToOptions = (folder, level = 0) => {
      const indent = "  ".repeat(level);
      const icon = level === 0 ? "📁" : "📂";

      options.push({
        value: folder._id,
        label: `${indent}${icon} ${folder.name}`,
        level: level,
        folder: folder,
      });

      // Sort children by name
      const sortedChildren = folder.children.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      sortedChildren.forEach((child) => {
        addFolderToOptions(child, level + 1);
      });
    };

    // Sort root folders by name
    const sortedRootFolders = rootFolders.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    sortedRootFolders.forEach((folder) => {
      addFolderToOptions(folder, 0);
    });

    return options;
  };

  const folderOptions = buildFolderOptions();
  const selectedOption = folderOptions.find((opt) => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <TbFolder className="text-gray-400 text-xl" />
        <div className="border rounded px-3 py-2 bg-gray-100 min-w-[200px] flex items-center">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
          Loading folders...
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <TbFolder
          className={`text-xl ${error ? "text-red-500" : "text-gray-600"}`}
        />
        <div className="relative min-w-[200px]">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`w-full border rounded px-3 py-2 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${
              error
                ? "border-red-400 bg-red-50"
                : disabled
                ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <span
              className={`truncate ${
                !selectedOption ? "text-gray-500" : "text-gray-900"
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <TbChevronDown
              className={`text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              size={16}
            />
          </button>

          {isOpen && !disabled && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown */}
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                {folderOptions.length === 0 ? (
                  <div className="px-3 py-2 text-gray-500 text-sm">
                    No folders available
                  </div>
                ) : (
                  folderOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors ${
                        option.value === value
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-900"
                      }`}
                    >
                      <span
                        className="block truncate text-sm"
                        style={{
                          fontFamily: "monospace",
                          whiteSpace: "pre",
                        }}
                      >
                        {option.label}
                      </span>
                      {option.folder && (
                        <span className="block text-xs text-gray-500 mt-1 ml-4">
                          {option.folder.description || "No description"}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-1 ml-6">{error}</p>}
    </div>
  );
};

export default FolderDropdown;
