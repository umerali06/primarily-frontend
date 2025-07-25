import api from "./api";

export const tagsService = {
  // Get all tags with filtering and pagination
  getTags: async (params = {}) => {
    const response = await api.get("/tags", { params });
    return response.data;
  },

  // Get tag by ID
  getTag: async (id) => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },

  // Create new tag
  createTag: async (tagData) => {
    const response = await api.post("/tags", tagData);
    return response.data;
  },

  // Update tag
  updateTag: async (id, tagData) => {
    const response = await api.put(`/tags/${id}`, tagData);
    return response.data;
  },

  // Delete tag
  deleteTag: async (id) => {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
  },

  // Get items by tag
  getItemsByTag: async (tagName, params = {}) => {
    const response = await api.get(`/tags/${tagName}/items`, { params });
    return response.data;
  },

  // Get tag statistics
  getTagStats: async () => {
    const response = await api.get("/tags/stats");
    return response.data;
  },
};
