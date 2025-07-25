import React, { useState, useEffect } from "react";
import { TbX, TbScan } from "react-icons/tb";
import useInventory from "../hooks/useInventory";
import PhotoUploadBox from "./PhotoUploadBox";
import toast from "react-hot-toast";

const AddItemModal = ({ open, onClose, editingItem = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
    unit: "pieces",
    price: 0,
    minLevel: 0,
    location: "",
    notes: "",
    barcode: "",
    images: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const { createItem, updateItem, fetchFolders, fetchItems } = useInventory();

  useEffect(() => {
    if (open) {
      fetchFolders();
    }
  }, [open, fetchFolders]);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        description: editingItem.description || "",
        quantity: editingItem.quantity || 1,
        unit: editingItem.unit || "pieces",
        price: editingItem.price || 0,
        minLevel: editingItem.minLevel || 0,
        location: editingItem.location || "",
        notes: editingItem.notes || "",
        barcode: editingItem.barcode || "",
        images: editingItem.images || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        quantity: 1,
        unit: "pieces",
        price: 0,
        minLevel: 0,
        location: "",
        notes: "",
        barcode: "",
        images: [],
      });
    }
  }, [editingItem, open]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleImagesChange = (files) => {
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Item name is required");
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for multipart/form-data submission with images
      const submitData = new FormData();

      // Add basic item data
      submitData.append("name", formData.name.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("quantity", Number(formData.quantity) || 0);
      submitData.append("unit", formData.unit.trim());
      submitData.append("price", Number(formData.price) || 0);
      submitData.append("minLevel", Number(formData.minLevel) || 0);
      submitData.append("location", formData.location.trim());
      submitData.append("notes", formData.notes.trim());

      // Add images if they exist
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          if (image instanceof File) {
            submitData.append("images", image);
          }
        });
      }

      if (editingItem) {
        await updateItem(editingItem._id, submitData);
        toast.success("Item updated successfully!");
        onClose();
      } else {
        console.log("🚀 Creating item with images...");
        const result = await createItem(submitData);
        console.log("✅ Item creation result:", result);

        // Force immediate refresh to ensure UI updates
        console.log("🔄 Force refreshing items after creation...");
        await fetchItems();

        toast.success("Item created successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Item operation error:", error);

      // Improved error handling with more specific messages
      let errorMessage = editingItem
        ? "Failed to update item"
        : "Failed to create item";

      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Network error: Please check your connection to the server";
      } else if (error.response?.data?.message) {
        errorMessage += ": " + error.response.data.message;
      } else if (error.message && error.message !== "Network Error") {
        errorMessage += ": " + error.message;
      }

      toast.error(errorMessage);
      // Don't close the modal on error so user can try again
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2 sm:px-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative border border-gray-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingItem ? "Edit Item" : "Add New Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <TbX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name <span className="text-green-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                placeholder="Enter item name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50 resize-none"
                placeholder="Enter item description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-green-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="lbs">Pounds</option>
                  <option value="meters">Meters</option>
                  <option value="liters">Liters</option>
                  <option value="boxes">Boxes</option>
                  <option value="units">Units</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Barcode
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode || ""}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0a7662] focus:border-[#0a7662]"
                  placeholder="Enter or scan barcode"
                />
                <button
                  type="button"
                  onClick={() => {
                    /* Open barcode scanner */
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  title="Scan Barcode"
                >
                  <TbScan className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (PKR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Level
                </label>
                <input
                  type="number"
                  name="minLevel"
                  value={formData.minLevel}
                  onChange={handleChange}
                  min="0"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                placeholder="Storage location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photos
              </label>
              <PhotoUploadBox
                maxFiles={8}
                maxSizeMB={30}
                onFilesChange={handleImagesChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary focus:ring-opacity-50 resize-none"
                placeholder="Additional notes"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "btn-primary hover:btn-primary-hover"
            }`}
          >
            {isLoading ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
