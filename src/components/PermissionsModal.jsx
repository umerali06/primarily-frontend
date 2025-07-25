import React, { useState } from "react";

const mockUsers = [
  {
    id: 1,
    name: "umeee king",
    initials: "UK",
    role: "Owner",
    permission: "View and Edit",
  },
];

const PermissionsModal = ({ open, onClose, users = mockUsers }) => {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative animate-fadeIn flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="text-xl font-semibold text-gray-700">
            Folder Permissions
          </div>
          <button
            className="text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {/* Search */}
        <div className="px-8 pb-2">
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50 text-base"
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Users with access */}
        <div className="px-8 pt-2 flex-1">
          <div className="text-xs text-gray-500 font-semibold mb-2 tracking-wider">
            USERS WITH ACCESS
          </div>
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-500">
                {user.initials}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 leading-tight">
                  {user.name}
                </div>
                <div className="text-xs text-gray-400">{user.role}</div>
              </div>
              <button className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm font-medium cursor-default">
                {user.permission}
              </button>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="flex items-center justify-end px-8 py-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            className="px-8 py-3 rounded-lg font-semibold text-white bg-gray-200 cursor-not-allowed"
            disabled
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;
