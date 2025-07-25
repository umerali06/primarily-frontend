import api from "./api";

export const adminService = {
  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  // Get user by ID
  getUser: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (id, status) => {
    const response = await api.put(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  // Reset user password
  resetUserPassword: async (id) => {
    const response = await api.post(`/admin/users/${id}/reset-password`);
    return response.data;
  },

  // Get system metrics
  getMetrics: async (params = {}) => {
    const response = await api.get("/admin/metrics", { params });
    return response.data;
  },

  // Get system statistics
  getStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },
};
