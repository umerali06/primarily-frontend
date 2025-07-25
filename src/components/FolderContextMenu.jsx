import React from "react";
import {
  TbEdit,
  TbFolder,
  TbHistory,
  TbTag,
  TbBell,
  TbDownload,
  TbCopy,
  TbKey,
  TbTrash,
} from "react-icons/tb";

const FolderContextMenu = ({
  folder,
  folders,
  folderMenuRef,
  setSelectedFolderDetails,
  setActiveTab,
  setOpenContextMenu,
  onEdit,
  onMove,
  onHistory,
  onCreateLabel,
  onSetAlert,
  onExport,
  onClone,
  onPermissions,
  onDelete,
}) => (
  <div
    ref={folderMenuRef}
    className="absolute right-0 top-8 z-50 bg-white rounded-xl shadow-lg py-2 w-56 flex flex-col animate-fadeIn"
    onClick={(e) => e.stopPropagation()}
    role="menu"
    aria-label="Folder actions"
  >
    <button
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 focus:bg-gray-100 focus:outline-none"
      role="menuitem"
      tabIndex={0}
      onClick={() => {
        if (onEdit) return onEdit();
        if (typeof setSelectedFolderDetails === "function") {
          const folderObj = folders.find((f) => f.id === folder.id);
          setSelectedFolderDetails(folderObj);
        }
        if (typeof setActiveTab === "function") setActiveTab("items");
        if (typeof setOpenContextMenu === "function")
          setOpenContextMenu({ type: null, id: null });
      }}
    >
      <TbEdit className="text-lg" /> Edit
    </button>
    <button
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 focus:bg-gray-100 focus:outline-none"
      role="menuitem"
      tabIndex={0}
      onClick={() => {
        if (typeof onMove === "function") onMove(folder);
      }}
    >
      <TbFolder className="text-lg" /> Move to folder
    </button>
    <button
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 focus:bg-gray-100 focus:outline-none"
      role="menuitem"
      tabIndex={0}
      onClick={() => {
        console.log("History clicked", folder);
        if (typeof onHistory === "function") onHistory(folder);
        if (typeof setOpenContextMenu === "function")
          setOpenContextMenu({ type: null, id: null });
      }}
    >
      <TbHistory className="text-lg" /> History
    </button>
    <button
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 focus:bg-gray-100 focus:outline-none"
      role="menuitem"
      tabIndex={0}
      onClick={() => {
        if (typeof onCreateLabel === "function") onCreateLabel(folder);
        if (typeof setOpenContextMenu === "function")
          setOpenContextMenu({ type: null, id: null });
      }}
    >
      <TbTag className="text-lg" /> Create Label
    </button>
    <button
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 focus:bg-gray-100 focus:outline-none"
      role="menuitem"
      tabIndex={0}
      onClick={() => {
        if (typeof onSetAlert === "function") onSetAlert(folder);
        if (typeof setOpenContextMenu === "function")
          setOpenContextMenu({ type: null, id: null });
      }}
    >
      <TbBell className="text-lg" /> Set Alert
    </button>
    <button
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 focus:bg-gray-100 focus:outline-none"
      role="menuitem"
      tabIndex={0}
      onClick={() => {
        if (typeof onExport === "function") onExport(folder);
        if (typeof setOpenContextMenu === "function")
          setOpenContextMenu({ type: null, id: null });
      }}
    >
      <TbDownload className="text-lg" /> Export
    </button>
    <button
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 focus:bg-gray-100 focus:outline-none"
      role="menuitem"
      tabIndex={0}
      onClick={() => {
        if (typeof onClone === "function") onClone(folder);
        if (typeof setOpenContextMenu === "function")
          setOpenContextMenu({ type: null, id: null });
      }}
    >
      <TbCopy className="text-lg" /> Clone
    </button>
    <button
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 focus:bg-gray-100 focus:outline-none"
      role="menuitem"
      tabIndex={0}
      onClick={() => {
        if (typeof onPermissions === "function") onPermissions(folder);
        if (typeof setOpenContextMenu === "function")
          setOpenContextMenu({ type: null, id: null });
      }}
    >
      <TbKey className="text-lg" /> Permissions
    </button>
    <button
      className="flex items-center gap-3 px-4 py-2 hover:bg-green-50 text-green-600 focus:bg-green-100 focus:outline-none"
      role="menuitem"
      tabIndex={0}
      onClick={() => {
        if (typeof onDelete === "function") onDelete(folder);
        if (typeof setOpenContextMenu === "function")
          setOpenContextMenu({ type: null, id: null });
      }}
    >
      <TbTrash className="text-lg" /> Delete
    </button>
  </div>
);

export default FolderContextMenu;
