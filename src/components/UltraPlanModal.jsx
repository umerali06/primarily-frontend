import React from "react";

const UltraPlanModal = ({ open, onClose, GREEN }) => {
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
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full flex flex-col md:flex-row items-center relative animate-fadeIn">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {/* Illustration */}
        <div className="flex-1 flex flex-col items-center justify-center mb-6 md:mb-0 md:mr-8">
          {/* Use a placeholder box illustration or emoji */}
          <div className="bg-[color:var(--sidebar-green,var(--primary-color))] bg-opacity-10 rounded-full p-8 mb-4">
            <span style={{ fontSize: 80 }} role="img" aria-label="Box">
              📦
            </span>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col items-start justify-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: GREEN.main }}>
            Do even more with our <span className="text-green-500">Ultra</span>{" "}
            Plan:
          </h2>
          <ul className="mb-4 space-y-2 text-gray-700 text-base list-none">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span> Add more
              details about items and folders with additional fields.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span> Use your own
              handheld scanners to seamlessly integrate Primarily into your
              workflow.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span> Gain valuable
              insights from quantity change and move summary reports.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span> Keep your
              business running smoothly with date based notifications.
            </li>
          </ul>
          <div className="text-green-500 mb-4 font-medium">So much more</div>
          <button
            className="w-full px-8 py-3 rounded-lg font-semibold text-base shadow transition-all bg-[color:var(--sidebar-green,var(--primary-color))] text-white hover:btn-primary-hover"
            onClick={onClose}
          >
            TRY IT FREE FOR 14-DAYS
          </button>
        </div>
      </div>
    </div>
  );
};

export default UltraPlanModal;
