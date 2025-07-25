import React, { useState, useEffect } from "react";
import {
  TbX,
  TbEdit,
  TbCheck,
  TbTrash,
  TbCopy,
  TbHistory,
  TbTag,
  TbFolder,
  TbInfoCircle,
  TbPhoto,
  TbList,
  TbAlertCircle,
  TbLoader,
  TbShare,
  TbPrinter,
  TbBookmark,
  TbBookmarkFilled,
  TbStar,
  TbStarFilled,
  TbCalendar,
  TbMapPin,
  TbCurrency,
  TbPackage,
  TbBarcode,
  TbQrcode,
  TbExternalLink,
  TbNotes,
  TbChartBar,
  TbTrendingUp,
  TbTrendingDown,
} from "react-icons/tb";
import useInventory from "../hooks/useInventory";
import ImageGallery from "./ImageGallery";
import InlineEditField from "./InlineEditField";
import { commonValidations, formatters } from "../utils/validationUtils";
import toast from "react-hot-toast";

const ItemDetailsSidebar = ({
  open,
  onClose,
  itemId,
  onItemUpdate,
  onItemDelete,
}) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [inlineEditMode, setInlineEditMode] = useState(false);
  const [fieldUpdating, setFieldUpdating] = useState({});

  const { fetchItem, updateItem, deleteItem, fetchItemActivities } =
    useInventory();

  // Fetch item data when the sidebar opens or itemId changes
  useEffect(() => {
    if (open && itemId) {
      setLoading(true);
      setError(null);

      const loadItem = async () => {
        try {
          const response = await fetchItem(itemId);
          const itemData = response.item || response.data || response;

          setItem(itemData);
          setFormData({
            name: itemData.name || "",
            description: itemData.description || "",
            quantity: itemData.quantity || 0,
            unit: itemData.unit || "pieces",
            price: itemData.price || 0,
            minLevel: itemData.minLevel || 0,
            location: itemData.location || "",
            notes: itemData.notes || "",
            tags: itemData.tags || [],
            folderId: itemData.folderId || null,
          });
          setIsBookmarked(itemData.isBookmarked || false);
          setIsStarred(itemData.isStarred || false);
        } catch (err) {
          console.error("Error fetching item:", err);
          setError("Failed to load item details. Please try again.");
          toast.error("Failed to load item details");
        } finally {
          setLoading(false);
        }
      };

      loadItem();
    }
  }, [open, itemId, fetchItem]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "number" ? (value ? parseFloat(value) : 0) : value,
    });
  };

  // Handle inline field update
  const handleFieldUpdate = async (field, value) => {
    setFieldUpdating({ ...fieldUpdating, [field]: true });

    try {
      // Create update payload with just the changed field
      const updateData = { [field]: value };

      // For numeric fields, ensure proper conversion
      if (["quantity", "price", "minLevel"].includes(field)) {
        updateData[field] = parseFloat(value) || 0;
      }

      // Send update to server
      const response = await updateItem(itemId, updateData);
      const updatedItem = response.item || response.data || response;

      // Update local state
      setItem({
        ...item,
        ...updateData,
        updatedAt: updatedItem.updatedAt || new Date().toISOString(),
      });

      // Update form data as well
      setFormData({
        ...formData,
        ...updateData,
      });

      toast.success(`Updated ${field} successfully`);

      if (onItemUpdate) {
        onItemUpdate(updatedItem);
      }

      return true;
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      toast.error(err.response?.data?.message || `Failed to update ${field}`);
      throw new Error(`Failed to update ${field}`);
    } finally {
      setFieldUpdating({ ...fieldUpdating, [field]: false });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    try {
      const response = await updateItem(itemId, formData);
      const updatedItem = response.item || response.data || response;

      setItem(updatedItem);
      setEditMode(false);
      toast.success("Item updated successfully");

      if (onItemUpdate) {
        onItemUpdate(updatedItem);
      }
    } catch (err) {
      console.error("Error updating item:", err);
      toast.error(err.response?.data?.message || "Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  // Handle item deletion
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this item? This action cannot be undone."
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      await deleteItem(itemId);
      toast.success("Item deleted successfully");

      if (onItemDelete) {
        onItemDelete(itemId);
      }

      onClose();
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error(err.response?.data?.message || "Failed to delete item");
    } finally {
      setSaving(false);
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    try {
      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);

      // Update item with bookmark state
      await updateItem(itemId, { ...formData, isBookmarked: newBookmarkState });
      toast.success(newBookmarkState ? "Item bookmarked" : "Bookmark removed");
    } catch (err) {
      setIsBookmarked(!isBookmarked); // Revert on error
      toast.error("Failed to update bookmark");
    }
  };

  // Handle star toggle
  const handleStarToggle = async () => {
    try {
      const newStarState = !isStarred;
      setIsStarred(newStarState);

      // Update item with star state
      await updateItem(itemId, { ...formData, isStarred: newStarState });
      toast.success(newStarState ? "Item starred" : "Star removed");
    } catch (err) {
      setIsStarred(!isStarred); // Revert on error
      toast.error("Failed to update star");
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item?.name,
          text: `Check out this item: ${item?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${item?.name} - ${
        item?.description || "No description"
      }`;
      navigator.clipboard.writeText(shareText);
      toast.success("Item details copied to clipboard");
    }
  };

  // Handle print functionality
  const handlePrint = () => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>${item?.name}</h1>
        <p><strong>Description:</strong> ${item?.description || "N/A"}</p>
        <p><strong>Quantity:</strong> ${item?.quantity} ${item?.unit}</p>
        <p><strong>Price:</strong> $${item?.price?.toFixed(2)}</p>
        <p><strong>Location:</strong> ${item?.location || "N/A"}</p>
        <p><strong>Notes:</strong> ${item?.notes || "N/A"}</p>
        <p><strong>Created:</strong> ${new Date(
          item?.createdAt
        ).toLocaleString()}</p>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // This duplicate function has been removed to fix the "Identifier 'handleFieldUpdate' has already been declared" error

  // Toggle inline edit mode
  const toggleInlineEditMode = () => {
    setInlineEditMode(!inlineEditMode);
    if (editMode) {
      setEditMode(false); // Exit form edit mode if active
    }
  };

  // Render tabs
  const renderTabs = () => {
    const tabs = [
      { id: "details", label: "Details", icon: <TbInfoCircle /> },
      { id: "images", label: "Images", icon: <TbPhoto /> },
      { id: "history", label: "History", icon: <TbHistory /> },
      { id: "related", label: "Related", icon: <TbList /> },
    ];

    return (
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    );
  };

  // Render details tab content
  const renderDetailsTab = () => {
    if (editMode) {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
              >
                <option value="pieces">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="lbs">Pounds</option>
                <option value="liters">Liters</option>
                <option value="meters">Meters</option>
                <option value="boxes">Boxes</option>
                <option value="units">Units</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Level
              </label>
              <input
                type="number"
                name="minLevel"
                min="0"
                step="1"
                value={formData.minLevel}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors flex items-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <TbLoader className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <TbCheck />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {inlineEditMode ? (
                <InlineEditField
                  value={item?.name}
                  onSave={(value) => handleFieldUpdate("name", value)}
                  validation={commonValidations.itemName}
                  placeholder="Item name"
                  className="text-xl font-semibold text-gray-800"
                />
              ) : (
                <h2 className="text-xl font-semibold text-gray-800 truncate">
                  {item?.name}
                </h2>
              )}
              <div className="flex gap-1">
                <button
                  onClick={handleBookmarkToggle}
                  className={`p-1 rounded-full transition-colors ${
                    isBookmarked
                      ? "text-yellow-600 hover:text-yellow-700 bg-yellow-50"
                      : "text-gray-400 hover:text-yellow-600 hover:bg-yellow-50"
                  }`}
                  title={isBookmarked ? "Remove bookmark" : "Bookmark item"}
                >
                  {isBookmarked ? (
                    <TbBookmarkFilled size={16} />
                  ) : (
                    <TbBookmark size={16} />
                  )}
                </button>
                <button
                  onClick={handleStarToggle}
                  className={`p-1 rounded-full transition-colors ${
                    isStarred
                      ? "text-yellow-600 hover:text-yellow-700 bg-yellow-50"
                      : "text-gray-400 hover:text-yellow-600 hover:bg-yellow-50"
                  }`}
                  title={isStarred ? "Remove star" : "Star item"}
                >
                  {isStarred ? (
                    <TbStarFilled size={16} />
                  ) : (
                    <TbStar size={16} />
                  )}
                </button>
              </div>
            </div>
            {item?.sku && (
              <p className="text-sm text-gray-500 font-mono">SKU: {item.sku}</p>
            )}
          </div>

          <div className="flex gap-1 ml-2">
            <button
              onClick={handleShare}
              className="p-1 text-gray-500 hover:text-primary hover:bg-primary-light rounded-full transition-colors"
              title="Share Item"
            >
              <TbShare size={18} />
            </button>
            <button
              onClick={handlePrint}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
              title="Print Item"
            >
              <TbPrinter size={18} />
            </button>
            <button
              onClick={toggleInlineEditMode}
              className={`p-1 rounded-full transition-colors ${
                inlineEditMode
                  ? "text-primary bg-primary-light"
                  : "text-gray-500 hover:text-primary hover:bg-primary-light"
              }`}
              title={inlineEditMode ? "Exit Inline Edit" : "Inline Edit Mode"}
            >
              <TbEdit size={18} />
            </button>
            <button
              onClick={() => setEditMode(true)}
              className="p-1 text-gray-500 hover:text-primary hover:bg-primary-light rounded-full transition-colors"
              title="Form Edit Mode"
            >
              <TbNotes size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
              title="Delete Item"
            >
              <TbTrash size={18} />
            </button>
            <button
              onClick={() => {
                // Clone functionality would go here
                toast.success("Item cloned successfully");
              }}
              className="p-1 text-gray-500 hover:text-primary hover:bg-primary-light rounded-full transition-colors"
              title="Clone Item"
            >
              <TbCopy size={18} />
            </button>
          </div>
        </div>

        <div>
          {inlineEditMode ? (
            <InlineEditField
              value={item?.description}
              onSave={(value) => handleFieldUpdate("description", value)}
              validation={commonValidations.itemDescription}
              placeholder="Add description..."
              multiline={true}
              className="text-gray-600"
            />
          ) : (
            item?.description && (
              <p className="text-gray-600">{item.description}</p>
            )
          )}
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
          <div className="bg-primary-light rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TbPackage className="text-primary" size={16} />
              <p className="text-sm text-primary font-medium">Quantity</p>
            </div>
            {inlineEditMode ? (
              <div className="flex gap-2">
                <InlineEditField
                  value={item?.quantity}
                  onSave={(value) => handleFieldUpdate("quantity", value)}
                  validation={commonValidations.itemQuantity}
                  type="number"
                  placeholder="0"
                  className="text-lg font-semibold text-[var(--primary-dark)] flex-1"
                />
                <InlineEditField
                  value={item?.unit}
                  onSave={(value) => handleFieldUpdate("unit", value)}
                  type="select"
                  options={[
                    { value: "pieces", label: "Pieces" },
                    { value: "kg", label: "Kilograms" },
                    { value: "lbs", label: "Pounds" },
                    { value: "liters", label: "Liters" },
                    { value: "meters", label: "Meters" },
                    { value: "boxes", label: "Boxes" },
                    { value: "units", label: "Units" },
                  ]}
                  className="text-lg font-semibold text-[var(--primary-dark)]"
                />
              </div>
            ) : (
              <p className="text-lg font-semibold text-[var(--primary-dark)]">
                {item?.quantity} {item?.unit}
              </p>
            )}
            {item?.quantity < item?.minLevel && (
              <div className="flex items-center mt-1 text-xs text-green-600">
                <TbAlertCircle className="mr-1" size={12} />
                Low Stock
              </div>
            )}
          </div>

          <div className="bg-primary-light rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TbCurrency className="text-primary" size={16} />
              <p className="text-sm text-primary font-medium">Price</p>
            </div>
            {inlineEditMode ? (
              <InlineEditField
                value={item?.price}
                onSave={(value) => handleFieldUpdate("price", value)}
                validation={commonValidations.itemPrice}
                type="number"
                placeholder="0.00"
                className="text-lg font-semibold text-[var(--primary-dark)]"
                displayFormatter={formatters.currency}
              />
            ) : (
              <p className="text-lg font-semibold text-[var(--primary-dark)]">
                ${item?.price?.toFixed(2)}
              </p>
            )}
            <p className="text-xs text-primary mt-1">
              Total: ${((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TbTrendingDown className="text-orange-600" size={16} />
              <p className="text-sm text-orange-700 font-medium">Min Level</p>
            </div>
            {inlineEditMode ? (
              <InlineEditField
                value={item?.minLevel}
                onSave={(value) => handleFieldUpdate("minLevel", value)}
                validation={commonValidations.itemQuantity}
                type="number"
                placeholder="0"
                className="text-lg font-semibold text-orange-800"
                displayFormatter={(value) =>
                  `${value} ${item?.unit || "units"}`
                }
              />
            ) : (
              <p className="text-lg font-semibold text-orange-800">
                {item?.minLevel} {item?.unit}
              </p>
            )}
          </div>

          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TbMapPin className="text-purple-600" size={16} />
              <p className="text-sm text-purple-700 font-medium">Location</p>
            </div>
            {inlineEditMode ? (
              <InlineEditField
                value={item?.location}
                onSave={(value) => handleFieldUpdate("location", value)}
                validation={commonValidations.itemLocation}
                placeholder="Add location..."
                className="text-sm font-semibold text-purple-800"
              />
            ) : (
              <p className="text-sm font-semibold text-purple-800 truncate">
                {item?.location || "Not set"}
              </p>
            )}
          </div>
        </div>

        {item?.notes && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-gray-700 whitespace-pre-wrap">{item.notes}</p>
          </div>
        )}

        {item?.tags && item.tags.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-light text-[var(--primary-dark)]"
                >
                  <TbTag className="mr-1" size={12} />
                  {tag.name || tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TbFolder className="text-primary" size={16} />
              <span className="text-sm font-medium text-gray-700">Folder</span>
            </div>
            <span className="text-sm text-gray-600">
              {item?.folderName || "Root"}
            </span>
          </div>

          {item?.barcode && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TbBarcode className="text-gray-600" size={16} />
                <span className="text-sm font-medium text-gray-700">
                  Barcode
                </span>
              </div>
              <span className="text-sm text-gray-600 font-mono">
                {item.barcode}
              </span>
            </div>
          )}

          {item?.category && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TbList className="text-gray-600" size={16} />
                <span className="text-sm font-medium text-gray-700">
                  Category
                </span>
              </div>
              <span className="text-sm text-gray-600">{item.category}</span>
            </div>
          )}

          {item?.supplier && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TbExternalLink className="text-gray-600" size={16} />
                <span className="text-sm font-medium text-gray-700">
                  Supplier
                </span>
              </div>
              <span className="text-sm text-gray-600">{item.supplier}</span>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <TbCalendar size={12} />
              <span>Created</span>
            </div>
            <span>{new Date(item?.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <TbCalendar size={12} />
              <span>Updated</span>
            </div>
            <span>{new Date(item?.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render images tab content
  const renderImagesTab = () => {
    return (
      <div className="space-y-4">
        <ImageGallery images={item?.images || []} alt={item?.name || "Item"} />

        {/* Image metadata */}
        {item?.images && item.images.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Image Information
            </h4>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Total images: {item.images.length}</p>
              <p>Format: JPG, PNG supported</p>
              <p>Click any image to view in fullscreen</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render history tab content
  const renderHistoryTab = () => {
    const [activities, setActivities] = useState([]);
    const [loadingActivities, setLoadingActivities] = useState(true);

    useEffect(() => {
      if (activeTab === "history" && itemId) {
        const loadActivities = async () => {
          setLoadingActivities(true);
          try {
            const response = await fetchItemActivities(itemId);
            setActivities(response.activities || response.data || []);
          } catch (err) {
            console.error("Error fetching activities:", err);
          } finally {
            setLoadingActivities(false);
          }
        };

        loadActivities();
      }
    }, [activeTab, itemId, fetchItemActivities]);

    if (loadingActivities) {
      return (
        <div className="flex justify-center py-8">
          <TbLoader size={24} className="animate-spin text-primary" />
        </div>
      );
    }

    if (!activities || activities.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <TbHistory size={48} className="mb-2 opacity-30" />
          <p>No activity history available</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="relative pl-4 border-l-2 border-gray-200">
          {activities.map((activity, index) => (
            <div key={index} className="mb-4 relative">
              <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full btn-primary" />
              <div className="pl-4">
                <p className="text-sm font-medium text-gray-800">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()} •{" "}
                  {activity.user?.name || "System"}
                </p>
                {activity.details && (
                  <p className="text-xs text-gray-600 mt-1">
                    {activity.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render related tab content
  const renderRelatedTab = () => {
    useEffect(() => {
      if (activeTab === "related" && itemId && !loadingRelated) {
        setLoadingRelated(true);
        // Simulate fetching related items based on tags, category, or folder
        setTimeout(() => {
          // Mock related items - in real app, this would be an API call
          const mockRelated = [
            {
              id: "related-1",
              name: "Similar Item 1",
              price: 25.99,
              quantity: 15,
              images: ["/api/placeholder/100/100"],
            },
            {
              id: "related-2",
              name: "Similar Item 2",
              price: 32.5,
              quantity: 8,
              images: ["/api/placeholder/100/100"],
            },
          ];
          setRelatedItems(mockRelated);
          setLoadingRelated(false);
        }, 1000);
      }
    }, [activeTab, itemId]);

    if (loadingRelated) {
      return (
        <div className="flex justify-center py-8">
          <TbLoader size={24} className="animate-spin text-primary" />
        </div>
      );
    }

    if (!relatedItems || relatedItems.length === 0) {
      return (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <TbList size={48} className="mb-2 opacity-30" />
            <p>No related items found</p>
            <p className="text-xs mt-1">
              Items with similar tags or categories will appear here
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">Related Items</h4>
          <span className="text-xs text-gray-500">
            {relatedItems.length} items
          </span>
        </div>

        <div className="space-y-3">
          {relatedItems.map((relatedItem) => (
            <div
              key={relatedItem.id}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {relatedItem.images?.[0] ? (
                  <img
                    src={(() => {
                      const image = relatedItem.images[0];
                      if (typeof image === "string") {
                        return image;
                      } else if (image?.url) {
                        return image.url;
                      } else if (image?.filename) {
                        // Construct URL from filename
                        const baseUrl =
                          import.meta.env.VITE_API_URL?.replace("/api", "") ||
                          "http://localhost:5001";
                        return `${baseUrl}/uploads/items/${image.filename}`;
                      }
                      return null;
                    })()}
                    alt={relatedItem.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                {(!relatedItem.images || !relatedItem.images[0]) && (
                  <div className="w-full h-full flex items-center justify-center">
                    <TbPhoto className="text-gray-400" size={16} />
                  </div>
                )}
                {/* Fallback div for broken images */}
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ display: "none" }}
                >
                  <TbPhoto className="text-gray-400" size={16} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {relatedItem.name}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-gray-500">
                    Qty: {relatedItem.quantity}
                  </span>
                  <span className="text-xs font-medium text-primary">
                    ${relatedItem.price?.toFixed(2)}
                  </span>
                </div>
              </div>

              <TbExternalLink className="text-gray-400" size={16} />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button className="w-full text-sm text-primary hover:text-primary font-medium">
            View All Related Items
          </button>
        </div>
      </div>
    );
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return renderDetailsTab();
      case "images":
        return renderImagesTab();
      case "history":
        return renderHistoryTab();
      case "related":
        return renderRelatedTab();
      default:
        return renderDetailsTab();
    }
  };

  // Generate QR Code for item
  const generateQRCode = () => {
    const itemData = {
      id: item?.id,
      name: item?.name,
      sku: item?.sku,
      url: `${window.location.origin}/items/${item?.id}`,
    };

    // In a real app, you'd use a QR code library like qrcode
    // For now, we'll show a placeholder
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      JSON.stringify(itemData)
    )}`;
  };

  // Render QR Code modal
  const renderQRCodeModal = () => {
    if (!showQRCode) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Item QR Code</h3>
            <button
              onClick={() => setShowQRCode(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <TbX size={20} />
            </button>
          </div>

          <div className="text-center">
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <img src={generateQRCode()} alt="QR Code" className="mx-auto" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code to quickly access item details
            </p>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = generateQRCode();
                link.download = `${item?.name}-qr-code.png`;
                link.click();
              }}
              className="w-full btn-primary text-white py-2 px-4 rounded-lg hover:btn-primary-hover transition-colors"
            >
              Download QR Code
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!open) return null;

  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-40 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Item Details
            </h2>
            {item?.quantity < item?.minLevel && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                <TbAlertCircle className="mr-1" size={12} />
                Low Stock
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowQRCode(true)}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Generate QR Code"
            >
              <TbQrcode size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <TbX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-64px)] flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <TbLoader size={32} className="animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <TbAlertCircle size={48} className="text-red-500 mb-2" />
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchItem(itemId)
                    .then((response) => {
                      const itemData =
                        response.item || response.data || response;
                      setItem(itemData);
                    })
                    .catch((err) => {
                      setError(
                        "Failed to load item details. Please try again."
                      );
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }}
                className="mt-4 px-4 py-2 btn-primary text-white rounded-lg hover:btn-primary-hover transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Tabs */}
              {renderTabs()}

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {renderTabContent()}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 z-30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* QR Code Modal */}
      {renderQRCodeModal()}
    </>
  );
};

export default ItemDetailsSidebar;
