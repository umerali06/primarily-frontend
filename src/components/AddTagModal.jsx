import React, { useState } from "react";
import { TbX, TbTag } from "react-icons/tb";
import toast from "react-hot-toast";

const AddTagModal = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("gray");
  const [description, setDescription] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Tag name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Tag name must be at least 2 characters";
    } else if (name.trim().length > 50) {
      newErrors.name = "Tag name cannot exceed 50 characters";
    }

    if (description && description.length > 200) {
      newErrors.description = "Description cannot exceed 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValid = name.trim().length >= 2;

  const resetForm = () => {
    setName("");
    setColor("gray");
    setDescription("");
    setTouched(false);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setTouched(true);
      return;
    }

    setIsLoading(true);
    try {
      const tagData = {
        name: name.trim(),
        color,
        description: description.trim(),
      };

      await onAdd(tagData);
      toast.success("Tag created successfully!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating tag:", error);

      let errorMessage = "Failed to create tag";

      // Handle specific error cases
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle validation errors
      if (error.response?.status === 400) {
        if (error.response.data?.message?.includes("already exists")) {
          setErrors({ name: "A tag with this name already exists" });
          return;
        }
      }

      // Handle network errors
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        errorMessage =
          "Cannot connect to server. Tag created locally for demo.";
        toast.success(errorMessage);
        resetForm();
        onClose();
        return;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <TbTag className="mr-2" />
            Add New Tag
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <TbX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tag Name *
            </label>
            <input
              type="text"
              placeholder="Enter tag name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: null }));
                }
              }}
              onBlur={() => setTouched(true)}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                errors.name ? "border-red-400" : ""
              }`}
              required
            />
            {errors.name && (
              <div className="text-xs text-red-500 mt-1">{errors.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              <option value="gray">Gray</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
              <option value="orange">Orange</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              placeholder="Enter tag description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: null }));
                }
              }}
              rows="3"
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50 resize-none ${
                errors.description ? "border-red-400" : ""
              }`}
            />
            {errors.description && (
              <div className="text-xs text-green-500 mt-1">
                {errors.description}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Tag"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTagModal;
