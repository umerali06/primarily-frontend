import React from "react";
import { TbSearch, TbBox, TbDotsVertical } from "react-icons/tb";
import FolderContextMenu from "./FolderContextMenu";

const FolderTree = ({
  folders,
  selectedFolder,
  setSelectedFolder,
  openContextMenu,
  handleContextMenuOpen,
  folderMenuRef,
  setSelectedFolderDetails,
  setActiveTab,
  setOpenContextMenu,
  setShowHistory,
  onMove,
  onHistory,
  onCreateLabel,
  onSetAlert,
  onExport,
  onClone,
  onPermissions,
  onDelete,
}) => (
  <aside className="w-72 bg-white border-r border-gray-200 p-4 flex flex-col">
    <div className="flex items-center mb-4">
      <TbSearch className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search folders"
        className="flex-1 bg-gray-100 rounded px-3 py-2 text-sm focus:outline-none"
      />
    </div>
    <div className="mb-4">
      <div className="font-semibold text-gray-700 mb-2">All Items</div>
      <ul className="pl-2">
        <li className="mb-2">
          <button
            className={`flex items-center gap-2 px-2 py-1 rounded w-full text-left transition hover:bg-[#e6f3f1] ${
              selectedFolder === "all"
                ? "bg-[#e6f3f1] text-[#0a7662] font-bold"
                : "text-gray-700"
            }`}
            onClick={() => setSelectedFolder("all")}
          >
            <span className="text-lg">
              <TbBox />
            </span>
            All Items
          </button>
        </li>
        {folders.map((folder) => (
          <li key={folder.id} className="mb-2">
            <div
              className={`group flex items-center gap-2 px-2 py-1 rounded w-full text-left transition hover:bg-[#e6f3f1] cursor-pointer relative ${
                selectedFolder === folder.id
                  ? "bg-[#e6f3f1] text-[#0a7662] font-bold"
                  : "text-gray-700"
              }`}
              onClick={() => setSelectedFolder(folder.id)}
              style={{ minWidth: 0 }}
            >
              <span className="text-lg flex-shrink-0">
                <TbBox />
              </span>
              <span
                className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-2"
                title={folder.name}
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {folder.name}
              </span>
              <button
                className="ml-auto text-gray-400 hover:text-gray-700 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleContextMenuOpen("folder", folder.id);
                }}
                aria-label="Open folder menu"
                tabIndex={0}
              >
                <TbDotsVertical size={20} />
              </button>
              {openContextMenu.type === "folder" &&
                openContextMenu.id === folder.id && (
                  <FolderContextMenu
                    folder={folder}
                    folders={folders}
                    folderMenuRef={folderMenuRef}
                    setSelectedFolderDetails={setSelectedFolderDetails}
                    setActiveTab={setActiveTab}
                    setOpenContextMenu={setOpenContextMenu}
                    onEdit={() => setSelectedFolderDetails(folder)}
                    onMove={onMove}
                    onHistory={onHistory}
                    onCreateLabel={onCreateLabel}
                    onSetAlert={onSetAlert}
                    onExport={onExport}
                    onClone={onClone}
                    onPermissions={onPermissions}
                    onDelete={onDelete}
                  />
                )}
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-auto pt-4 border-t border-gray-100">
      <button
        className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#0a7662] mb-2"
        onClick={() => setShowHistory(true)}
      >
        <TbSearch className="text-base" /> History
      </button>
    </div>
  </aside>
);

export default FolderTree;
