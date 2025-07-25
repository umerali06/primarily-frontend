import React from "react";

const NewsTab = ({ GREEN }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-3xl font-bold mb-6" style={{ color: GREEN.main }}>
      Product News
    </h1>
    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-700 max-w-lg">
      Product news and updates coming soon.
    </div>
  </div>
);

export default NewsTab;
