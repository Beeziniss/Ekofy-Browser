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

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Set user data and mark as authenticated
        setUserData: (user: IUserLocalStorage, accessToken?: string) => {
          set(
            {
              user,
              accessToken: accessToken || null,
              isAuthenticated: true,
              isLoading: false,
            },
            false,
            "auth/setUserData",
          );
        },

        // Clear user data and mark as unauthenticated
        clearUserData: () => {
          clearAuthData(); // Clear localStorage
          set(
            {
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            "auth/clearUserData",
          );
        },

        // Set authentication status
        setAuthenticated: (authenticated: boolean) => {
          set(
            { isAuthenticated: authenticated },
            false,
            "auth/setAuthenticated",
          );
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
      },
    ),
    {
      name: "auth-store",
    },
  ),
);
