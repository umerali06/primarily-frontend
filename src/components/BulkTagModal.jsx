import React, { useState, useEffect } from "react";
import { TbX, TbTag, TbCheck, TbLoader, TbPlus } from "react-icons/tb";
import useInventory from "../hooks/useInventory";
import toast from "react-hot-toast";

const BulkTagModal = ({ open, onClose, selectedItems = [], onTagsUpdated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [operation, setOperation] = useState("add"); // "add" or "remove"

  const { fetchTags, bulkUpdateItems } = useInventory();

  // Fetch available tags when modal opens
  useEffect(() => {
    if (open) {
      const loadTags = async () => {
        try {
          const response = await fetchTags();
          const tagsData =
            response.data?.tags ||
            response.tags ||
            response.data ||
            response ||
            [];
          setAvailableTags(tagsData);
        } catch (err) {
          console.error("Error fetching tags:", err);
          toast.error("Failed to load tags");
        }
      };

      loadTags();
      setSelectedTags([]);
      setNewTag("");
    }
  }, [open, fetchTags]);

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddNewTag = () => {
    if (!newTag.trim()) return;

    const tagName = newTag.trim().toLowerCase();

    if (selectedTags.includes(tagName)) {
      toast.error("Tag already selected");
      return;
    }

    if (!availableTags.includes(tagName)) {
      setAvailableTags([...availableTags, tagName]);
    }

    setSelectedTags([...selectedTags, tagName]);
    setNewTag("");
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag");
      return;
    }

    setIsLoading(true);
    try {
      const itemIds = selectedItems.map((item) => item._id);

      if (operation === "add") {
        // Add tags to items
        await bulkUpdateItems(itemIds, {
          $addToSet: { tags: { $each: selectedTags } },
        });
        toast.success(`Added tags to ${selectedItems.length} items`);
      } else {
        // Remove tags from items
        await bulkUpdateItems(itemIds, {
          $pullAll: { tags: selectedTags },
        });
        toast.success(`Removed tags from ${selectedItems.length} items`);
      }

      if (onTagsUpdated) {
        onTagsUpdated(selectedItems, selectedTags, operation);
      }

      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update tags");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] px-2 sm:px-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        style={{ backdropFilter: "blur(2px)" }}
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {operation === "add" ? "Add Tags" : "Remove Tags"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            disabled={isLoading}
          >
            <TbX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              {operation === "add"
                ? `Add tags to ${selectedItems.length} selected items`
                : `Remove tags from ${selectedItems.length} selected items`}
            </p>

            {/* Operation Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-4">
              <button
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  operation === "add"
                    ? "btn-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setOperation("add")}
              >
                Add Tags
              </button>
              <button
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  operation === "remove"
                    ? "btn-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setOperation("remove")}
              >
                Remove Tags
              </button>
            </div>

            {/* New Tag Input */}
            {operation === "add" && (
              <div className="flex mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter a new tag"
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddNewTag();
                    }
                  }}
                />
                <button
                  onClick={handleAddNewTag}
                  className="btn-primary text-white px-3 py-2 rounded-r-lg hover:btn-primary-hover transition-colors"
                >
                  <TbPlus size={20} />
                </button>
              </div>
            )}

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected Tags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-light text-[var(--primary-dark)]"
                    >
                      <TbTag className="mr-1" size={14} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagSelect(tag)}
                        className="ml-1 text-primary hover:text-[var(--primary-dark)]"
                      >
                        <TbX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Tags */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Available Tags:
              </p>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {availableTags.length === 0 ? (
                  <p className="text-gray-500 text-sm p-2">No tags available</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagSelect(tag)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? "btn-primary text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        <TbTag className="mr-1" size={14} />
                        {tag}
                        {selectedTags.includes(tag) && (
                          <TbCheck className="ml-1" size={14} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || selectedTags.length === 0}
            className="px-6 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <TbLoader className="animate-spin" size={18} />
                Processing...
              </>
            ) : (
              <>{operation === "add" ? "Add Tags" : "Remove Tags"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkTagModal;
