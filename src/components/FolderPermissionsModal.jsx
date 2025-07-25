import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import useFolders from "../hooks/useFolders";
import { TbLock, TbUser, TbUserPlus, TbTrash, TbSearch } from "react-icons/tb";
import toast from "react-hot-toast";

const FolderPermissionsModal = ({ open, onClose, folder, onSave }) => {
  const [permissions, setPermissions] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("viewer");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { getFolderPermissions, setFolderPermissions } = useFolders();

  const roleOptions = [
    {
      value: "owner",
      label: "Owner",
      description: "Full access including delete",
    },
    {
      value: "editor",
      label: "Editor",
      description: "Can edit and manage items",
    },
    { value: "viewer", label: "Viewer", description: "Can only view items" },
  ];

  useEffect(() => {
    if (open && folder) {
      loadPermissions();
    }
  }, [open, folder]);

  const loadPermissions = async () => {
    if (!folder) return;

    setIsLoading(true);
    try {
      const response = await getFolderPermissions(folder._id);
      // Handle both response structures
      const permissionsData =
        response.data?.permissions || response.permissions || [];
      setPermissions(permissionsData);
    } catch (error) {
      console.error("Error loading folder permissions:", error);
      toast.error("Failed to load folder permissions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    if (!newUserEmail.trim()) {
      toast.error("Please enter a user email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check if user already has permissions
    if (permissions.some((p) => p.userEmail === newUserEmail.trim())) {
      toast.error("User already has permissions for this folder");
      return;
    }

    const newPermission = {
      id: Date.now().toString(),
      userEmail: newUserEmail.trim(),
      role: newUserRole,
      inherited: false,
      isNew: true,
    };

    setPermissions((prev) => [...prev, newPermission]);
    setNewUserEmail("");
    setNewUserRole("viewer");
    toast.success(`Added ${newUserEmail.trim()} as ${newUserRole}`);
  };

  const handleRemoveUser = (permissionId) => {
    const permission = permissions.find((p) => p.id === permissionId);
    if (permission) {
      if (
        window.confirm(
          `Are you sure you want to remove ${permission.userEmail} from this folder?`
        )
      ) {
        setPermissions((prev) => prev.filter((p) => p.id !== permissionId));
        toast.success(
          `Removed ${permission.userEmail} from folder permissions`
        );
      }
    }
  };

  const handleRoleChange = (permissionId, newRole) => {
    const permission = permissions.find((p) => p.id === permissionId);
    if (permission && permission.role !== newRole) {
      setPermissions((prev) =>
        prev.map((p) => (p.id === permissionId ? { ...p, role: newRole } : p))
      );
      toast.success(`Changed ${permission.userEmail} role to ${newRole}`);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setFolderPermissions(folder._id, permissions);

      if (onSave) {
        onSave(permissions);
      }

      toast.success("Folder permissions updated successfully!");
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update permissions"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPermissions = permissions.filter(
    (p) =>
      p.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!folder) return null;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Folder Permissions"
      maxWidth="max-w-2xl"
      closeOnBackdrop={!isSaving}
    >
      <div className="space-y-4">
        {/* Folder Info */}
        <div className="p-3 bg-primary-light border border-[var(--bg-primary)] rounded-lg">
          <p className="text-sm text-[var(--primary-dark)]">
            <span className="font-medium">Managing permissions for:</span>{" "}
            {folder.name}
          </p>
        </div>

        {/* Add New User */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3">Add User</h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter user email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddUser();
                }
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
              disabled={isSaving}
            />
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
              disabled={isSaving}
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddUser}
              disabled={isSaving}
              className="px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors duration-150 disabled:opacity-50 flex items-center gap-2"
            >
              <TbUserPlus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Search Users */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
          />
          <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Permissions List */}
        <div className="border border-gray-200 rounded-lg">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-800">Current Permissions</h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500">Loading permissions...</p>
              </div>
            ) : filteredPermissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TbLock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                {searchTerm ? (
                  <>
                    <p>No permissions match your search</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search terms
                    </p>
                  </>
                ) : permissions.length === 0 ? (
                  <>
                    <p>No permissions set</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add users above to grant them access to this folder
                    </p>
                  </>
                ) : (
                  <p>No permissions found</p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredPermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <TbUser className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {permission.userName || permission.userEmail}
                        </p>
                        {permission.userName && (
                          <p className="text-sm text-gray-500">
                            {permission.userEmail}
                          </p>
                        )}
                        {permission.inherited && (
                          <p className="text-xs text-primary">
                            Inherited from parent
                          </p>
                        )}
                        {permission.isNew && (
                          <p className="text-xs text-primary">
                            New permission
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={permission.role}
                        onChange={(e) =>
                          handleRoleChange(permission.id, e.target.value)
                        }
                        disabled={permission.inherited || isSaving}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        {roleOptions.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>

                      {!permission.inherited && permission.role !== "owner" && (
                        <button
                          onClick={() => handleRemoveUser(permission.id)}
                          disabled={isSaving}
                          className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors duration-150 disabled:opacity-50"
                          title="Remove user"
                        >
                          <TbTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Role Descriptions */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Role Descriptions</h4>
          <div className="space-y-1 text-sm">
            {roleOptions.map((role) => (
              <div key={role.value} className="flex justify-between">
                <span className="font-medium">{role.label}:</span>
                <span className="text-gray-600">{role.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <TbLock className="w-4 h-4" />
                Save Permissions
              </>
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default FolderPermissionsModal;
