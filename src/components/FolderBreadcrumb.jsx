import React from "react";
import { TbChevronRight, TbFolder, TbHome } from "react-icons/tb";

const FolderBreadcrumb = ({ currentPath = [], onNavigate, className = "" }) => {
  const handleNavigate = (folderId, index) => {
    if (onNavigate) {
      onNavigate(folderId, index);
    }
  };

  if (!currentPath || currentPath.length === 0) {
    return (
      <div className={`flex items-center text-sm text-gray-500 ${className}`}>
        <TbHome className="text-lg mr-1" />
        <span>All Folders</span>
      </div>
    );
  }

  return (
    <nav
      className={`flex items-center text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {/* Root/Home */}
        <li>
          <button
            onClick={() => handleNavigate(null, -1)}
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-150"
          >
            <TbHome className="text-lg mr-1" />
            <span>All Folders</span>
          </button>
        </li>

        {/* Path segments */}
        {currentPath.map((folder, index) => (
          <li key={folder._id || folder.id} className="flex items-center">
            <TbChevronRight className="text-gray-400 mx-1" />
            <button
              onClick={() => handleNavigate(folder._id || folder.id, index)}
              className={`flex items-center transition-colors duration-150 ${
                index === currentPath.length - 1
                  ? "text-gray-900 font-medium cursor-default"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              disabled={index === currentPath.length - 1}
            >
              <TbFolder className="text-lg mr-1" />
              <span className="truncate max-w-[150px]" title={folder.name}>
                {folder.name}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default FolderBreadcrumb;
