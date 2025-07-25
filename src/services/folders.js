import api from "./api";

export const foldersService = {
  // Get all folders with filtering and pagination
  getFolders: async (params = {}) => {
    const response = await api.get("/folders", { params });
    return response.data;
  },

  // Get folder by ID with contents
  getFolder: async (id) => {
    const response = await api.get(`/folders/${id}`);
    return response.data;
  },

  // Get folder hierarchy
  getFolderHierarchy: async () => {
    const response = await api.get("/folders/hierarchy");
    return response.data;
  },

  // Create new folder
  createFolder: async (folderData) => {
    const response = await api.post("/folders", folderData);
    return response.data;
  },

  // Update folder
  updateFolder: async (id, folderData) => {
    const response = await api.put(`/folders/${id}`, folderData);
    return response.data;
  },

  // Delete folder
  deleteFolder: async (id, moveItemsTo = null) => {
    const params = moveItemsTo ? { moveItemsTo } : {};
    const response = await api.delete(`/folders/${id}`, { params });
    return response.data;
  },

  // Move folder
  moveFolder: async (id, parentId) => {
    const response = await api.put(`/folders/${id}/move`, { parentId });
    return response.data;
  },

  // Add folder image
  addImage: async (id, imageUrl) => {
    const response = await api.post(`/folders/${id}/images`, { imageUrl });
    return response.data;
  },

  // Remove folder image
  removeImage: async (id, imageIndex) => {
    const response = await api.delete(`/folders/${id}/images/${imageIndex}`);
    return response.data;
  },

  // Clone folder
  cloneFolder: async (id, name, includeItems = true) => {
    const response = await api.post(`/folders/${id}/clone`, {
      name,
      includeItems,
    });
    return response.data;
  },

  // Get folder history
  getFolderHistory: async (id, params = {}) => {
    const response = await api.get(`/folders/${id}/activities`, { params });
    return response.data;
  },

  // Set folder permissions
  setFolderPermissions: async (id, permissions) => {
    const response = await api.put(`/folders/${id}/permissions`, {
      permissions,
    });
    return response.data;
  },

  // Get folder permissions
  getFolderPermissions: async (id) => {
    const response = await api.get(`/folders/${id}/permissions`);
    return response.data;
  },

  // Set folder alert
  setFolderAlert: async (id, alertConfig) => {
    const response = await api.post(`/folders/${id}/alerts`, alertConfig);
    return response.data;
  },

  // Get folder alerts
  getFolderAlerts: async (id) => {
    const response = await api.get(`/folders/${id}/alerts`);
    return response.data;
  },

  // Update folder alert
  updateFolderAlert: async (id, alertId, alertConfig) => {
    const response = await api.put(
      `/folders/${id}/alerts/${alertId}`,
      alertConfig
    );
    return response.data;
  },

  // Delete folder alert
  deleteFolderAlert: async (id, alertId) => {
    const response = await api.delete(`/folders/${id}/alerts/${alertId}`);
    return response.data;
  },

  // Export folder
  exportFolder: async (id, format = "csv", options = {}) => {
    const response = await api.post(
      `/folders/${id}/export`,
      {
        format,
        options,
      },
      {
        responseType: "blob",
      }
    );
    return response.data;
  },

  // Create folder label
  createFolderLabel: async (id, labelData) => {
    const response = await api.post(`/folders/${id}/labels`, labelData);
    return response.data;
  },

  // Get folder labels
  getFolderLabels: async (id) => {
    const response = await api.get(`/folders/${id}/labels`);
    return response.data;
  },

  // Update folder label
  updateFolderLabel: async (id, labelId, labelData) => {
    const response = await api.put(
      `/folders/${id}/labels/${labelId}`,
      labelData
    );
    return response.data;
  },

  // Delete folder label
  deleteFolderLabel: async (id, labelId) => {
    const response = await api.delete(`/folders/${id}/labels/${labelId}`);
    return response.data;
  },

  // Get folder items with filtering and pagination
  getFolderItems: async (id, params = {}) => {
    const response = await api.get(`/folders/${id}/items`, { params });
    return response.data;
  },

  // Move items between folders
  moveItems: async (sourceId, targetId, itemIds) => {
    const response = await api.put(`/folders/${sourceId}/move-items`, {
      targetId,
      itemIds,
    });
    return response.data;
  },

  // Get folder statistics
  getFolderStats: async (id) => {
    const response = await api.get(`/folders/${id}/stats`);
    return response.data;
  },

  // Search folders
  searchFolders: async (query, params = {}) => {
    const response = await api.get("/folders/search", {
      params: { q: query, ...params },
    });
    return response.data;
  },
};
