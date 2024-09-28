import { create } from "zustand";
import { persist } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; 

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuth: false,
      profile: null,
      username: "",
      email: "",
      phoneNumber: "",
      userType: "",
      role: "",
      accessToken: "",
      refreshToken: "",
      firstTime: false,
      enabled: false,
      authorized: false,
      tokenExpirationTime: null,
      refreshInterval: null,

      setUser: (userData) => {
        const tokenExpirationTime = Date.now() + TOKEN_REFRESH_INTERVAL;
        set({
          isAuth: true,
          profile: userData.profilePic.fileLink,
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          userType: userData.userType,
          role: userData.role,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          firstTime: userData.firstTime,
          enabled: userData.enabled,
          authorized: userData.authorized,
          tokenExpirationTime,
        });
        get().startTokenRefreshInterval();
      },

      clearUser: () => {
        get().stopTokenRefreshInterval();
        set({
          isAuth: false,
          profile: null,
          username: "",
          email: "",
          phoneNumber: "",
          userType: "",
          role: "",
          accessToken: "",
          refreshToken: "",
          firstTime: false,
          enabled: false,
          authorized: false,
          tokenExpirationTime: null,
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          console.error("No refresh token available");
          return false;
        }

        try {
          const response = await fetch(`${SERVER_API}/users/public/promoter/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            throw new Error("Failed to refresh token");
          }

          const data = await response.json();
          const tokenExpirationTime = Date.now() + TOKEN_REFRESH_INTERVAL;
          set({ 
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            tokenExpirationTime 
          });
          return true;
        } catch (error) {
          console.error("Error refreshing token:", error);
          return false;
        }
      },

      getAccessToken: async () => {
        const { accessToken, refreshAccessToken, tokenExpirationTime } = get();
        if (!accessToken || Date.now() >= tokenExpirationTime) {
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            return null;
          }
        }
        return get().accessToken;
      },

      startTokenRefreshInterval: () => {
        const interval = setInterval(() => {
          get().refreshAccessToken();
        }, TOKEN_REFRESH_INTERVAL);
        set({ refreshInterval: interval });
      },

      stopTokenRefreshInterval: () => {
        const { refreshInterval } = get();
        if (refreshInterval) {
          clearInterval(refreshInterval);
          set({ refreshInterval: null });
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);