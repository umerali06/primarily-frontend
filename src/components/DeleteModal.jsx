import React, { useState } from "react";
import { TbX, TbTrash, TbAlertTriangle } from "react-icons/tb";
import useInventoryStore from "../store/inventoryStore";
import toast from "react-hot-toast";

const DeleteModal = ({ open, onClose, item, onItemDeleted, type = "item" }) => {
  const { deleteItem, deleteFolder } = useInventoryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleDelete = async () => {
    if (!item?._id) {
      toast.error(`No ${type} selected for deletion`);
      return;
    }

    setIsLoading(true);
    try {
      if (type === "item") {
        await deleteItem(item._id, reason);
        toast.success("Item deleted successfully!");
      } else if (type === "folder") {
        await deleteFolder(item._id);
        toast.success("Folder deleted successfully!");
      }
      onItemDeleted?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to delete ${type}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <TbTrash className="mr-2 text-green-500" />
            Delete {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <TbX size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start mb-4">
            <TbAlertTriangle className="text-red-500 text-xl mr-3 mt-0.5" />
            <div>
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete <strong>"{item?.name}"</strong>?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. All data associated with this{" "}
                {type} will be permanently removed.
              </p>
            </div>
          </div>

          {type === "item" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for deletion (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="3"
                placeholder="Enter reason for deletion..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primarily-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
