import React from "react";

const StickyHeader = ({ title, GREEN }) => (
  <header
    className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 flex items-center justify-between px-8 py-6 shadow-sm"
    style={{ minHeight: 80 }}
  >
    <h1
      className="text-3xl font-bold text-gray-800"
      style={{ color: GREEN.main }}
    >
      {title}
    </h1>
    {/* Add right-side actions here if needed */}
  </header>
);

export default StickyHeader;
