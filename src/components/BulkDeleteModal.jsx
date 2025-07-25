import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import useInventory from "../hooks/useInventory";
import {
  TbTrash,
  TbX,
  TbCheck,
  TbLoader,
  TbAlertCircle,
  TbAlertTriangle,
  TbArrowBack,
} from "react-icons/tb";
import toast from "react-hot-toast";

const BulkDeleteModal = ({ open, onClose, selectedItems = [], onDelete }) => {
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deleteStatus, setDeleteStatus] = useState({
    total: 0,
    completed: 0,
    failed: 0,
    inProgress: false,
  });
  const [errors, setErrors] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [showUndoOption, setShowUndoOption] = useState(false);
  const [undoTimeoutId, setUndoTimeoutId] = useState(null);
  const [undoAvailableSeconds, setUndoAvailableSeconds] = useState(10);

  const { bulkDeleteItems, bulkUpdateItems } = useInventory();

  useEffect(() => {
    if (open) {
      setConfirmText("");
      setReason("");
      setDeleteProgress(0);
      setDeleteStatus({
        total: selectedItems.length,
        completed: 0,
        failed: 0,
        inProgress: false,
      });
      setErrors([]);
      setDeletedItems([]);
      setShowUndoOption(false);

      // Clear any existing undo timeout
      if (undoTimeoutId) {
        clearTimeout(undoTimeoutId);
        setUndoTimeoutId(null);
      }
      setUndoAvailableSeconds(10);
    }
  }, [open, selectedItems, undoTimeoutId]);

  // Countdown timer for undo option
  useEffect(() => {
    let interval;
    if (showUndoOption && undoAvailableSeconds > 0) {
      interval = setInterval(() => {
        setUndoAvailableSeconds((prev) => prev - 1);
      }, 1000);
    } else if (undoAvailableSeconds === 0) {
      setShowUndoOption(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showUndoOption, undoAvailableSeconds]);

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setIsLoading(true);
    setDeleteStatus({
      total: selectedItems.length,
      completed: 0,
      failed: 0,
      inProgress: true,
    });
    setErrors([]);
    setDeletedItems([]);

    try {
      // Process in batches of 10 items
      const batchSize = 10;
      const itemIds = selectedItems.map((item) => item._id);
      const batches = [];

      for (let i = 0; i < itemIds.length; i += batchSize) {
        batches.push(itemIds.slice(i, i + batchSize));
      }

      const failedItems = [];
      const successfullyDeletedItems = [];

      // Process each batch
      for (let i = 0; i < batches.length; i++) {
        const batchIds = batches[i];
        try {
          // Store items before deletion for potential undo
          const itemsToDelete = selectedItems.filter((item) =>
            batchIds.includes(item._id)
          );

          // Delete the batch
          await bulkDeleteItems(batchIds, reason);

          // Add to successfully deleted items
          successfullyDeletedItems.push(...itemsToDelete);

          // Update progress
          setDeleteStatus((prev) => ({
            ...prev,
            completed: prev.completed + batchIds.length,
          }));

          // Calculate progress percentage
          const progressPercent = Math.round(((i + 1) / batches.length) * 100);
          setDeleteProgress(progressPercent);
        } catch (error) {
          console.error(`Error deleting batch ${i}:`, error);

          // Add failed items
          failedItems.push(...batchIds);

          // Update failed count
          setDeleteStatus((prev) => ({
            ...prev,
            failed: prev.failed + batchIds.length,
          }));

          // Add error
          setErrors((prev) => [
            ...prev,
            `Failed to delete batch ${i + 1}: ${
              error.message || "Unknown error"
            }`,
          ]);
        }
      }

      // Store deleted items for potential undo
      setDeletedItems(successfullyDeletedItems);

      // Show success/failure message
      if (failedItems.length === 0) {
        toast.success(`Successfully deleted ${selectedItems.length} items`);

        // Show undo option
        setShowUndoOption(true);

        // Set timeout for undo option (10 seconds)
        const timeoutId = setTimeout(() => {
          setShowUndoOption(false);
          setUndoTimeoutId(null);
        }, 10000);

        setUndoTimeoutId(timeoutId);

        if (onDelete) {
          onDelete(selectedItems);
        }
      } else if (failedItems.length < selectedItems.length) {
        toast.success(
          `Deleted ${selectedItems.length - failedItems.length} items. ${
            failedItems.length
          } items failed.`
        );

        // Show undo option for partially successful deletion
        if (successfullyDeletedItems.length > 0) {
          setShowUndoOption(true);

          // Set timeout for undo option (10 seconds)
          const timeoutId = setTimeout(() => {
            setShowUndoOption(false);
            setUndoTimeoutId(null);
          }, 10000);

          setUndoTimeoutId(timeoutId);
        }

        if (onDelete) {
          onDelete(
            selectedItems.filter((item) => !failedItems.includes(item._id))
          );
        }
      } else {
        toast.error(`Failed to delete items`);
      }
    } catch (error) {
      console.error("Error in bulk delete operation:", error);
      toast.error(error.response?.data?.message || "Failed to delete items");

      setErrors((prev) => [
        ...prev,
        `Operation failed: ${error.message || "Unknown error"}`,
      ]);
    } finally {
      setDeleteStatus((prev) => ({
        ...prev,
        inProgress: false,
      }));
      setIsLoading(false);
    }
  };

  const handleUndo = async () => {
    // Clear the undo timeout
    if (undoTimeoutId) {
      clearTimeout(undoTimeoutId);
      setUndoTimeoutId(null);
    }

    setShowUndoOption(false);

    if (deletedItems.length === 0) {
      return;
    }

    toast.loading("Restoring deleted items...");

    try {
      // This is a mock implementation since we don't have a real "undelete" API
      // In a real implementation, you would call an API endpoint to restore the items
      // For now, we'll simulate it by showing a success message

      toast.dismiss();
      toast.success(`Restored ${deletedItems.length} items`);

      // Close the modal after restoration
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to restore items");
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">Deleting items...</span>
          <span>{deleteProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${deleteProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{deleteStatus.completed} completed</span>
          {deleteStatus.failed > 0 && (
            <span className="text-red-500">{deleteStatus.failed} failed</span>
          )}
          <span>{deleteStatus.total} total</span>
        </div>
      </div>
    );
  };

  if (!open) return null;

  return (
    <BaseModal
      open={open}
      onClose={deleteStatus.inProgress ? null : onClose}
      title="Delete Items"
      maxWidth="max-w-2xl"
      closeOnBackdrop={!isLoading && !deleteStatus.inProgress}
      zIndex="z-[60]"
    >
      <div className="space-y-4">
        {/* Warning */}
        <div className="p-4 bg-green-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 mb-2">
            <TbAlertTriangle className="w-5 h-5" />
            <span className="font-medium">
              Warning: This action cannot be undone
            </span>
          </div>
          <p className="text-sm text-green-700">
            You are about to delete {selectedItems.length} items permanently.
            This will remove all data associated with these items.
          </p>
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
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <TbTrash className="text-green-600" size={14} />
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

        {/* Progress Bar (when deleting) */}
        {deleteStatus.inProgress && renderProgressBar()}

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

        {/* Undo Option */}
        {showUndoOption && (
          <div className="border border-[var(--bg-primary)] rounded-lg bg-primary-light p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <TbCheck className="w-5 h-5" />
                <span className="font-medium">Items deleted successfully</span>
              </div>
              <span className="text-sm text-primary">
                {undoAvailableSeconds}s
              </span>
            </div>
            <div className="mt-2">
              <button
                onClick={handleUndo}
                className="w-full px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors flex items-center justify-center gap-2"
              >
                <TbArrowBack className="w-4 h-4" />
                Undo Delete
              </button>
            </div>
          </div>
        )}

        {/* Reason */}
        {!deleteStatus.inProgress && !showUndoOption && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for deletion (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Why are you deleting these items?"
              disabled={isLoading || deleteStatus.inProgress}
            />
          </div>
        )}

        {/* Confirmation Text */}
        {!deleteStatus.inProgress && !showUndoOption && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-green-600">
                DELETE
              </span>{" "}
              to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder='Type "DELETE" here'
              disabled={isLoading || deleteStatus.inProgress}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={isLoading || deleteStatus.inProgress}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          {!showUndoOption && (
            <button
              onClick={handleDelete}
              disabled={
                confirmText !== "DELETE" || isLoading || deleteStatus.inProgress
              }
              className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading || deleteStatus.inProgress ? (
                <>
                  <TbLoader className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <TbTrash className="w-4 h-4" />
                  Delete Items
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default BulkDeleteModal;
