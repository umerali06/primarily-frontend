import api from "./api";

export const onboardingService = {
  // Get onboarding status
  getStatus: async () => {
    const response = await api.get("/onboarding/status");
    return response.data;
  },

  // Complete onboarding
  complete: async (onboardingData) => {
    const response = await api.post("/onboarding/complete", onboardingData);
    return response.data;
  },

  // Skip onboarding
  skip: async () => {
    const response = await api.post("/onboarding/skip");
    return response.data;
  },

  // Get user preferences
  getPreferences: async () => {
    const response = await api.get("/onboarding/preferences");
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences) => {
    const response = await api.put("/onboarding/preferences", { preferences });
    return response.data;
  },
};
