import React, { useState } from "react";

const SetAlertModal = ({ open, onClose, onViewPlans }) => {
  const [selectedField, setSelectedField] = useState(null);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl relative animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="text-xl font-semibold text-gray-700">Set Alert</div>
          <button
            className="text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {/* Upgrade prompt */}
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-6 py-4 mx-8 mb-6">
          <span className="text-xl mr-3">⭐</span>
          <span className="flex-1 text-gray-700 text-sm">
            Want to setup date based alerts? <br />
            Now's a great time to upgrade.
          </span>
          <button
            className="ml-4 px-5 py-2 rounded-md border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-150"
            onClick={onViewPlans}
          >
            VIEW PLANS
          </button>
        </div>
        {/* Field selection */}
        <div className="px-8 mb-10">
          <div className="mb-4 text-gray-700 font-medium">
            Select a field to add or edit alert:
          </div>
          <label className="flex items-center gap-3 text-gray-700 text-base cursor-pointer">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-primary"
              checked={selectedField === "date"}
              onChange={() => setSelectedField("date")}
            />
            Date based custom field
          </label>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <span className="text-gray-400 font-medium">Step 1 of 2</span>
          <button
            className="px-8 py-3 rounded-lg font-semibold text-white bg-gray-200 cursor-not-allowed"
            disabled
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetAlertModal;
