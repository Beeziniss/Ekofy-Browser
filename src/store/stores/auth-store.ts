import { IUserLocalStorage } from "@/types/auth";
import { clearAuthData } from "@/utils/auth-utils";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  // State
  user: IUserLocalStorage | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUserData: (user: IUserLocalStorage, accessToken?: string) => void;
  clearUserData: () => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setAccessToken: (token: string | null) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
};

// Helper function to sync auth state with cookies for middleware access
const syncAuthWithCookies = (state: Partial<AuthState>) => {
  if (typeof window !== "undefined") {
    try {
      const authData = {
        state: {
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        },
      };

      console.log(authData);

      // Set cookie with auth data for middleware access
      const cookieValue = JSON.stringify(authData);
      document.cookie = `auth-storage=${encodeURIComponent(cookieValue)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
    } catch (error) {
      console.error("Failed to sync auth state with cookies:", error);
    }
  }
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Set user data and mark as authenticated
        setUserData: (user: IUserLocalStorage, accessToken?: string) => {
          const newState = {
            user,
            accessToken: accessToken || null,
            isAuthenticated: true,
            isLoading: false,
          };

          set(newState, false, "auth/setUserData");
          syncAuthWithCookies(newState);
        },

        // Clear user data and mark as unauthenticated
        clearUserData: () => {
          clearAuthData(); // Clear localStorage

          const newState = {
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          };

          set(newState, false, "auth/clearUserData");

          // Clear auth cookie
          if (typeof window !== "undefined") {
            document.cookie =
              "auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
        },

        // Set authentication status
        setAuthenticated: (authenticated: boolean) => {
          const newState = { isAuthenticated: authenticated };
          set(newState, false, "auth/setAuthenticated");
          syncAuthWithCookies(newState);
        },

        // Set loading status
        setLoading: (loading: boolean) => {
          set({ isLoading: loading }, false, "auth/setLoading");
        },

        // Set access token
        setAccessToken: (token: string | null) => {
          set({ accessToken: token }, false, "auth/setAccessToken");
        },

        // Reset entire auth state
        reset: () => {
          set(initialState, false, "auth/reset");

          // Clear auth cookie
          if (typeof window !== "undefined") {
            document.cookie =
              "auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
        },
      }),
      {
        name: "auth-storage",
        // Only persist essential state
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
        }),
        // Sync with cookies when state is rehydrated
        onRehydrateStorage: () => (state) => {
          if (state) {
            syncAuthWithCookies(state);
          }
        },
      },
    ),
    {
      name: "auth-store",
    },
  ),
);
