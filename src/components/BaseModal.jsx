import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

const BaseModal = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  showCloseButton = true,
  closeOnBackdrop = true,
  className = "",
  zIndex = "z-50",
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    // Focus management
    const previousActiveElement = document.activeElement;
    modalRef.current?.focus();

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Cleanup
    return () => {
      document.body.style.overflow = "";
      previousActiveElement?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const handleBackdropClick = (event) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${zIndex} px-2 sm:px-4`}
      style={{
        background: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} relative border border-gray-100 animate-fadeIn flex flex-col max-h-[90vh] ${className}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 z-10 bg-white rounded-full p-1 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
            aria-label="Close modal"
          >
            <IoClose size={28} />
          </button>
        )}

        {/* Header */}
        {title && (
          <div className="px-6 pt-6 pb-2">
            <h2
              id="modal-title"
              className="text-xl font-semibold text-center text-gray-800"
            >
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
};

export default BaseModal;
