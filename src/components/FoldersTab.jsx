import React, { useState, useEffect } from "react";
import {
  TbFolder,
  TbSearch,
  TbLayoutGrid,
  TbChevronDown,
  TbMenu,
  TbX,
} from "react-icons/tb";
import AddFolderModal from "./AddFolderModal";
import EditFolderModal from "./EditFolderModal";
import CloneFolderModal from "./CloneFolderModal";
import FolderHistoryModal from "./FolderHistoryModal";
import MoveToFolderModal from "./MoveToFolderModal";
import FolderPermissionsModal from "./FolderPermissionsModal";
import SetFolderAlertModal from "./SetFolderAlertModal";
import FolderExportModal from "./FolderExportModal";
import FolderLabelModal from "./FolderLabelModal";
import DeleteFolderModal from "./DeleteFolderModal";
import FolderActionDropdown from "./FolderActionDropdown";
import FolderBreadcrumb from "./FolderBreadcrumb";
import useFolders from "../hooks/useFolders";
import toast from "react-hot-toast";

const FoldersTab = ({ GREEN }) => {
  // Add safety check for GREEN prop
  const greenTheme = GREEN || { main: "#16A34A", light: "#22C55E" };

  const [folderSearch, setFolderSearch] = useState("");
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFolderForModal, setSelectedFolderForModal] = useState(null);

  const {
    folders,
    selectedFolder,
    folderItems,
    folderHierarchy,
    loading,
    itemsLoading,
    setSelectedFolder,
    fetchFolderItems,
    createFolder,
    fetchFolders,
    deleteFolder,
  } = useFolders();

  // Debug logging
  useEffect(() => {
    console.log("FoldersTab - folders:", folders);
    console.log("FoldersTab - loading:", loading);
    console.log("FoldersTab - selectedFolder:", selectedFolder);
  }, [folders, loading, selectedFolder]);

  // Load folder items when selected folder changes
  useEffect(() => {
    if (selectedFolder) {
      loadFolderItems(selectedFolder);
    }
  }, [selectedFolder]);

  // Set first folder as selected when folders load
  useEffect(() => {
    if (folders.length > 0 && !selectedFolder) {
      console.log("Setting first folder as selected:", folders[0]);
      setSelectedFolder(folders[0]._id);
    }
  }, [folders, selectedFolder, setSelectedFolder]);

  // Force fetch folders if none are loaded
  useEffect(() => {
    if (folders.length === 0 && !loading) {
      console.log("No folders found, fetching...");
      fetchFolders();
    }
  }, [folders.length, loading, fetchFolders]);

  const loadFolderItems = async (folderId) => {
    try {
      await fetchFolderItems(folderId);
    } catch (error) {
      toast.error("Failed to load folder items");
    }
  };

  const filteredFolders = Array.isArray(folders)
    ? folders.filter((f) =>
        f.name.toLowerCase().includes(folderSearch.toLowerCase())
      )
    : [];

  // State declarations - moved before functions that use them
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [layoutDropdownOpen, setLayoutDropdownOpen] = useState(false);
  const [sortSearch, setSortSearch] = useState("");
  const [sortBy, setSortBy] = useState("Updated At");
  const [sortDir, setSortDir] = useState("desc");
  const [layoutType, setLayoutType] = useState("grid");

  const selectedFolderData = folders.find((f) => f._id === selectedFolder);

  // Sorting and filtering logic
  const getSortedAndFilteredFolders = () => {
    let filteredFolders = folders;

    // Apply search filter
    if (folderSearch.trim()) {
      filteredFolders = folders.filter(
        (folder) =>
          folder.name.toLowerCase().includes(folderSearch.toLowerCase()) ||
          (folder.description &&
            folder.description
              .toLowerCase()
              .includes(folderSearch.toLowerCase()))
      );
    }

    // Apply sorting
    const sortedFolders = [...filteredFolders].sort((a, b) => {
      switch (sortBy) {
        case "Name":
          return sortDir === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "Updated At":
          return sortDir === "asc"
            ? new Date(a.updatedAt) - new Date(b.updatedAt)
            : new Date(b.updatedAt) - new Date(a.updatedAt);
        case "Item Count":
          return sortDir === "asc"
            ? (a.itemCount || 0) - (b.itemCount || 0)
            : (b.itemCount || 0) - (a.itemCount || 0);
        case "Total Value":
          return sortDir === "asc"
            ? (a.totalValue || 0) - (b.totalValue || 0)
            : (b.totalValue || 0) - (a.totalValue || 0);
        default:
          return 0;
      }
    });

    return sortedFolders;
  };

  const getSortedAndFilteredItems = () => {
    let filteredItems = folderItems;

    // Apply sorting to items if needed
    const sortedItems = [...filteredItems].sort((a, b) => {
      switch (sortBy) {
        case "Name":
          return sortDir === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "Updated At":
          return sortDir === "asc"
            ? new Date(a.updatedAt) - new Date(b.updatedAt)
            : new Date(b.updatedAt) - new Date(a.updatedAt);
        default:
          return 0;
      }
    });

    return sortedItems;
  };

  const displayFolders = getSortedAndFilteredFolders();
  const displayItems = getSortedAndFilteredItems();

  const sortOptions = ["Name", "Updated At", "Item Count", "Total Value"];
  const layoutOptions = [
    {
      key: "grid",
      label: "Grid",
      icon: <TbLayoutGrid className="text-lg mr-2 text-green-500" />,
    },
    {
      key: "list",
      label: "List",
      icon: <TbFolder className="text-lg mr-2 text-gray-500" />,
    },
  ];

  // Folder action handlers
  const handleEditFolder = (folder) => {
    setSelectedFolderForModal(folder);
    setShowEditModal(true);
  };

  const handleCloneFolder = (folder) => {
    setSelectedFolderForModal(folder);
    setShowCloneModal(true);
  };

  const handleFolderHistory = (folder) => {
    setSelectedFolderForModal(folder);
    setShowHistoryModal(true);
  };

  const handleMoveFolder = (folder) => {
    setSelectedFolderForModal(folder);
    setShowMoveModal(true);
  };

  const handleFolderPermissions = (folder) => {
    setSelectedFolderForModal(folder);
    setShowPermissionsModal(true);
  };

  const handleSetFolderAlert = (folder) => {
    setSelectedFolderForModal(folder);
    setShowAlertModal(true);
  };

  const handleExportFolder = (folder) => {
    setSelectedFolderForModal(folder);
    setShowExportModal(true);
  };

  const handleCreateFolderLabel = (folder) => {
    setSelectedFolderForModal(folder);
    setShowLabelModal(true);
  };

  const handleDeleteFolder = async (folder) => {
    // Check if this is the currently selected folder
    const isCurrentFolder = selectedFolder === folder._id;

    // Create a more detailed confirmation message
    let confirmMessage = `Are you sure you want to delete "${folder.name}"?`;

    if (folder.itemCount > 0) {
      confirmMessage += `\n\nThis folder contains ${folder.itemCount} item(s). All items will be permanently deleted.`;
    }

    confirmMessage += "\n\nThis action cannot be undone.";

    if (window.confirm(confirmMessage)) {
      try {
        await deleteFolder(folder._id);

        // If we deleted the currently selected folder, navigate to root
        if (isCurrentFolder) {
          setSelectedFolder(null);
          setCurrentPath([]);
        }

        // Refresh the folders list
        await fetchFolders();
      } catch (error) {
        console.error("Error deleting folder:", error);

        // Handle specific error cases
        if (error.response?.status === 400) {
          const errorMessage =
            error.response.data?.message || "Cannot delete folder";

          if (errorMessage.includes("subfolders")) {
            toast.error(
              "Cannot delete folder with subfolders. Please move or delete subfolders first."
            );
          } else if (errorMessage.includes("items")) {
            toast.error(
              "Cannot delete folder with items. Please move or delete items first."
            );
          } else {
            toast.error(errorMessage);
          }
        } else if (error.response?.status === 404) {
          toast.error("Folder not found or already deleted");
          // Refresh folders list to sync with server
          await fetchFolders();
        } else {
          toast.error("Failed to delete folder. Please try again.");
        }
      }
    }
  };

  const handleBreadcrumbNavigate = (folderId, index) => {
    if (folderId === null) {
      // Navigate to root
      setSelectedFolder(null);
      setCurrentPath([]);
    } else {
      // Navigate to specific folder
      setSelectedFolder(folderId);
      setCurrentPath((prev) => prev.slice(0, index + 1));
    }
  };

  return (
    <div className="flex h-full min-h-[500px] relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col p-4 lg:p-6 transition-transform duration-300 ease-in-out h-full lg:h-auto`}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <TbX size={20} />
        </button>
        <input
          type="text"
          placeholder="Search folders"
          value={folderSearch}
          onChange={(e) => setFolderSearch(e.target.value)}
          className="mb-4 w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
        />
        <ul className="flex-1 overflow-y-auto">
          {loading ? (
            <li className="text-center py-4 text-gray-500">
              Loading folders...
            </li>
          ) : filteredFolders.length === 0 ? (
            <li className="text-center py-4 text-gray-500">
              {folderSearch ? "No folders found" : "No folders created yet"}
            </li>
          ) : (
            displayFolders.map((folder) => (
              <li key={folder._id} className="relative group">
                <button
                  className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg mb-1 text-left transition-all duration-150 ${
                    selectedFolder === folder._id
                      ? "bg-green-50 text-green-600 font-bold shadow"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedFolder(folder._id);
                    setSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                >
                  <TbFolder
                    className={`text-lg ${
                      selectedFolder === folder._id
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="flex-1 truncate">
                    <span className="truncate">{folder.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      ({folder.itemCount || 0})
                    </span>
                  </div>
                </button>

                {/* Action dropdown - only show on hover/selected */}
                <div
                  className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                    selectedFolder === folder._id ||
                    "group-hover:opacity-100 opacity-0"
                  } transition-opacity duration-150`}
                >
                  <FolderActionDropdown
                    folder={folder}
                    onEdit={handleEditFolder}
                    onClone={handleCloneFolder}
                    onHistory={handleFolderHistory}
                    onMove={handleMoveFolder}
                    onPermissions={handleFolderPermissions}
                    onSetAlert={handleSetFolderAlert}
                    onExport={handleExportFolder}
                    onCreateLabel={handleCreateFolderLabel}
                    onDelete={handleDeleteFolder}
                  />
                </div>
              </li>
            ))
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 lg:p-10 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden mb-4 p-2 text-gray-600 hover:text-gray-800 self-start"
        >
          <TbMenu size={24} />
        </button>
        {/* Header with breadcrumb */}
        <div className="mb-4">
          <FolderBreadcrumb
            currentPath={currentPath}
            onNavigate={handleBreadcrumbNavigate}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <h1
            className="text-2xl lg:text-3xl font-bold text-gray-700"
            style={{ color: greenTheme.main }}
          >
            {selectedFolderData?.name || "All Folders"}
          </h1>
          <button
            className="px-4 lg:px-6 py-2 rounded-lg font-semibold text-sm lg:text-base bg-green-500 text-white shadow hover:bg-green-600 transition flex items-center gap-2 self-start lg:self-auto"
            onClick={() => setShowAddFolderModal(true)}
          >
            <span className="text-xl">+</span> ADD FOLDER
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search items"
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-10 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
            <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
            <span
              className="absolute right-2 top-2 w-4 h-4 bg-purple-500 rounded-tr-lg rounded-bl-lg flex items-center justify-center text-white text-xs font-bold shadow"
              style={{ fontSize: "0.7rem" }}
            >
              ★
            </span>
          </div>

          {/* Stats - responsive layout */}
          <div className="flex flex-wrap items-center gap-2 lg:gap-6 text-gray-700 text-sm lg:text-base font-medium">
            <span>
              Items: <b>{displayItems.length}</b>
            </span>
            <span className="hidden sm:inline">
              Total Quantity:{" "}
              <b>
                {displayItems.reduce(
                  (sum, item) => sum + (item.quantity || 0),
                  0
                )}{" "}
                units
              </b>
            </span>
            <span className="hidden md:inline">
              Total Value:{" "}
              <b>
                PKR{" "}
                {displayItems
                  .reduce(
                    (sum, item) =>
                      sum + (item.quantity || 0) * (item.price || 0),
                    0
                  )
                  .toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </b>
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                className={`px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm border ${
                  sortDropdownOpen
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white border-gray-200"
                } flex items-center gap-2 shadow-sm focus:outline-none min-w-[100px] lg:min-w-[120px]`}
                onClick={() => setSortDropdownOpen((v) => !v)}
              >
                <span className="truncate">{sortBy}</span>
                <TbChevronDown className="text-base flex-shrink-0" />
              </button>
              {sortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fadeIn">
                  <div className="p-3 border-b border-gray-50">
                    <input
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none"
                      placeholder="Search"
                      value={sortSearch}
                      onChange={(e) => setSortSearch(e.target.value)}
                    />
                  </div>
                  <ul className="py-2">
                    {sortOptions
                      .filter((opt) =>
                        opt.toLowerCase().includes(sortSearch.toLowerCase())
                      )
                      .map((opt) => (
                        <li key={opt}>
                          <button
                            className={`w-full text-left px-4 py-2 flex items-center gap-2 ${
                              sortBy === opt
                                ? "text-green-500 font-bold"
                                : "text-gray-700"
                            } hover:bg-gray-50`}
                            onClick={() => {
                              if (sortBy === opt) {
                                // Toggle sort direction if same option is clicked
                                setSortDir(sortDir === "asc" ? "desc" : "asc");
                              } else {
                                // Set new sort option with default direction
                                setSortBy(opt);
                                setSortDir("desc");
                              }
                              setSortDropdownOpen(false);
                            }}
                          >
                            {opt}
                            {sortBy === opt && (
                              <span className="ml-auto">
                                {sortDir === "desc" ? "↓" : "↑"}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Layout Switcher Dropdown */}
            <div className="relative">
              <button
                className={`p-2 rounded-lg border ${
                  layoutDropdownOpen
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white border-gray-200"
                } flex items-center text-gray-700 shadow-sm focus:outline-none`}
                onClick={() => setLayoutDropdownOpen((v) => !v)}
              >
                <TbLayoutGrid className="text-xl" />
              </button>
              {layoutDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fadeIn">
                  <div className="px-4 pt-4 pb-2 text-xs text-gray-400 font-semibold">
                    LAYOUT TYPE
                  </div>
                  <ul>
                    {layoutOptions.map((opt) => (
                      <li key={opt.key}>
                        <button
                          className={`w-full flex items-center px-4 py-2 rounded-lg ${
                            layoutType === opt.key
                              ? "bg-green-50 text-green-500 font-bold"
                              : "text-gray-700"
                          } hover:bg-gray-50`}
                          onClick={() => {
                            setLayoutType(opt.key);
                            setLayoutDropdownOpen(false);
                          }}
                        >
                          {opt.icon} {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Display - responsive */}
        <div
          className={
            layoutType === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8"
              : "space-y-4"
          }
        >
          {itemsLoading ? (
            <div
              className={`${
                layoutType === "grid" ? "col-span-full" : ""
              } text-center py-8 text-gray-500`}
            >
              Loading items...
            </div>
          ) : displayItems.length === 0 ? (
            <div
              className={`${
                layoutType === "grid" ? "col-span-full" : ""
              } text-center py-8 text-gray-500`}
            >
              {selectedFolderData
                ? `No items found in "${selectedFolderData.name}"`
                : "Select a folder to view items"}
            </div>
          ) : (
            displayItems.map((item) => (
              <div
                key={item._id}
                className={
                  layoutType === "grid"
                    ? "bg-white rounded-2xl shadow p-4 lg:p-6 flex flex-col items-center"
                    : "bg-white rounded-2xl shadow p-4 lg:p-6 flex flex-row items-center gap-4"
                }
              >
                <div
                  className={
                    layoutType === "grid"
                      ? "relative w-full mb-4"
                      : "relative w-24 h-24 flex-shrink-0"
                  }
                >
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={(() => {
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
                      })()}
                      alt={item.name}
                      className={
                        layoutType === "grid"
                          ? "w-full h-32 lg:h-40 object-cover rounded-xl"
                          : "w-24 h-24 object-cover rounded-xl"
                      }
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  {(!item.images || item.images.length === 0) && (
                    <div
                      className={
                        layoutType === "grid"
                          ? "w-full h-32 lg:h-40 bg-gray-200 rounded-xl flex items-center justify-center"
                          : "w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center"
                      }
                    >
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  {/* Fallback div for broken images */}
                  <div
                    className={
                      layoutType === "grid"
                        ? "w-full h-32 lg:h-40 bg-gray-200 rounded-xl flex items-center justify-center"
                        : "w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center"
                    }
                    style={{ display: "none" }}
                  >
                    <span className="text-gray-400">Image Not Found</span>
                  </div>
                  {item.quantity <= item.minLevel && (
                    <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-bold rounded px-2 py-0.5">
                      LOW STOCK
                    </span>
                  )}
                </div>
                <div
                  className={layoutType === "grid" ? "text-center" : "flex-1"}
                >
                  <div
                    className={`font-bold text-base lg:text-lg text-gray-800 mb-2 ${
                      layoutType === "grid" ? "text-center" : "text-left"
                    }`}
                  >
                    {item.name}
                  </div>
                  <div
                    className={`text-sm text-gray-500 mb-2 ${
                      layoutType === "grid" ? "text-center" : "text-left"
                    }`}
                  >
                    {item.quantity} {item.unit} | PKR{" "}
                    {((item.quantity || 0) * (item.price || 0)).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </div>
                  <div
                    className={`flex gap-1 flex-wrap mt-2 ${
                      layoutType === "grid" ? "justify-center" : "justify-start"
                    }`}
                  >
                    {item.tags &&
                      item.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    {item.tags && item.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <AddFolderModal
        open={showAddFolderModal}
        onClose={() => setShowAddFolderModal(false)}
        onAdd={() => {
          setShowAddFolderModal(false);
          // Folders will be refreshed automatically by the hook
        }}
      />

      {/* Edit Folder Modal */}
      <EditFolderModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedFolderForModal(null);
        }}
        folder={selectedFolderForModal}
        onSave={(updatedFolder) => {
          setShowEditModal(false);
          setSelectedFolderForModal(null);
          // Manually refresh folders to ensure UI updates
          fetchFolders();
        }}
      />

      {/* Clone Folder Modal */}
      <CloneFolderModal
        open={showCloneModal}
        onClose={() => {
          setShowCloneModal(false);
          setSelectedFolderForModal(null);
        }}
        sourceFolder={selectedFolderForModal}
        onClone={(clonedFolder) => {
          setShowCloneModal(false);
          setSelectedFolderForModal(null);
          // Manually refresh folders to ensure UI updates
          fetchFolders();
        }}
      />

      {/* Folder History Modal */}
      <FolderHistoryModal
        open={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedFolderForModal(null);
        }}
        folder={selectedFolderForModal}
      />

      {/* Move Folder Modal */}
      <MoveToFolderModal
        open={showMoveModal}
        onClose={() => {
          setShowMoveModal(false);
          setSelectedFolderForModal(null);
        }}
        folder={selectedFolderForModal}
        onMove={(folder, newParent) => {
          setShowMoveModal(false);
          setSelectedFolderForModal(null);
          // Folders will be refreshed automatically by the hook
        }}
      />

      {/* Folder Permissions Modal */}
      <FolderPermissionsModal
        open={showPermissionsModal}
        onClose={() => {
          setShowPermissionsModal(false);
          setSelectedFolderForModal(null);
        }}
        folder={selectedFolderForModal}
        onSave={(permissions) => {
          setShowPermissionsModal(false);
          setSelectedFolderForModal(null);
        }}
      />

      {/* Set Folder Alert Modal */}
      <SetFolderAlertModal
        open={showAlertModal}
        onClose={() => {
          setShowAlertModal(false);
          setSelectedFolderForModal(null);
        }}
        folder={selectedFolderForModal}
        onSave={(alertConfig) => {
          setShowAlertModal(false);
          setSelectedFolderForModal(null);
        }}
      />

      {/* Folder Export Modal */}
      <FolderExportModal
        open={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          setSelectedFolderForModal(null);
        }}
        folder={selectedFolderForModal}
        onExport={(format, options) => {
          setShowExportModal(false);
          setSelectedFolderForModal(null);
        }}
      />

      {/* Folder Label Modal */}
      <FolderLabelModal
        open={showLabelModal}
        onClose={() => {
          setShowLabelModal(false);
          setSelectedFolderForModal(null);
        }}
        folder={selectedFolderForModal}
        onSave={(labelData) => {
          setShowLabelModal(false);
          setSelectedFolderForModal(null);
        }}
      />
    </div>
  );
};

export default FoldersTab;
