import { create } from "zustand";
import { persist } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutes

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
      refreshTimeoutId: null,

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
        get().scheduleTokenRefresh();
      },

      updateUser: (userData) => {
        set({
          profile: userData.profilePic.fileLink,
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          userType: userData.userType,
          role: userData.role,
          firstTime: userData.firstTime,
          enabled: userData.enabled,
          authorized: userData.isAuthorized,
        });
      },

      clearUser: () => {
        get().cancelTokenRefresh();
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

          if (data.responsecode === "00" && data.data) {
            const tokenExpirationTime = Date.now() + TOKEN_REFRESH_INTERVAL;
            set({ 
              accessToken: data.data.accessToken,
              refreshToken: data.data.newRefreshToken,
              tokenExpirationTime 
            });
            get().scheduleTokenRefresh();
            return true;
          } else {
            throw new Error("Invalid response from refresh token endpoint");
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          get().clearUser(); 
          return false;
        }
      },
      getAccessToken: async () => {
        const { accessToken, tokenExpirationTime, refreshAccessToken } = get();
        if (!accessToken || Date.now() >= tokenExpirationTime) {
       
        }
        return get().accessToken;
      },

      scheduleTokenRefresh: () => {
        const { tokenExpirationTime, refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
        }
        
        const timeUntilRefresh = tokenExpirationTime - Date.now() - 60000; // Refresh 1 minute before expiration
        const newTimeoutId = setTimeout(() => {
          get().refreshAccessToken();
        }, timeUntilRefresh);
        
        set({ refreshTimeoutId: newTimeoutId });
      },

      cancelTokenRefresh: () => {
        const { refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          set({ refreshTimeoutId: null });
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);