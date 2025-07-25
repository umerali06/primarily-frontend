import React, { useState } from "react";
import {
  TbX,
  TbCheck,
  TbFolder,
  TbTag,
  TbTrash,
  TbEdit,
  TbCopy,
  TbArrowsMove,
} from "react-icons/tb";
import useInventory from "../hooks/useInventory";
import toast from "react-hot-toast";
import BulkMoveModal from "./BulkMoveModal";
import BulkTagModal from "./BulkTagModal";
import BulkDeleteModal from "./BulkDeleteModal";

const BulkOperationsModal = ({ open, onClose, selectedItems = [] }) => {
  const [operation, setOperation] = useState("");
  const [operationData, setOperationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Debug loading state
  React.useEffect(() => {
    console.log("isLoading changed:", isLoading);
  }, [isLoading]);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Debug state changes
  React.useEffect(() => {
    console.log("showMoveModal changed:", showMoveModal);
  }, [showMoveModal]);

  React.useEffect(() => {
    console.log("showDeleteModal changed:", showDeleteModal);
  }, [showDeleteModal]);

  React.useEffect(() => {
    console.log("showTagModal changed:", showTagModal);
  }, [showTagModal]);

  const {
    folders,
    tags,
    bulkUpdateItems,
    bulkDeleteItems,
    fetchFolders,
    fetchTags,
  } = useInventory();

  React.useEffect(() => {
    if (open) {
      fetchFolders();
      fetchTags();
    }
  }, [open, fetchFolders, fetchTags]);

  const operations = [
    {
      id: "move",
      label: "Move to Folder",
      icon: <TbArrowsMove size={20} />,
      description: "Move selected items to a different folder",
    },
    {
      id: "tag",
      label: "Add Tags",
      icon: <TbTag size={20} />,
      description: "Add tags to selected items",
    },
    {
      id: "update",
      label: "Update Fields",
      icon: <TbEdit size={20} />,
      description: "Update common fields for selected items",
    },
    {
      id: "delete",
      label: "Delete Items",
      icon: <TbTrash size={20} />,
      description: "Delete all selected items",
      danger: true,
    },
  ];

  const handleOperationChange = (operationId) => {
    console.log("Operation changed to:", operationId);
    setOperation(operationId);
    setOperationData({});
    // Don't auto-open modals here, let user click the specific buttons
  };

  const handleSubmit = async () => {
    if (!operation) {
      toast.error("Please select an operation");
      return;
    }

    // For operations that have dedicated modals, open them instead of processing here
    if (operation === "move") {
      setShowMoveModal(true);
      return;
    }

    if (operation === "delete") {
      setShowDeleteModal(true);
      return;
    }

    if (operation === "tag") {
      setShowTagModal(true);
      return;
    }

    // Handle update operation directly
    if (operation === "update") {
      setIsLoading(true);
      try {
        const itemIds = selectedItems.map((item) => item._id);
        const updates = {};

        if (operationData.price !== undefined)
          updates.price = operationData.price;
        if (operationData.minLevel !== undefined)
          updates.minLevel = operationData.minLevel;
        if (operationData.unit) updates.unit = operationData.unit;
        if (operationData.location) updates.location = operationData.location;

        if (Object.keys(updates).length === 0) {
          toast.error("Please specify at least one field to update");
          return;
        }

        await bulkUpdateItems(itemIds, updates);
        toast.success(`Updated ${selectedItems.length} items`);
        onClose();
      } catch (error) {
        toast.error(error.response?.data?.message || "Operation failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderOperationForm = () => {
    switch (operation) {
      case "move":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-primary-light border border-[var(--bg-primary)] rounded-lg">
              <div className="flex items-center gap-2 text-[var(--primary-dark)] mb-2">
                <TbArrowsMove size={20} />
                <span className="font-medium">Enhanced Move Operation</span>
              </div>
              <p className="text-sm text-primary">
                Click the button below to open the enhanced folder selection
                interface.
              </p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Select Destination Folder clicked");
                  setShowMoveModal(true);
                }}
                className="mt-3 px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors w-full flex items-center justify-center gap-2"
                type="button"
              >
                <TbFolder size={18} />
                Select Destination Folder
              </button>
            </div>
          </div>
        );

      case "tag":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(operationData.tags || []).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-light text-[var(--primary-dark)]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        const newTags = [...(operationData.tags || [])];
                        newTags.splice(index, 1);
                        setOperationData({ ...operationData, tags: newTags });
                      }}
                      className="ml-2 text-primary hover:text-[var(--primary-dark)]"
                    >
                      <TbX size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type a tag and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    e.preventDefault();
                    const newTag = e.target.value.trim().toLowerCase();
                    const currentTags = operationData.tags || [];
                    if (!currentTags.includes(newTag)) {
                      setOperationData({
                        ...operationData,
                        tags: [...currentTags, newTag],
                      });
                    }
                    e.target.value = "";
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
            </div>
          </div>
        );

      case "update":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (PKR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={operationData.price || ""}
                  onChange={(e) =>
                    setOperationData({
                      ...operationData,
                      price: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  placeholder="Leave empty to skip"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Level
                </label>
                <input
                  type="number"
                  min="0"
                  value={operationData.minLevel || ""}
                  onChange={(e) =>
                    setOperationData({
                      ...operationData,
                      minLevel: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  placeholder="Leave empty to skip"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  value={operationData.unit || ""}
                  onChange={(e) =>
                    setOperationData({ ...operationData, unit: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="">Don't change</option>
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="lbs">Pounds</option>
                  <option value="liters">Liters</option>
                  <option value="meters">Meters</option>
                  <option value="boxes">Boxes</option>
                  <option value="units">Units</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={operationData.location || ""}
                  onChange={(e) =>
                    setOperationData({
                      ...operationData,
                      location: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  placeholder="Leave empty to skip"
                />
              </div>
            </div>
          </div>
        );

      case "delete":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <TbTrash size={20} />
                <span className="font-medium">Enhanced Delete Operation</span>
              </div>
              <p className="text-sm text-green-700">
                Click the button below to open the enhanced delete interface
                with progress tracking and undo functionality.
              </p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Delete button clicked");
                  setShowDeleteModal(true);
                }}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full flex items-center justify-center gap-2"
                type="button"
              >
                <TbTrash size={18} />
                Delete {selectedItems.length} Items
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Bulk Move Modal */}
      <BulkMoveModal
        open={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        selectedItems={selectedItems}
        onMove={(items, destination) => {
          // Close both modals on successful move
          setShowMoveModal(false);
          onClose();
        }}
      />

      {/* Bulk Tag Modal */}
      <BulkTagModal
        open={showTagModal}
        onClose={() => setShowTagModal(false)}
        selectedItems={selectedItems}
        onTagsUpdated={(items, tags, operation) => {
          // Close both modals on successful tag update
          setShowTagModal(false);
          onClose();
        }}
      />

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selectedItems={selectedItems}
        onDelete={(items) => {
          // Close both modals on successful delete
          setShowDeleteModal(false);
          onClose();
        }}
      />

      {/* Main Bulk Operations Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center z-50 px-2 sm:px-4"
        style={{
          background: "rgba(0,0,0,0.15)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative border border-gray-100 animate-fadeIn flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Bulk Operations
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedItems.length} items selected
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
              disabled={isLoading}
            >
              <TbX size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Operation Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Select Operation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {operations.map((op) => (
                  <button
                    key={op.id}
                    onClick={() => handleOperationChange(op.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      operation === op.id
                        ? op.danger
                          ? "border-green-500 bg-green-50"
                          : "border-primary bg-primary-light"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`${
                          operation === op.id
                            ? op.danger
                              ? "text-green-600"
                              : "text-primary"
                            : "text-gray-600"
                        }`}
                      >
                        {op.icon}
                      </div>
                      <span
                        className={`font-medium ${
                          operation === op.id
                            ? op.danger
                              ? "text-green-800"
                              : "text-[var(--primary-dark)]"
                            : "text-gray-800"
                        }`}
                      >
                        {op.label}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        operation === op.id
                          ? op.danger
                            ? "text-green-700"
                            : "text-primary"
                          : "text-gray-600"
                      }`}
                    >
                      {op.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Operation Form */}
            {operation && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  {operations.find((op) => op.id === operation)?.label} Settings
                </h3>
                {renderOperationForm()}
              </div>
            )}

            {/* Selected Items Preview */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Selected Items ({selectedItems.length})
              </h3>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                {selectedItems.map((item, index) => (
                  <div
                    key={item._id}
                    className={`flex items-center gap-3 p-3 ${
                      index !== selectedItems.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                      <TbCheck className="text-primary" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Apply Operation clicked, operation:", operation);
                handleSubmit();
              }}
              disabled={isLoading || !operation}
              className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
                isLoading || !operation
                  ? "bg-gray-400 cursor-not-allowed"
                  : operation === "delete"
                  ? "bg-green-600 hover:bg-green-700"
                  : "btn-primary hover:btn-primary-hover"
              }`}
              type="button"
            >
              {isLoading ? "Processing..." : "Apply Operation"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkOperationsModal;
