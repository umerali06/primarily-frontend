import api from "./api";

export const reportsService = {
  // Get inventory summary report
  getInventorySummary: async (params = {}) => {
    const response = await api.get("/reports/inventory-summary", { params });
    return response.data;
  },

  // Get transactions report
  getTransactions: async (params = {}) => {
    const response = await api.get("/reports/transactions", { params });
    return response.data;
  },

  // Get activity history report
  getActivityHistory: async (params = {}) => {
    const response = await api.get("/reports/activity-history", { params });
    return response.data;
  },

  // Get item flow report
  getItemFlow: async (params = {}) => {
    const response = await api.get("/reports/item-flow", { params });
    return response.data;
  },

  // Get move summary report
  getMoveSummary: async (params = {}) => {
    const response = await api.get("/reports/move-summary", { params });
    return response.data;
  },

  // Get user activity summary report
  getUserActivitySummary: async (params = {}) => {
    const response = await api.get("/reports/user-activity-summary", {
      params,
    });
    return response.data;
  },

  // Export report
  exportReport: async (reportType, format, params = {}) => {
    const response = await api.post(
      "/reports/export",
      {
        reportType,
        format,
        ...params,
      },
      {
        responseType: "blob",
      }
    );
    return response.data;
  },
};
