import api from "./api";

export const trialService = {
  // Start free trial
  start: async (trialData) => {
    const response = await api.post("/trial/start", trialData);
    return response.data;
  },

  // Get trial status
  getStatus: async () => {
    const response = await api.get("/trial/status");
    return response.data;
  },

  // Update trial information
  update: async (trialData) => {
    const response = await api.put("/trial/update", trialData);
    return response.data;
  },

  // Extend trial
  extend: async (days, reason) => {
    const response = await api.put("/trial/extend", { days, reason });
    return response.data;
  },

  // Convert trial to paid plan
  convert: async (planSelected, conversionSource) => {
    const response = await api.post("/trial/convert", {
      planSelected,
      conversionSource,
    });
    return response.data;
  },

  // Update usage
  updateUsage: async (usageType, increment = 1) => {
    const response = await api.put("/trial/usage", { usageType, increment });
    return response.data;
  },

  // Cancel trial
  cancel: async () => {
    const response = await api.put("/trial/cancel");
    return response.data;
  },
};
