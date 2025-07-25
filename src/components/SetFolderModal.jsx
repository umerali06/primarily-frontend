import React, { useState } from "react";
import { TbBox } from "react-icons/tb";
import useInventoryStore from "../store/inventoryStore";

const SetFolderModal = ({
  open,
  onClose,
  onApply,
  selected = [],
  setSelected,
}) => {
  const { folders } = useInventoryStore();
  const [search, setSearch] = useState("");

  // Ensure selected is always an array
  const safeSelected = Array.isArray(selected) ? selected : [];

  const filteredFolders = folders.filter(
    (f) => f.name && f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id) => {
    setSelected((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.includes(id)
        ? safePrev.filter((x) => x !== id)
        : [...safePrev, id];
    });
  };

  const handleSelectAll = () => {
    const allFolderIds = folders.map((f) => f._id);
    setSelected((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.includes("all")
        ? safePrev.filter((x) => x !== "all" && !allFolderIds.includes(x))
        : ["all", ...allFolderIds];
    });
  };

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
      <div className="w-full max-w-sm h-full bg-white shadow-2xl flex flex-col animate-fadeInRight relative">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-100">
          <div className="font-bold text-lg text-gray-700">Folders</div>
        </div>
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
            placeholder="Search folders"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-2 flex items-center">
            <input
              type="checkbox"
              checked={safeSelected.includes("all")}
              onChange={handleSelectAll}
              className="mr-2"
            />
            <TbBox className="text-lg mr-2" /> All Items
          </div>
          {filteredFolders.map((folder) => (
            <div key={folder._id} className="mb-2 flex items-center ml-6">
              <input
                type="checkbox"
                checked={safeSelected.includes(folder._id)}
                onChange={() => handleToggle(folder._id)}
                className="mr-2"
              />
              <TbBox className="text-lg mr-2" /> {folder.name}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-100 bg-white">
          <button
            className="px-6 py-2 rounded-lg font-semibold text-base bg-pink-200 text-pink-700 hover:bg-pink-300 transition"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            className="px-6 py-2 rounded-lg font-semibold text-base btn-primary text-white hover:btn-primary-hover transition"
            onClick={() => onApply(safeSelected)}
          >
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetFolderModal;
