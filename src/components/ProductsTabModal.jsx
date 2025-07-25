import React, { useState } from "react";

const tabList = [
  { key: "feature", label: "Feature Requests" },
  { key: "news", label: "What's New" },
  { key: "roadmap", label: "Roadmap" },
];

const ProductsTabModal = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState("feature");
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{
        background: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-fadeInRight relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
              S
            </div>
            <span className="font-bold text-lg text-gray-700">Primarily</span>
          </div>
          <button
            className="text-3xl text-gray-400 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {tabList.map((tab) => (
            <button
              key={tab.key}
              className={`py-4 px-4 font-semibold text-base border-b-2 transition-all duration-150 ${
                activeTab === tab.key
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "feature" && (
            <div className="text-gray-700">
              Feature Requests content (placeholder)
            </div>
          )}
          {activeTab === "news" && (
            <div className="text-gray-700">
              What's New content (placeholder)
            </div>
          )}
          {activeTab === "roadmap" && (
            <div className="text-gray-700">Roadmap content (placeholder)</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsTabModal;
