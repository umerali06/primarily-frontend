import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/auth";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          const { user, token, refreshToken } = response.data;

          // Store tokens in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Login failed",
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          const { user, token, refreshToken } = response.data;

          // Store tokens in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Registration failed",
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Clear tokens from localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");

          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      getCurrentUser: async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await authService.getCurrentUser();
          set({
            user: response,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Token might be expired, try to refresh
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            try {
              const refreshResponse = await authService.refreshToken(
                refreshToken
              );
              localStorage.setItem("token", refreshResponse.token);

              // Retry getting current user
              const userResponse = await authService.getCurrentUser();
              set({
                user: userResponse,
                token: refreshResponse.token,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch (refreshError) {
              // Refresh failed, clear auth state
              get().logout();
            }
          } else {
            get().logout();
          }
        }
      },

      updatePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.updatePassword(
            currentPassword,
            newPassword
          );
          set({ isLoading: false });
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Password update failed",
          });
          throw error;
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));

        // Update localStorage with merged user data
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      },

      clearError: () => set({ error: null }),

      // Initialize auth state from localStorage
      initialize: () => {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");
        const user = localStorage.getItem("user");

        if (token && refreshToken) {
          const userData = user ? JSON.parse(user) : null;

          set({
            token,
            refreshToken,
            user: userData,
            isAuthenticated: true,
          });

          // Verify token is still valid and get fresh user data
          get().getCurrentUser();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
