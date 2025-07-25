import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import PhotoUploadBox from "./PhotoUploadBox";
import FolderDropdown from "./FolderDropdown";
import useFolders from "../hooks/useFolders";
import toast from "react-hot-toast";

const CloneFolderModal = ({ open, onClose, sourceFolder, onClone }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [parentId, setParentId] = useState("all");
  const [images, setImages] = useState([]);
  const [includeItems, setIncludeItems] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { cloneFolder, updateFolder } = useFolders();

  // Pre-populate form when source folder changes
  useEffect(() => {
    if (sourceFolder && open) {
      // Generate automatic name with "(Copy)" suffix
      const baseName = sourceFolder.name || "Untitled Folder";
      const copyName = `${baseName} (Copy)`;

      setName(copyName);
      setDescription(sourceFolder.description || "");
      setTags(sourceFolder.tags ? sourceFolder.tags.join(", ") : "");
      setNotes(sourceFolder.notes || "");
      setParentId(sourceFolder.parentId || "all");
      setImages(sourceFolder.images || []);
      setIncludeItems(true);
      setErrors({});
    }
  }, [sourceFolder, open]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setTags("");
    setNotes("");
    setParentId("all");
    setImages([]);
    setIncludeItems(true);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Folder name is required";
    } else if (name.trim().length > 100) {
      newErrors.name = "Folder name cannot be more than 100 characters";
    }

    if (description && description.length > 1000) {
      newErrors.description = "Description cannot be more than 1000 characters";
    }

    if (notes && notes.length > 1000) {
      newErrors.notes = "Notes cannot be more than 1000 characters";
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
      // First, clone the folder with basic properties
      const response = await cloneFolder(
        sourceFolder._id,
        name.trim(),
        includeItems
      );

      // If the clone was successful and we have additional properties to update
      const folderData = {
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

      // Check if any properties are different from source
      const hasChanges =
        description.trim() !== (sourceFolder.description || "") ||
        notes.trim() !== (sourceFolder.notes || "") ||
        parentId !== (sourceFolder.parentId || "all") ||
        JSON.stringify(images) !== JSON.stringify(sourceFolder.images || []) ||
        JSON.stringify(folderData.tags) !==
          JSON.stringify(sourceFolder.tags || []);

      // Update the cloned folder if there are changes and we have a valid response
      if (hasChanges && response?.folder?._id) {
        try {
          await updateFolder(response.folder._id, folderData);
        } catch (updateError) {
          console.warn(
            "Failed to update cloned folder properties:",
            updateError
          );
          // Don't fail the entire operation if update fails
        }
      }

      if (onClone) {
        onClone(response.folder || response.data?.folder);
      }

      toast.success("Folder cloned successfully");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Clone folder error:", error);

      let errorMessage = "Failed to clone folder";

      // Handle different types of errors
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle validation errors specifically
      if (error.response?.status === 400) {
        if (error.response.data?.message?.includes("name already exists")) {
          setErrors({ name: "A folder with this name already exists" });
          return;
        }
      }

      toast.error(errorMessage);

      // Set field-specific errors if available
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
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

  if (!sourceFolder) return null;

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Clone Folder"
      maxWidth="max-w-lg"
      closeOnBackdrop={!isLoading}
    >
      <div className="mb-4 p-3 bg-primary-light border border-[var(--bg-primary)] rounded-lg">
        <p className="text-sm text-[var(--primary-dark)]">
          <span className="font-medium">Cloning:</span> {sourceFolder.name}
        </p>
        <p className="text-xs text-primary mt-1">
          This will create a copy of the folder with all its properties.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            New Folder Name<span className="text-green-500">*</span>
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

        {/* Include Items Option */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="includeItems"
            checked={includeItems}
            onChange={(e) => setIncludeItems(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary ring-opacity-50"
          />
          <label
            htmlFor="includeItems"
            className="text-sm font-medium text-gray-700"
          >
            Include all items from the original folder
          </label>
        </div>

        {/* Description Field */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            className={`w-full border rounded px-3 py-2 focus:border-primary focus:outline-none resize-none ${
              errors.description ? "border-red-400" : ""
            }`}
            rows="3"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: null }));
              }
            }}
            disabled={isLoading}
            placeholder="Optional description for the cloned folder"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
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
            className={`w-full border rounded px-3 py-2 focus:border-primary focus:outline-none resize-none ${
              errors.notes ? "border-red-400" : ""
            }`}
            rows="3"
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              if (errors.notes) {
                setErrors((prev) => ({ ...prev, notes: null }));
              }
            }}
            disabled={isLoading}
            placeholder="Additional notes about the cloned folder"
          />
          {errors.notes && (
            <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
          )}
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

        {/* Parent Folder */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Parent Folder
          </label>
          <FolderDropdown
            value={parentId}
            onChange={setParentId}
            excludeId={sourceFolder._id} // Prevent placing clone inside source
            disabled={isLoading}
          />
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
                Cloning...
              </>
            ) : (
              "Clone Folder"
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default CloneFolderModal;
