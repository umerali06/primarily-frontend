import React, { useRef, useState } from "react";
import {
  TbDotsVertical,
  TbEdit,
  TbCopy,
  TbHistory,
  TbFolderShare,
  TbLock,
  TbBell,
  TbDownload,
  TbTag,
  TbTrash,
} from "react-icons/tb";
import DropdownPositioner from "./DropdownPositioner";

const FolderActionDropdown = ({
  folder,
  onEdit,
  onClone,
  onHistory,
  onMove,
  onPermissions,
  onSetAlert,
  onExport,
  onCreateLabel,
  onDelete,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  const actions = [
    {
      key: "edit",
      label: "Edit Folder",
      icon: <TbEdit className="text-lg" />,
      onClick: onEdit,
      color: "text-primary",
    },
    {
      key: "clone",
      label: "Clone Folder",
      icon: <TbCopy className="text-lg" />,
      onClick: onClone,
      color: "text-primary",
    },
    {
      key: "history",
      label: "View History",
      icon: <TbHistory className="text-lg" />,
      onClick: onHistory,
      color: "text-purple-600",
    },
    {
      key: "move",
      label: "Move to Folder",
      icon: <TbFolderShare className="text-lg" />,
      onClick: onMove,
      color: "text-orange-600",
    },
    {
      key: "permissions",
      label: "Permissions",
      icon: <TbLock className="text-lg" />,
      onClick: onPermissions,
      color: "text-indigo-600",
    },
    {
      key: "alert",
      label: "Set Alert",
      icon: <TbBell className="text-lg" />,
      onClick: onSetAlert,
      color: "text-yellow-600",
    },
    {
      key: "export",
      label: "Export",
      icon: <TbDownload className="text-lg" />,
      onClick: onExport,
      color: "text-teal-600",
    },
    {
      key: "label",
      label: "Create Label",
      icon: <TbTag className="text-lg" />,
      onClick: onCreateLabel,
      color: "text-pink-600",
    },
    {
      key: "delete",
      label: "Delete Folder",
      icon: <TbTrash className="text-lg" />,
      onClick: onDelete,
      color: "text-green-600",
      separator: true,
    },
  ];

  const handleActionClick = (action) => {
    setIsOpen(false);
    if (action.onClick) {
      action.onClick(folder);
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-400"
        aria-label="Folder actions"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <TbDotsVertical className="text-lg text-gray-600" />
      </button>

      <DropdownPositioner
        isOpen={isOpen}
        triggerRef={triggerRef}
        placement="bottom-right"
        onClickOutside={() => setIsOpen(false)}
        className="animate-fadeIn"
      >
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[200px]">
          {actions.map((action) => (
            <div key={action.key}>
              {action.separator && (
                <div className="border-t border-gray-100 my-1" />
              )}
              <button
                onClick={() => handleActionClick(action)}
                className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${action.color}`}
              >
                <span className="mr-3">{action.icon}</span>
                <span className="font-medium">{action.label}</span>
              </button>
            </div>
          ))}
        </div>
      </DropdownPositioner>
    </div>
  );
};

export default FolderActionDropdown;
