import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import useFolders from "../hooks/useFolders";
import { TbTag, TbPalette, TbCheck } from "react-icons/tb";
import toast from "react-hot-toast";

const FolderLabelModal = ({ open, onClose, folder, onSave }) => {
  const [labelName, setLabelName] = useState("");
  const [labelColor, setLabelColor] = useState("#3B82F6");
  const [labelIcon, setLabelIcon] = useState("");
  const [existingLabels, setExistingLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { getFolderLabels, createFolderLabel } = useFolders();

  const predefinedColors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#8B5CF6", // Purple
    "#F97316", // Orange
    "#06B6D4", // Cyan
    "#EC4899", // Pink
    "#6B7280", // Gray
    "#84CC16", // Lime
    "#F43F5E", // Rose
    "#8B5A2B", // Brown
  ];

  const predefinedIcons = [
    { value: "tag", label: "Tag", icon: "🏷️" },
    { value: "star", label: "Star", icon: "⭐" },
    { value: "heart", label: "Heart", icon: "❤️" },
    { value: "flag", label: "Flag", icon: "🚩" },
    { value: "bookmark", label: "Bookmark", icon: "🔖" },
    { value: "diamond", label: "Diamond", icon: "💎" },
    { value: "fire", label: "Fire", icon: "🔥" },
    { value: "lightning", label: "Lightning", icon: "⚡" },
    { value: "crown", label: "Crown", icon: "👑" },
    { value: "trophy", label: "Trophy", icon: "🏆" },
  ];

  useEffect(() => {
    if (open && folder) {
      loadExistingLabels();
      resetForm();
    }
  }, [open, folder]);

  const loadExistingLabels = async () => {
    if (!folder) return;

    try {
      const response = await getFolderLabels(folder._id);
      setExistingLabels(response.labels || []);
    } catch (error) {
      console.error("Failed to load existing labels:", error);
    }
  };

  const resetForm = () => {
    setLabelName("");
    setLabelColor("#3B82F6");
    setLabelIcon("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!labelName.trim()) {
      newErrors.labelName = "Label name is required";
    }

    // Check for duplicate label names
    if (
      existingLabels.some(
        (label) => label.name.toLowerCase() === labelName.trim().toLowerCase()
      )
    ) {
      newErrors.labelName = "A label with this name already exists";
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
      const labelData = {
        name: labelName.trim(),
        color: labelColor,
        icon: labelIcon,
      };

      const response = await createFolderLabel(folder._id, labelData);

      if (onSave) {
        onSave(response.label);
      }

      toast.success("Label created successfully!");
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create label";
      toast.error(errorMessage);

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

  if (!folder) return null;

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Create Folder Label"
      maxWidth="max-w-md"
      closeOnBackdrop={!isLoading}
    >
      <div className="mb-4 p-3 bg-primary-light border border-[var(--bg-primary)] rounded-lg">
        <p className="text-sm text-[var(--primary-dark)]">
          <span className="font-medium">Creating label for:</span> {folder.name}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Label Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Label Name<span className="text-green-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50 ${
              errors.labelName ? "border-red-400" : "border-gray-300"
            }`}
            value={labelName}
            onChange={(e) => {
              setLabelName(e.target.value);
              if (errors.labelName) {
                setErrors((prev) => ({ ...prev, labelName: null }));
              }
            }}
            disabled={isLoading}
            placeholder="Enter label name"
            required
          />
          {errors.labelName && (
            <p className="text-red-500 text-sm mt-1">{errors.labelName}</p>
          )}
        </div>

        {/* Color Selection */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Color</label>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {predefinedColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setLabelColor(color)}
                disabled={isLoading}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
                  labelColor === color
                    ? "border-gray-800 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color }}
              >
                {labelColor === color && (
                  <TbCheck className="w-4 h-4 text-white mx-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={labelColor}
              onChange={(e) => setLabelColor(e.target.value)}
              disabled={isLoading}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-sm text-gray-600">Custom color</span>
          </div>
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Icon (Optional)
          </label>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {predefinedIcons.map((iconOption) => (
              <button
                key={iconOption.value}
                type="button"
                onClick={() => setLabelIcon(iconOption.value)}
                disabled={isLoading}
                className={`p-2 border rounded-lg text-center transition-all duration-150 ${
                  labelIcon === iconOption.value
                    ? "border-primary bg-primary-light"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                title={iconOption.label}
              >
                <span className="text-lg">{iconOption.icon}</span>
              </button>
            ))}
          </div>

          {/* Clear Icon */}
          <button
            type="button"
            onClick={() => setLabelIcon("")}
            disabled={isLoading}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            No icon
          </button>
        </div>

        {/* Preview */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Preview
          </label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-white text-sm font-medium"
              style={{ backgroundColor: labelColor }}
            >
              {labelIcon && (
                <span>
                  {predefinedIcons.find((i) => i.value === labelIcon)?.icon}
                </span>
              )}
              <span>{labelName || "Label Name"}</span>
            </div>
          </div>
        </div>

        {/* Existing Labels */}
        {existingLabels.length > 0 && (
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Existing Labels
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg max-h-20 overflow-y-auto">
              {existingLabels.map((label) => (
                <div
                  key={label.id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-white text-xs"
                  style={{ backgroundColor: label.color }}
                >
                  {label.icon && (
                    <span>
                      {
                        predefinedIcons.find((i) => i.value === label.icon)
                          ?.icon
                      }
                    </span>
                  )}
                  <span>{label.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
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
            disabled={isLoading || !labelName.trim()}
            className="w-full sm:w-auto px-6 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <TbTag className="w-4 h-4" />
                Create Label
              </>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default FolderLabelModal;
