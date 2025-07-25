import { create } from "zustand";
import { itemsService } from "../services/items";
import { foldersService } from "../services/folders";
import { alertsService } from "../services/alerts";
import { tagsService } from "../services/tags";
import { activitiesService } from "../services/activities";
import { reportsService } from "../services/reports";

const useInventoryStore = create((set, get) => ({
  // Items state
  items: [],
  currentItem: null,
  itemsLoading: false,
  itemsError: null,
  lastUpdate: null,
  itemsPagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  // Folders state
  folders: [],
  folderHierarchy: [],
  currentFolder: null,
  foldersLoading: false,
  foldersError: null,

  // Alerts state
  alerts: [],
  alertCount: { active: 0, read: 0, resolved: 0, total: 0 },
  alertsLoading: false,
  alertsError: null,

  // Tags state
  tags: [],
  currentTag: null,
  tagsLoading: false,
  tagsError: null,

  // Activities state
  activities: [],
  activitiesLoading: false,
  activitiesError: null,

  // Reports state
  reports: {},
  reportsLoading: false,
  reportsError: null,

  // Search and filters
  searchQuery: "",
  filters: {
    folderId: null,
    tags: [],
    lowStock: false,
    minPrice: null,
    maxPrice: null,
  },
  sortBy: "createdAt",
  sortOrder: "desc",

  // Items actions
  fetchItems: async (params = {}) => {
    console.log("🔄 Fetching items...");
    set({ itemsLoading: true, itemsError: null });
    try {
      const response = await itemsService.getItems({
        ...get().filters,
        ...params,
        sortBy: get().sortBy,
        sortOrder: get().sortOrder,
        page: get().itemsPagination?.page || 1,
        limit: get().itemsPagination?.limit || 20,
      });

      console.log("✅ Items fetched successfully:", response);

      // Handle different response structures
      let items = [];
      if (response.data && Array.isArray(response.data.items)) {
        items = response.data.items;
      } else if (Array.isArray(response.items)) {
        items = response.items;
      } else if (Array.isArray(response.data)) {
        items = response.data;
      }

      const validItems = items.filter((item) => item && item._id);

      console.log("✅ Valid items count:", validItems.length);
      console.log("✅ Items structure:", items);

      set((state) => ({
        ...state,
        items: validItems,
        itemsPagination: response.data?.pagination ||
          response.pagination || {
            page: 1,
            limit: 20,
            total: validItems.length,
            pages: Math.ceil(validItems.length / 20),
          },
        itemsLoading: false,
        lastUpdate: Date.now(),
      }));
    } catch (error) {
      console.error("❌ Error fetching items:", error);
      set({
        items: [], // Ensure items is always an array even on error
        itemsError: error.response?.data?.message || "Failed to fetch items",
        itemsLoading: false,
      });
    }
  },

  fetchItem: async (id) => {
    set({ itemsLoading: true, itemsError: null });
    try {
      const response = await itemsService.getItem(id);
      set({
        currentItem: response.item,
        itemsLoading: false,
      });
    } catch (error) {
      set({
        itemsError: error.response?.data?.message || "Failed to fetch item",
        itemsLoading: false,
      });
    }
  },

  createItem: async (itemData) => {
    console.log("🚀 Creating item with data:", itemData);

    try {
      // Set loading state
      set({ itemsLoading: true, itemsError: null });

      const response = await itemsService.createItem(itemData);
      console.log("✅ Item created successfully, response:", response);

      // Handle different response structures
      let item = null;
      if (response.data && response.data.item) {
        item = response.data.item;
      } else if (response.item) {
        item = response.item;
      } else if (response.data) {
        item = response.data;
      }

      if (item && item._id) {
        // Immediate optimistic update
        set((state) => {
          const newItems = [item, ...state.items];
          console.log(
            "✅ Item added to state optimistically. Total items:",
            newItems.length
          );

          return {
            ...state,
            items: newItems,
            itemsLoading: false,
            lastUpdate: Date.now(),
            // Update pagination to reflect new total
            itemsPagination: {
              ...state.itemsPagination,
              total: newItems.length,
              pages: Math.ceil(
                newItems.length / (state.itemsPagination?.limit || 20)
              ),
            },
          };
        });

        // Force a fresh fetch to ensure data consistency
        setTimeout(async () => {
          try {
            console.log("🔄 Refreshing items after creation...");
            await get().fetchItems();
          } catch (error) {
            console.error("❌ Post-creation refresh failed:", error);
          }
        }, 500);

        return response;
      } else {
        console.warn("⚠️ Invalid response structure:", response);
        set({ itemsLoading: false });
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("❌ Error creating item:", error);
      set({
        itemsLoading: false,
        itemsError: error.response?.data?.message || "Failed to create item",
      });
      throw error;
    }
  },

  updateItem: async (id, itemData) => {
    try {
      const response = await itemsService.updateItem(id, itemData);

      // Handle different response structures
      let item = null;
      if (response.data && response.data.item) {
        item = response.data.item;
      } else if (response.item) {
        item = response.item;
      } else if (response.data) {
        item = response.data;
      }

      if (item) {
        set((state) => ({
          items: state.items.map((existingItem) =>
            existingItem._id === id ? item : existingItem
          ),
          currentItem: state.currentItem?._id === id ? item : state.currentItem,
        }));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteItem: async (id) => {
    try {
      await itemsService.deleteItem(id);
      set((state) => ({
        items: state.items.filter((item) => item._id !== id),
        currentItem: state.currentItem?._id === id ? null : state.currentItem,
      }));
    } catch (error) {
      throw error;
    }
  },

  updateItemQuantity: async (id, change, reason) => {
    try {
      const response = await itemsService.updateQuantity(id, change, reason);
      set((state) => ({
        items: state.items.map((item) =>
          item._id === id ? response.item : item
        ),
      }));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Bulk operations
  bulkUpdateItems: async (itemIds, updates) => {
    try {
      const response = await itemsService.bulkUpdate(itemIds, updates);
      // Refresh items after bulk update
      get().fetchItems();
      return response;
    } catch (error) {
      throw error;
    }
  },

  bulkDeleteItems: async (itemIds, reason) => {
    try {
      await itemsService.bulkDelete(itemIds, reason);
      set((state) => ({
        items: state.items.filter((item) => !itemIds.includes(item._id)),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Folders actions
  fetchFolders: async () => {
    console.log("🔄 Fetching folders...");
    set({ foldersLoading: true, foldersError: null });
    try {
      const response = await foldersService.getFolders();
      console.log("✅ Folders response:", response);

      // Handle different response structures
      let folders = [];
      if (response.data && Array.isArray(response.data.folders)) {
        folders = response.data.folders;
      } else if (response.data && Array.isArray(response.data)) {
        folders = response.data;
      } else if (Array.isArray(response.folders)) {
        folders = response.folders;
      } else if (Array.isArray(response)) {
        folders = response;
      }

      // Filter out invalid folders
      const validFolders = folders.filter(
        (folder) => folder && folder._id && folder.name
      );
      console.log("✅ Valid folders count:", validFolders.length);
      console.log("✅ Folders structure:", validFolders);

      set({
        folders: validFolders,
        foldersLoading: false,
      });
    } catch (error) {
      console.error("❌ Error fetching folders:", error);
      set({
        folders: [], // Ensure folders is always an array even on error
        foldersError:
          error.response?.data?.message || "Failed to fetch folders",
        foldersLoading: false,
      });
    }
  },

  fetchFolderHierarchy: async () => {
    set({ foldersLoading: true, foldersError: null });
    try {
      const response = await foldersService.getFolderHierarchy();
      set({
        folderHierarchy: response.hierarchy,
        foldersLoading: false,
      });
    } catch (error) {
      set({
        foldersError:
          error.response?.data?.message || "Failed to fetch folder hierarchy",
        foldersLoading: false,
      });
    }
  },

  createFolder: async (folderData) => {
    try {
      const response = await foldersService.createFolder(folderData);
      console.log("✅ Create folder response:", response);

      // Handle different response structures
      let folder = null;
      if (response.data && response.data.folder) {
        folder = response.data.folder;
      } else if (response.data && response.data._id) {
        folder = response.data;
      } else if (response.folder) {
        folder = response.folder;
      } else if (response._id) {
        folder = response;
      }

      if (folder && folder._id) {
        set((state) => ({
          folders: [folder, ...state.folders],
        }));
        return response;
      } else {
        console.warn("⚠️ Invalid folder response structure:", response);
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("❌ Error creating folder:", error);
      throw error;
    }
  },

  updateFolder: async (id, folderData) => {
    try {
      const response = await foldersService.updateFolder(id, folderData);
      set((state) => ({
        folders: state.folders.map((folder) =>
          folder._id === id ? response.folder : folder
        ),
      }));
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteFolder: async (id) => {
    try {
      await foldersService.deleteFolder(id);
      set((state) => ({
        folders: state.folders.filter((folder) => folder._id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Alerts actions
  fetchAlerts: async (params = {}) => {
    console.log("🔄 Fetching alerts...");
    set({ alertsLoading: true, alertsError: null });
    try {
      const response = await alertsService.getAlerts(params);
      console.log("✅ Alerts fetched successfully:", response);

      // Handle different response structures
      let alerts = [];
      if (response.data && Array.isArray(response.data.alerts)) {
        alerts = response.data.alerts;
      } else if (Array.isArray(response.alerts)) {
        alerts = response.alerts;
      } else if (Array.isArray(response.data)) {
        alerts = response.data;
      }

      const validAlerts = alerts.filter((alert) => alert && alert._id);
      console.log("✅ Valid alerts count:", validAlerts.length);

      set({
        alerts: validAlerts,
        alertsLoading: false,
      });
    } catch (error) {
      console.error("❌ Failed to fetch alerts:", error);
      set({
        alertsError: error.response?.data?.message || "Failed to fetch alerts",
        alertsLoading: false,
        alerts: [], // Ensure alerts is always an array
      });
    }
  },

  fetchAlertCount: async () => {
    console.log("🔄 Fetching alert count...");
    try {
      const response = await alertsService.getAlertCount();
      console.log("✅ Alert count fetched successfully:", response);

      // Handle different response structures
      let alertCount = { active: 0, read: 0, resolved: 0, total: 0 };
      if (response.data) {
        alertCount = response.data;
      } else if (response.count) {
        alertCount = response.count;
      } else {
        alertCount = response;
      }

      set({
        alertCount: alertCount,
      });
    } catch (error) {
      console.error("❌ Failed to fetch alert count:", error);
      // Set default count on error
      set({
        alertCount: { active: 0, read: 0, resolved: 0, total: 0 },
      });
    }
  },

  updateAlertStatus: async (id, status) => {
    console.log(`🔄 Updating alert ${id} status to ${status}...`);
    try {
      const response = await alertsService.updateAlertStatus(id, status);
      console.log("✅ Alert status updated successfully:", response);

      // Handle different response structures
      let updatedAlert = null;
      if (response.data && response.data.alert) {
        updatedAlert = response.data.alert;
      } else if (response.alert) {
        updatedAlert = response.alert;
      }

      if (updatedAlert) {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert._id === id ? { ...alert, ...updatedAlert } : alert
          ),
        }));
      }

      return response;
    } catch (error) {
      console.error("❌ Failed to update alert status:", error);
      throw error;
    }
  },

  markAllAlertsAsRead: async () => {
    console.log("🔄 Marking all alerts as read...");
    try {
      const response = await alertsService.markAllAsRead();
      console.log("✅ All alerts marked as read successfully:", response);

      set((state) => ({
        alerts: state.alerts.map((alert) => ({
          ...alert,
          status: "read",
          readAt: new Date().toISOString(),
        })),
      }));

      // Update alert count
      get().fetchAlertCount();

      return response;
    } catch (error) {
      console.error("❌ Failed to mark all alerts as read:", error);
      throw error;
    }
  },

  // Tags actions
  fetchTags: async () => {
    set({ tagsLoading: true, tagsError: null });
    try {
      const response = await tagsService.getTags();
      console.log("fetchTags response:", response);
      set({
        tags: response.data.tags || [],
        tagsLoading: false,
      });
    } catch (error) {
      console.warn("API error during tags fetch:", error.message);

      // Check if it's a network error (API not available)
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        // Provide mock tags for demo purposes
        const mockTags = [
          {
            _id: "tag1",
            name: "electronics",
            color: "blue",
            description: "Electronic devices and gadgets",
            itemCount: 5,
            createdAt: new Date("2023-01-15").toISOString(),
            updatedAt: new Date("2023-03-22").toISOString(),
          },
          {
            _id: "tag2",
            name: "office",
            color: "green",
            description: "Office supplies and equipment",
            itemCount: 8,
            createdAt: new Date("2023-02-10").toISOString(),
            updatedAt: new Date("2023-04-05").toISOString(),
          },
          {
            _id: "tag3",
            name: "furniture",
            color: "orange",
            description: "Furniture and home decor",
            itemCount: 3,
            createdAt: new Date("2023-01-05").toISOString(),
            updatedAt: new Date("2023-03-18").toISOString(),
          },
        ];

        set({
          tags: mockTags,
          tagsLoading: false,
          tagsError: null,
        });
        return;
      }

      set({
        tagsError: error.response?.data?.message || "Failed to fetch tags",
        tagsLoading: false,
      });
    }
  },

  createTag: async (tagData) => {
    try {
      const response = await tagsService.createTag(tagData);
      set((state) => ({
        tags: [response.data.tag, ...state.tags],
      }));
      return response;
    } catch (error) {
      console.warn("API error during tag creation:", error.message);

      // Check if it's a network error (API not available)
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        // Create mock tag for demo purposes
        const mockTag = {
          _id: Date.now().toString(),
          name: tagData.name.toLowerCase(),
          color: tagData.color || "gray",
          description: tagData.description || "",
          itemCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          tags: [mockTag, ...state.tags],
        }));

        return { tag: mockTag };
      }

      throw error;
    }
  },

  updateTag: async (id, tagData) => {
    try {
      const response = await tagsService.updateTag(id, tagData);
      set((state) => ({
        tags: state.tags.map((tag) =>
          tag._id === id ? response.data.tag : tag
        ),
      }));
      return response;
    } catch (error) {
      console.warn("API error during tag update:", error.message);

      // Check if it's a network error (API not available)
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        // Update tag locally for demo purposes
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag._id === id
              ? {
                  ...tag,
                  ...tagData,
                  name: tagData.name?.toLowerCase() || tag.name,
                  updatedAt: new Date().toISOString(),
                }
              : tag
          ),
        }));

        const updatedTag = {
          ...tagData,
          _id: id,
          updatedAt: new Date().toISOString(),
        };
        return { tag: updatedTag };
      }

      throw error;
    }
  },

  deleteTag: async (id) => {
    try {
      await tagsService.deleteTag(id);
      set((state) => ({
        tags: state.tags.filter((tag) => tag._id !== id),
      }));
    } catch (error) {
      console.warn("API error during tag deletion:", error.message);

      // Check if it's a network error (API not available)
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        // Delete tag locally for demo purposes
        set((state) => ({
          tags: state.tags.filter((tag) => tag._id !== id),
        }));
        return;
      }

      throw error;
    }
  },

  getItemsByTag: async (tagId) => {
    set({ itemsLoading: true, itemsError: null });
    try {
      const response = await tagsService.getItemsByTag(tagId);
      set({
        items: response.items,
        itemsLoading: false,
      });
    } catch (error) {
      set({
        itemsError:
          error.response?.data?.message || "Failed to fetch items by tag",
        itemsLoading: false,
      });
    }
  },

  // Activities actions
  fetchActivities: async (params = {}) => {
    set({ activitiesLoading: true, activitiesError: null });
    try {
      const response = await activitiesService.getActivities(params);
      set({
        activities: response.activities,
        activitiesLoading: false,
      });
    } catch (error) {
      set({
        activitiesError:
          error.response?.data?.message || "Failed to fetch activities",
        activitiesLoading: false,
      });
    }
  },

  fetchItemActivities: async (itemId) => {
    set({ activitiesLoading: true, activitiesError: null });
    try {
      const response = await activitiesService.getItemActivities(itemId);
      console.log("✅ Item activities loaded:", response);
      set({
        activities: response.data?.activities || response.activities || [],
        activitiesLoading: false,
      });
    } catch (error) {
      set({
        activitiesError:
          error.response?.data?.message || "Failed to fetch item activities",
        activitiesLoading: false,
      });
    }
  },

  fetchFolderActivities: async (folderId) => {
    set({ activitiesLoading: true, activitiesError: null });
    try {
      const response = await activitiesService.getFolderActivities(folderId);
      set({
        activities: response.activities,
        activitiesLoading: false,
      });
    } catch (error) {
      set({
        activitiesError:
          error.response?.data?.message || "Failed to fetch folder activities",
        activitiesLoading: false,
      });
    }
  },

  // Reports actions
  fetchReport: async (type, params = {}) => {
    set({ reportsLoading: true, reportsError: null });
    try {
      let response;
      switch (type) {
        case "inventory-summary":
          response = await reportsService.getInventorySummary(params);
          break;
        case "transactions":
          response = await reportsService.getTransactions(params);
          break;
        case "activity-history":
          response = await reportsService.getActivityHistory(params);
          break;
        case "item-flow":
          response = await reportsService.getItemFlow(params);
          break;
        case "move-summary":
          response = await reportsService.getMoveSummary(params);
          break;
        case "user-activity-summary":
          response = await reportsService.getUserActivitySummary(params);
          break;
        default:
          throw new Error(`Unknown report type: ${type}`);
      }

      set((state) => ({
        reports: {
          ...state.reports,
          [type]: response.data,
        },
        reportsLoading: false,
      }));
    } catch (error) {
      set({
        reportsError: error.response?.data?.message || "Failed to fetch report",
        reportsLoading: false,
      });
    }
  },

  exportReport: async (type, format, params = {}) => {
    try {
      const response = await reportsService.exportReport(type, format, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search actions
  searchItems: async (query, filters = {}) => {
    set({ itemsLoading: true, itemsError: null });
    try {
      const response = await itemsService.searchItems({ q: query, ...filters });
      set({
        items: Array.isArray(response.items)
          ? response.items.filter((item) => item && item._id)
          : [],
        itemsPagination: response.pagination,
        itemsLoading: false,
      });
    } catch (error) {
      set({
        itemsError: error.response?.data?.message || "Failed to search items",
        itemsLoading: false,
      });
    }
  },

  // Filter and sorting actions
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  setSorting: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder });
  },

  setPagination: (page, limit) => {
    set((state) => ({
      itemsPagination: {
        ...state.itemsPagination,
        page: page || 1,
        limit: limit || 20,
      },
    }));
  },

  clearFilters: () => {
    set({
      filters: {
        folderId: null,
        tags: [],
        lowStock: false,
        minPrice: null,
        maxPrice: null,
      },
    });
  },

  // Clear errors
  clearErrors: () => {
    set({
      itemsError: null,
      foldersError: null,
      alertsError: null,
      tagsError: null,
      activitiesError: null,
      reportsError: null,
    });
  },
}));

export default useInventoryStore;
export { useInventoryStore };
