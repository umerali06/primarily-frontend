import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import PhotoUploadBox from "./PhotoUploadBox";
import FolderDropdown from "./FolderDropdown";
import useFolders from "../hooks/useFolders";
import toast from "react-hot-toast";

const EditFolderModal = ({ open, onClose, folder, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [parentId, setParentId] = useState("all");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { updateFolder, folders } = useFolders();

  // Pre-populate form when folder changes
  useEffect(() => {
    if (folder && open) {
      setName(folder.name || "");
      setDescription(folder.description || "");
      setTags(folder.tags ? folder.tags.join(", ") : "");
      setNotes(folder.notes || "");
      setParentId(folder.parentId || "all");
      setImages(folder.images || []);
      setErrors({});
    }
  }, [folder, open]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setTags("");
    setNotes("");
    setParentId("all");
    setImages([]);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Folder name is required";
    }

    // Check for circular reference if changing parent
    if (parentId !== "all" && parentId === folder?._id) {
      newErrors.parentId = "Cannot move folder into itself";
    }

    // Check if moving to a descendant folder (would create circular reference)
    if (parentId !== "all" && folder && folders) {
      const isDescendant = (folderId, targetId) => {
        const targetFolder = folders.find((f) => f._id === targetId);
        if (!targetFolder) return false;

        if (targetFolder.parentId === folderId) return true;
        if (targetFolder.parentId) {
          return isDescendant(folderId, targetFolder.parentId);
        }
        return false;
      };

      if (isDescendant(folder._id, parentId)) {
        newErrors.parentId = "Cannot move folder into its own descendant";
      }
    }

    // Check for duplicate names in the same parent folder
    if (folders && name.trim()) {
      const targetParentId = parentId === "all" ? null : parentId;
      const duplicateFolder = folders.find(
        (f) =>
          f._id !== folder?._id &&
          f.name.toLowerCase() === name.trim().toLowerCase() &&
          f.parentId === targetParentId
      );

      if (duplicateFolder) {
        newErrors.name =
          "A folder with this name already exists in the selected parent folder";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const folderData = {
        name: name.trim(),
        description: description.trim(),
        tags: tags
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        notes: notes.trim(),
        parentId: parentId === "all" ? null : parentId,
        images: images,
      };

      const updatedFolder = await updateFolder(folder._id, folderData);

      if (onSave) {
        onSave(updatedFolder || { ...folder, ...folderData });
      }

      toast.success("Folder updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating folder:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update folder";
      toast.error(errorMessage);

      // Set field-specific errors if available
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (errorMessage.includes("already exists")) {
        setErrors({ name: errorMessage });
      } else if (errorMessage.includes("circular")) {
        setErrors({ parentId: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  const handleParentIdChange = (newParentId) => {
    setParentId(newParentId);

    // Clear parentId error when user changes selection
    if (errors.parentId) {
      setErrors((prev) => ({ ...prev, parentId: null }));
    }

    // Clear name error if it was due to duplicate in previous parent
    if (errors.name && errors.name.includes("already exists")) {
      setErrors((prev) => ({ ...prev, name: null }));
    }
  };

  if (!folder) return null;

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Edit Folder"
      maxWidth="max-w-lg"
      closeOnBackdrop={!isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Name<span className="text-green-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full border-b-2 mb-1 focus:border-primary outline-none text-lg px-1 py-2 ${
              errors.name ? "border-red-400" : "border-gray-300"
            }`}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: null }));
              }
            }}
            disabled={isLoading}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="w-full border rounded px-3 py-2 focus:border-primary focus:outline-none resize-none"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            placeholder="Optional description for this folder"
          />
        </div>

        {/* Tags Field */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Tags (comma separated)
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:border-primary focus:outline-none"
            placeholder="e.g. office, storage, equipment"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Notes Field */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Notes</label>
          <textarea
            className="w-full border rounded px-3 py-2 focus:border-primary focus:outline-none resize-none"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            placeholder="Additional notes about this folder"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Images</label>
          <PhotoUploadBox
            onFilesChange={setImages}
            initialImages={images}
            disabled={isLoading}
          />
        </div>

        {/* Parent Folder - Move this up for better UX */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Parent Folder
          </label>
          <FolderDropdown
            value={parentId}
            onChange={handleParentIdChange}
            excludeId={folder._id} // Prevent circular reference
            disabled={isLoading}
            error={errors.parentId}
            placeholder="Select parent folder (optional)"
            allowRoot={true}
          />
          <p className="text-sm text-gray-500 mt-1">
            Choose where this folder should be located. Leave as "Root Folder"
            to place it at the top level.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full sm:w-auto px-6 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              "Update Folder"
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditFolderModal;
