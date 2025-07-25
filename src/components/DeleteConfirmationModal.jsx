import React, { useState } from "react";
import { TbX, TbTrash, TbAlertTriangle } from "react-icons/tb";
import toast from "react-hot-toast";

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  itemName = "",
  type = "item",
  isLoading = false,
}) => {
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");

  const requiresConfirmation = type === "folder" || type === "bulk";
  const expectedText = requiresConfirmation ? "DELETE" : "";

  const handleConfirm = () => {
    if (requiresConfirmation && confirmText !== expectedText) {
      toast.error(`Please type "${expectedText}" to confirm`);
      return;
    }

    onConfirm({ reason, confirmText });
  };

  const handleClose = () => {
    setConfirmText("");
    setReason("");
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-2 sm:px-4"
      style={{
        background: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-100 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TbTrash className="text-green-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
            disabled={isLoading}
          >
            <TbX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-red-200 rounded-lg mb-6">
            <TbAlertTriangle
              className="text-green-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <h3 className="font-medium text-green-800 mb-1">
                This action cannot be undone
              </h3>
              <p className="text-sm text-green-700">
                {message}
                {itemName && <span className="font-medium"> "{itemName}"</span>}
              </p>
            </div>
          </div>

          {/* Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for deletion (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Why are you deleting this item?"
              disabled={isLoading}
            />
          </div>

          {/* Confirmation Text */}
          {requiresConfirmation && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-green-600">
                  {expectedText}
                </span>{" "}
                to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={`Type "${expectedText}" here`}
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={
              isLoading ||
              (requiresConfirmation && confirmText !== expectedText)
            }
            className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
              isLoading ||
              (requiresConfirmation && confirmText !== expectedText)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
