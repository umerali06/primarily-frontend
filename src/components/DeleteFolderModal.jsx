import React, { useState } from "react";
import BaseModal from "./BaseModal";
import { TbTrash, TbAlertTriangle, TbFolder, TbFiles } from "react-icons/tb";
import toast from "react-hot-toast";

const DeleteFolderModal = ({ open, onClose, folder, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText !== folder?.name) {
      toast.error("Please type the folder name exactly to confirm deletion");
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(folder);
      onClose();
      setConfirmText("");
    } catch (error) {
      // Error is already handled in the parent component
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText("");
      onClose();
    }
  };

  if (!folder) return null;

  const hasItems = folder.itemCount > 0;
  const isConfirmValid = confirmText === folder.name;

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Delete Folder"
      maxWidth="max-w-md"
      closeOnBackdrop={!isDeleting}
    >
      <div className="space-y-4">
        {/* Warning Header */}
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-red-200 rounded-lg">
          <TbAlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-800">Permanent Deletion</h3>
            <p className="text-sm text-green-600">This action cannot be undone</p>
          </div>
        </div>

        {/* Folder Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <TbFolder className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">{folder.name}</span>
          </div>

          {folder.description && (
            <p className="text-sm text-gray-600 mb-2">{folder.description}</p>
          )}

          {hasItems && (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <TbFiles className="w-4 h-4" />
              <span>Contains {folder.itemCount} item(s)</span>
            </div>
          )}
        </div>

        {/* Warning Message */}
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            You are about to permanently delete this folder
            {hasItems && " and all its contents"}.
          </p>

          {hasItems && (
            <p className="text-sm text-green-600 font-medium">
              All {folder.itemCount} item(s) in this folder will be permanently
              deleted.
            </p>
          )}
        </div>

        {/* Confirmation Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Type the folder name to confirm deletion:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={folder.name}
            disabled={isDeleting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">
            Expected:{" "}
            <span className="font-mono font-medium">{folder.name}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || !isConfirmValid}
            className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <TbTrash className="w-4 h-4" />
                Delete Folder
              </>
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteFolderModal;
