import React, { useState, useEffect } from "react";
import {
  TbTag,
  TbSearch,
  TbLayoutGrid,
  TbChevronDown,
  TbEdit,
  TbTrash,
  TbPlus,
  TbX,
  TbMenu,
} from "react-icons/tb";
import AddTagModal from "./AddTagModal";
import useInventoryStore from "../store/inventoryStore";
import toast from "react-hot-toast";

const TagsTab = ({ GREEN }) => {
  const {
    tags,
    tagsLoading,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    getItemsByTag,
    items,
  } = useInventoryStore();

  const [selectedTag, setSelectedTag] = useState(null);
  const [tagSearch, setTagSearch] = useState("");
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [showEditTagModal, setShowEditTagModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagItems, setTagItems] = useState([]);
  const [tagItemsLoading, setTagItemsLoading] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [layoutType, setLayoutType] = useState("grid");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [layoutDropdownOpen, setLayoutDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load tags on component mount
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Set first tag as selected when tags load
  useEffect(() => {
    if (tags.length > 0 && !selectedTag) {
      setSelectedTag(tags[0]);
    }
  }, [tags, selectedTag]);

  // Load items when selected tag changes
  useEffect(() => {
    if (selectedTag) {
      loadTagItems(selectedTag.name);
    }
  }, [selectedTag]);

  const loadTagItems = async (tagName) => {
    setTagItemsLoading(true);
    try {
      // Filter items by tag from the store
      const filteredItems = items.filter(
        (item) => item.tags && item.tags.includes(tagName)
      );
      setTagItems(filteredItems);
    } catch (error) {
      toast.error("Failed to load tag items");
      setTagItems([]);
    } finally {
      setTagItemsLoading(false);
    }
  };

  const handleCreateTag = async (tagData) => {
    try {
      await createTag(tagData);
      toast.success("Tag created successfully!");
      setShowAddTagModal(false);
      fetchTags(); // Refresh tags list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create tag");
    }
  };

  const handleUpdateTag = async (tagId, tagData) => {
    try {
      await updateTag(tagId, tagData);
      toast.success("Tag updated successfully!");
      setShowEditTagModal(false);
      setEditingTag(null);
      fetchTags(); // Refresh tags list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update tag");
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this tag? This action cannot be undone."
      )
    ) {
      try {
        await deleteTag(tagId);
        toast.success("Tag deleted successfully!");
        if (selectedTag && selectedTag._id === tagId) {
          setSelectedTag(null);
        }
        fetchTags(); // Refresh tags list
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete tag");
      }
    }
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setShowEditTagModal(true);
  };

  const filteredTags = Array.isArray(tags)
    ? tags.filter(
        (t) =>
          t && t.name && t.name.toLowerCase().includes(tagSearch.toLowerCase())
      )
    : [];

  const filteredItems = Array.isArray(tagItems)
    ? tagItems.filter(
        (item) =>
          item &&
          item.name &&
          item.name.toLowerCase().includes(itemSearch.toLowerCase())
      )
    : [];

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "quantity":
        aValue = a.quantity || 0;
        bValue = b.quantity || 0;
        break;
      case "price":
        aValue = a.price || 0;
        bValue = b.price || 0;
        break;
      case "updatedAt":
        aValue = new Date(a.updatedAt || a.createdAt);
        bValue = new Date(b.updatedAt || b.createdAt);
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "quantity", label: "Quantity" },
    { value: "price", label: "Price" },
    { value: "updatedAt", label: "Updated At" },
  ];

  const layoutOptions = [
    {
      key: "grid",
      label: "Grid",
      icon: <TbLayoutGrid className="text-lg mr-2" />,
    },
    {
      key: "list",
      label: "List",
      icon: <TbTag className="text-lg mr-2" />,
    },
  ];

  const totalQuantity = sortedItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const totalValue = sortedItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
    0
  );

  return (
    <div className="flex h-full min-h-[500px] relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed lg:relative lg:translate-x-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col p-4 lg:p-6 transition-transform duration-300 ease-in-out h-full lg:h-auto`}>
        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <TbX size={20} />
        </button>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Tags</h2>
          <button
            onClick={() => setShowAddTagModal(true)}
            className="p-2 bg-[#0a7662] text-white rounded-lg hover:bg-[#075c4c] transition-colors"
          >
            <TbPlus size={16} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search tags"
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          className="mb-4 w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-2 focus:ring-[#0a7662] focus:ring-opacity-50 shadow-sm"
        />

        <ul className="flex-1 overflow-y-auto">
          {tagsLoading ? (
            <li className="text-center py-4 text-gray-500">Loading tags...</li>
          ) : filteredTags.length === 0 ? (
            <li className="text-center py-4 text-gray-500">
              {tagSearch ? "No tags found" : "No tags created yet"}
            </li>
          ) : (
            filteredTags.map((tag) => (
              <li key={tag._id}>
                <div className="flex items-center justify-between group">
                  <button
                    className={`flex items-center gap-2 flex-1 px-4 py-2 rounded-lg mb-1 text-left transition-all duration-150 ${
                      selectedTag?._id === tag._id
                        ? "bg-[#e6f3f1] text-[#0a7662] font-bold shadow"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedTag(tag);
                      setSidebarOpen(false); // Close sidebar on mobile after selection
                    }}
                  >
                    <TbTag
                      className="text-lg"
                      style={{ color: tag.color || "#6B7280" }}
                    />
                    <div className="flex-1 truncate">
                      <span className="truncate">{tag.name}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        ({tag.itemCount || 0})
                      </span>
                    </div>
                  </button>

                  {/* Tag actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => handleEditTag(tag)}
                      className="p-1 text-gray-400 hover:text-[#075c4c]"
                      title="Edit tag"
                    >
                      <TbEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag._id)}
                      className="p-1 text-gray-400 hover:text-green-500"
                      title="Delete tag"
                    >
                      <TbTrash size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 lg:p-10 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden mb-4 p-2 text-gray-600 hover:text-gray-800 self-start"
        >
          <TbMenu size={24} />
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <h1
            className="text-2xl lg:text-3xl font-bold text-gray-700"
            style={{ color: GREEN?.main || "#16A34A" }}
          >
            {selectedTag?.name || "Select a tag"}
          </h1>
          {selectedTag && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {selectedTag.description}
              </span>
            </div>
          )}
        </div>

        {selectedTag && (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Search items"
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-2 focus:ring-[#0a7662] focus:ring-opacity-50 shadow-sm"
                />
                <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:gap-6 text-gray-700 text-sm lg:text-base font-medium">
                <span>
                  Items: <b>{sortedItems.length}</b>
                </span>
                <span className="hidden sm:inline">
                  Total Quantity: <b>{totalQuantity} units</b>
                </span>
                <span className="hidden md:inline">
                  Total Value:{" "}
                  <b>
                    PKR{" "}
                    {totalValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </b>
                </span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    className="px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm border bg-white border-gray-200 flex items-center gap-2 shadow-sm focus:outline-none min-w-[100px] lg:min-w-[120px]"
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  >
                    <span className="truncate">
                      {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                        "Sort"}
                    </span>
                    <TbChevronDown className="text-base flex-shrink-0" />
                  </button>
                  {sortDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                      <ul className="py-2">
                        {sortOptions.map((opt) => (
                          <li key={opt.value}>
                            <button
                              className={`w-full text-left px-4 py-2 flex items-center justify-between ${
                                sortBy === opt.value
                                  ? "text-[#0a7662] font-bold"
                                  : "text-gray-700"
                              } hover:bg-gray-50`}
                              onClick={() => {
                                setSortBy(opt.value);
                                setSortDropdownOpen(false);
                              }}
                            >
                              {opt.label}
                              {sortBy === opt.value && (
                                <span>{sortOrder === "desc" ? "↓" : "↑"}</span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-gray-100 p-2">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                          onClick={() => {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                            setSortDropdownOpen(false);
                          }}
                        >
                          {sortOrder === "asc"
                            ? "Sort Descending"
                            : "Sort Ascending"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Layout Switcher */}
                <div className="relative">
                  <button
                    className="p-2 rounded-lg border bg-white border-gray-200 flex items-center text-gray-700 shadow-sm focus:outline-none"
                    onClick={() => setLayoutDropdownOpen(!layoutDropdownOpen)}
                  >
                    <TbLayoutGrid className="text-xl" />
                  </button>
                  {layoutDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                      <ul>
                        {layoutOptions.map((opt) => (
                          <li key={opt.key}>
                            <button
                              className={`w-full flex items-center px-4 py-2 rounded-lg ${
                                layoutType === opt.key
                                  ? "bg-[#e6f3f1] text-[#0a7662] font-bold"
                                  : "text-gray-700"
                              } hover:bg-gray-50`}
                              onClick={() => {
                                setLayoutType(opt.key);
                                setLayoutDropdownOpen(false);
                              }}
                            >
                              {opt.icon} {opt.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Display */}
            <div className="flex-1 overflow-y-auto">
              {tagItemsLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading items...
                </div>
              ) : sortedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {itemSearch
                    ? `No items found matching "${itemSearch}"`
                    : `No items found with tag "${selectedTag.name}"`}
                </div>
              ) : layoutType === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {sortedItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="relative mb-3">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={(() => {
                              const image = item.images[0];
                              if (typeof image === "string") {
                                return image;
                              } else if (image?.url) {
                                return image.url;
                              } else if (image?.filename) {
                                // Construct URL from filename
                                const baseUrl =
                                  import.meta.env.VITE_API_URL?.replace(
                                    "/api",
                                    ""
                                  ) || "http://localhost:5001";
                                return `${baseUrl}/uploads/items/${image.filename}`;
                              }
                              return null;
                            })()}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        {(!item.images || item.images.length === 0) && (
                          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <TbTag className="text-gray-400 text-2xl" />
                          </div>
                        )}
                        {/* Fallback div for broken images */}
                        <div
                          className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center"
                          style={{ display: "none" }}
                        >
                          <TbTag className="text-gray-400 text-2xl" />
                        </div>
                        {item.quantity <= (item.minLevel || 0) && (
                          <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-bold rounded px-2 py-0.5">
                            LOW STOCK
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <div className="text-sm text-gray-600">
                          Quantity: {item.quantity || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Price: PKR {(item.price || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Value: PKR{" "}
                          {(
                            (item.quantity || 0) * (item.price || 0)
                          ).toLocaleString()}
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {item.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{item.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={(() => {
                                const image = item.images[0];
                                if (typeof image === "string") {
                                  return image;
                                } else if (image?.url) {
                                  return image.url;
                                } else if (image?.filename) {
                                  // Construct URL from filename
                                  const baseUrl =
                                    import.meta.env.VITE_API_URL?.replace(
                                      "/api",
                                      ""
                                    ) || "http://localhost:5001";
                                  return `${baseUrl}/uploads/items/${image.filename}`;
                                }
                                return null;
                              })()}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.innerHTML =
                                  '<svg class="text-gray-400 text-xl" fill="currentColor" viewBox="0 0 24 24"><path d="M5.5 7h13a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5z"/></svg>';
                              }}
                            />
                          ) : (
                            <TbTag className="text-gray-400 text-xl" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {item.name}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1">
                            Quantity: {item.quantity || 0} | Price: PKR{" "}
                            {(item.price || 0).toLocaleString()} | Value: PKR{" "}
                            {(
                              (item.quantity || 0) * (item.price || 0)
                            ).toLocaleString()}
                          </div>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {item.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {item.quantity <= (item.minLevel || 0) && (
                          <span className="bg-green-100 text-green-700 text-xs font-bold rounded px-2 py-1">
                            LOW STOCK
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {!selectedTag && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TbTag className="text-4xl mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No tag selected</h3>
              <p className="text-sm">
                Select a tag from the sidebar to view its items
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Add Tag Modal */}
      <AddTagModal
        open={showAddTagModal}
        onClose={() => setShowAddTagModal(false)}
        onAdd={handleCreateTag}
      />

      {/* Edit Tag Modal */}
      {editingTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Edit Tag</h2>
              <button
                onClick={() => {
                  setShowEditTagModal(false);
                  setEditingTag(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <TbX size={24} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateTag(editingTag._id, {
                  name: editingTag.name,
                  color: editingTag.color,
                  description: editingTag.description,
                });
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={editingTag.name}
                  onChange={(e) =>
                    setEditingTag({ ...editingTag, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-[#0a7662] focus:ring-opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <select
                  value={editingTag.color}
                  onChange={(e) =>
                    setEditingTag({ ...editingTag, color: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-[#0a7662] focus:ring-opacity-50"
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
                  Description
                </label>
                <textarea
                  value={editingTag.description || ""}
                  onChange={(e) =>
                    setEditingTag({
                      ...editingTag,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-[#0a7662] focus:ring-opacity-50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditTagModal(false);
                    setEditingTag(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0a7662] text-white rounded-lg hover:bg-[#075c4c]"
                >
                  Update Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsTab;
