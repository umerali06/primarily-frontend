import React from "react";

const InfoAlert = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div className="bg-[#e6f3f1] border border-[var(--bg-primary)] rounded-lg p-4 flex items-center mb-4">
      <span className="text-[#0a7662] text-xl mr-3">ℹ️</span>
      <div className="flex-1">
        <div className="font-semibold text-[#0a7662] mb-1">Start fresh!</div>
        <div className="text-[#0a7662] text-sm">
          Make room for your own inventory by removing any sample items still in
          your account.
        </div>
      </div>
      <button
        className="ml-4 text-[#0a7662] hover:text-[#0a7662] text-xl"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default InfoAlert;
