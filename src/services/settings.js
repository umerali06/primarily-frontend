import api from "./api";

export const settingsService = {
  // Get user settings
  getUserSettings: async () => {
    try {
      const response = await api.get("/settings");
      return response.data;
    } catch (error) {
      console.warn("API error during settings fetch:", error.message);

      // Check if it's a network error (API not available)
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        // Provide mock settings for demo purposes
        const mockSettings = {
          profile: {
            displayName: "Demo User",
            timezone: "UTC+05:00",
            language: "en",
            dateFormat: "MM/DD/YYYY",
            timeFormat: "12h",
          },
          preferences: {
            defaultView: "grid",
            itemsPerPage: 20,
            autoSave: true,
            theme: "light",
            compactMode: false,
            showTutorials: true,
            defaultSortBy: "createdAt",
            defaultSortOrder: "desc",
          },
          notifications: {
            email: {
              enabled: true,
              lowStock: true,
              reports: false,
              updates: true,
              marketing: false,
            },
            push: {
              enabled: true,
              lowStock: true,
              reports: false,
              updates: true,
            },
            inApp: {
              enabled: true,
              lowStock: true,
              reports: true,
              updates: true,
            },
          },
          privacy: {
            profileVisibility: "private",
            dataSharing: false,
            analytics: true,
            crashReports: true,
          },
          security: {
            twoFactorEnabled: false,
            sessionTimeout: 24,
            loginNotifications: true,
          },
          integrations: {
            googleDrive: { enabled: false },
            dropbox: { enabled: false },
            slack: { enabled: false },
          },
          // Additional fields for compatibility with frontend
          phone: "",
          jobFunction: "",
          role: "user",
          companyName: "",
          industry: "",
          companyColor: "#0a7662",
          initials: "DU",
          timezone: "UTC+05:00",
          catalogView: "grid",
          sortBy: "updatedAt",
          sortOrder: "desc",
          emailAlerts: true,
          emailNotifications: true,
          pushNotifications: true,
          lowStockAlerts: true,
          itemUpdates: true,
          systemUpdates: true,
        };

        return {
          success: true,
          message: "Settings retrieved successfully (Demo Mode)",
          data: {
            settings: mockSettings,
          },
        };
      }
      throw error;
    }
  },

  // Update user settings (unified method)
  updateUserSettings: async (settingsData) => {
    try {
      const response = await api.put("/settings", settingsData);
      return response.data;
    } catch (error) {
      console.warn("API error during settings update:", error.message);

      // For demo purposes, simulate success
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          message: "Settings updated successfully (Demo Mode)",
          data: {
            settings: settingsData,
          },
        };
      }
      throw error;
    }
  },

  // Alias for backward compatibility
  updateSettings: async (settingsData) => {
    return settingsService.updateUserSettings(settingsData);
  },

  // Update profile settings
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/settings/profile", profileData);
      return response.data;
    } catch (error) {
      console.warn("API error during profile update:", error.message);

      // For demo purposes, simulate success
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          message: "Profile updated successfully (Demo Mode)",
          data: {
            profile: profileData,
          },
        };
      }
      throw error;
    }
  },

  // Update preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put("/settings/preferences", preferences);
      return response.data;
    } catch (error) {
      console.warn("API error during preferences update:", error.message);

      // For demo purposes, simulate success
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          message: "Preferences updated successfully (Demo Mode)",
          data: {
            preferences: preferences,
          },
        };
      }
      throw error;
    }
  },

  // Update notification settings
  updateNotifications: async (notifications) => {
    try {
      const response = await api.put("/settings/notifications", notifications);
      return response.data;
    } catch (error) {
      console.warn("API error during notifications update:", error.message);

      // For demo purposes, simulate success
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          message: "Notifications updated successfully (Demo Mode)",
          data: {
            notifications: notifications,
          },
        };
      }
      throw error;
    }
  },

  // Update privacy settings
  updatePrivacy: async (privacy) => {
    try {
      const response = await api.put("/settings/privacy", privacy);
      return response.data;
    } catch (error) {
      console.warn("API error during privacy update:", error.message);

      // For demo purposes, simulate success
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          message: "Privacy settings updated successfully (Demo Mode)",
          data: {
            privacy: privacy,
          },
        };
      }
      throw error;
    }
  },

  // Update security settings
  updateSecurity: async (security) => {
    try {
      const response = await api.put("/settings/security", security);
      return response.data;
    } catch (error) {
      console.warn("API error during security update:", error.message);

      // For demo purposes, simulate success
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          message: "Security settings updated successfully (Demo Mode)",
          data: {
            security: security,
          },
        };
      }
      throw error;
    }
  },

  // Update integration settings
  updateIntegrations: async (integrations) => {
    try {
      const response = await api.put("/settings/integrations", integrations);
      return response.data;
    } catch (error) {
      console.warn("API error during integrations update:", error.message);

      // For demo purposes, simulate success
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          message: "Integration settings updated successfully (Demo Mode)",
          data: {
            integrations: integrations,
          },
        };
      }
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put("/settings/password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.warn("API error during password change:", error.message);

      // For demo purposes, simulate success
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          message: "Password changed successfully (Demo Mode)",
        };
      }
      throw error;
    }
  },

  // Reset settings to defaults
  resetSettings: async () => {
    try {
      const response = await api.post("/settings/reset");
      return response.data;
    } catch (error) {
      console.warn("API error during settings reset:", error.message);

      // For demo purposes, simulate success
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        return {
          success: true,
          message: "Settings reset successfully (Demo Mode)",
        };
      }
      throw error;
    }
  },
};
