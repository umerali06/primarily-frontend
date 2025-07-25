import React, { useState } from "react";
import {
  TbBox,
  TbDotsVertical,
  TbSearch,
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
import GreenButton from "./GreenButton";
import PhotoUploadBox from "./PhotoUploadBox";
import FolderContextMenu from "./FolderContextMenu";

const FolderDetails = ({
  folders,
  selectedFolder,
  setSelectedFolder,
  openContextMenu,
  handleContextMenuOpen,
  folderMenuRef,
  setShowHistory,
  selectedFolderDetails,
  setSelectedFolderDetails,
  setOpenContextMenu,
  onHistory,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(selectedFolderDetails?.name || "");
  const [tags, setTags] = useState(
    selectedFolderDetails?.tags?.join(", ") || ""
  );
  const [notes, setNotes] = useState(selectedFolderDetails?.notes || "");

  // Handler for context menu edit
  const handleEdit = () => {
    setEditMode(true);
    setOpenContextMenu({ type: null, id: null });
  };

  // Handler for cancel/close edit
  const handleCancelEdit = () => {
    setEditMode(false);
    setName(selectedFolderDetails?.name || "");
    setTags(selectedFolderDetails?.tags?.join(", ") || "");
    setNotes(selectedFolderDetails?.notes || "");
  };

  // Handler for save (implement real logic as needed)
  const handleSave = () => {
    // Save logic here
    setEditMode(false);
  };

  if (editMode) {
    return (
      <div className="flex-1 flex flex-col h-full bg-gray-50">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 btn-primary text-white px-8 py-4 flex items-center justify-between shadow-md">
          <h1 className="text-2xl font-bold truncate">Edit Folder: {name}</h1>
          <button
            onClick={handleCancelEdit}
            className="text-white hover:text-[#e6f3f1] font-semibold text-lg"
          >
            ×
          </button>
        </div>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form className="max-w-2xl mx-auto">
            <label className="block mb-2 font-medium">
              Name<span className="text-green-500">*</span>
            </label>
            <input
              className="w-full border-b-2 mb-4 focus:border-primary outline-none text-lg px-1 py-2 border-green-400"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="block mb-2 font-medium">Tags</label>
            <input
              className="w-full border rounded px-3 py-2 focus:border-primary mb-4"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <label className="block mb-2 font-medium">Notes</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:border-primary mb-4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <PhotoUploadBox onFilesChange={() => {}} />
            {/* Add more fields as needed */}
          </form>
        </div>
        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-30 bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-end gap-4 shadow-md">
          <button
            onClick={handleCancelEdit}
            className="px-6 py-2 rounded-lg font-semibold text-base border border-primary text-[#0a7662] bg-white hover:bg-[#e6f3f1]"
          >
            Cancel
          </button>
          <GreenButton onClick={handleSave}>Save</GreenButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar (can be hidden or shown as needed) */}
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
              <li key={folder._id} className="mb-2">
                <div
                  className={`group flex items-center gap-2 px-2 py-1 rounded w-full text-left transition hover:bg-[#e6f3f1] cursor-pointer relative ${
                    selectedFolder === folder._id
                      ? "bg-[#e6f3f1] text-[#0a7662] font-bold"
                      : "text-gray-700"
                  }`}
                  onClick={() => setSelectedFolder(folder._id)}
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
                      handleContextMenuOpen("folder", folder._id);
                    }}
                    aria-label="Open folder menu"
                    tabIndex={0}
                  >
                    <TbDotsVertical size={20} />
                  </button>
                  {openContextMenu.type === "folder" &&
                    openContextMenu.id === folder._id && (
                      <FolderContextMenu
                        folder={folder}
                        folders={folders}
                        folderMenuRef={folderMenuRef}
                        setSelectedFolderDetails={setSelectedFolderDetails}
                        setOpenContextMenu={setOpenContextMenu}
                        onEdit={handleEdit}
                        onHistory={onHistory}
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
          <button
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#0a7662]"
            onClick={() => setShowHistory(true)}
          >
            🗑️ Trash
          </button>
        </div>
      </aside>
      {/* Main Folder Details Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            className="bg-[#e6f3f1] text-[#0a7662] rounded-full px-3 py-1 font-semibold flex items-center gap-2 hover:bg-primarily-200"
            onClick={() => setSelectedFolderDetails(null)}
          >
            <TbBox className="text-[#0a7662]" /> All Items
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-[#0a7662]">
              {selectedFolderDetails?.name || "All Items"}
            </h1>
            <div className="flex gap-2">
              <button className="bg-white border border-gray-200 rounded p-2 hover:bg-gray-100">
                <TbBox className="text-[#0a7662]" />
              </button>
              <button className="bg-white border border-gray-200 rounded p-2 hover:bg-gray-100">
                <TbDotsVertical className="text-[#0a7662]" />
              </button>
            </div>
          </div>
          <div className="flex gap-8 text-gray-500 text-sm mb-4">
            <div>
              <span className="font-semibold text-gray-700">Primarily ID:</span>{" "}
              SKKXUR0001
            </div>
            <div>
              <span className="font-semibold text-gray-700">Updated at:</span>{" "}
              14/07/2025 1:13 PM
            </div>
          </div>
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="mb-4">
                <span className="font-semibold text-gray-700">
                  QR / BARCODES
                </span>
              </div>
              <button className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded px-4 py-2 mb-4 text-gray-700 hover:bg-gray-200">
                <TbBox className="text-[#0a7662]" /> ADD QR / BARCODE
              </button>
              <div className="flex gap-4 mb-4">
                <button className="text-[#0a7662] hover:underline text-sm font-semibold">
                  + ADD NEW FIELD
                </button>
                <button className="text-[#0a7662] hover:underline text-sm font-semibold">
                  MANAGE CUSTOM FIELDS
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full h-56 bg-gray-50 border border-dashed border-gray-200 rounded flex flex-col items-center justify-center">
                <TbBox className="text-5xl text-gray-300 mb-2" />
                <div className="text-gray-400 text-sm">
                  (Max 8 photos, 30 MB Total)
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <input
              type="text"
              placeholder="Tags"
              className="flex-1 bg-gray-100 rounded px-3 py-2 text-sm focus:outline-none"
            />
            <input
              type="text"
              placeholder="Notes"
              className="flex-1 bg-gray-100 rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderDetails;
