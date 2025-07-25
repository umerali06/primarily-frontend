import api from "./api";

export const activitiesService = {
  // Get all activities with filtering and pagination
  getActivities: async (params = {}) => {
    const response = await api.get("/activities", { params });
    return response.data;
  },

  // Get activity by ID
  getActivity: async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  // Get activities for a specific item
  getItemActivities: async (itemId, params = {}) => {
    const response = await api.get(`/items/${itemId}/activities`, { params });
    return response.data;
  },

  // Get activities for a specific folder
  getFolderActivities: async (folderId, params = {}) => {
    const response = await api.get(`/folders/${folderId}/activities`, {
      params,
    });
    return response.data;
  },

  // Get activity statistics
  getActivityStats: async (params = {}) => {
    const response = await api.get("/activities/stats", { params });
    return response.data;
  },
};
