import { User } from "@/gql/graphql";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUserData: (user: User) => void;
  clearUserData: () => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Set user data and mark as authenticated
        setUserData: (user: User) => {
          set(
            {
              user,
              isAuthenticated: true,
              isLoading: false,
            },
            false,
            "auth/setUserData",
          );
        },

        // Clear user data and mark as unauthenticated
        clearUserData: () => {
          set(
            {
              user: null,
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
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    {
      name: "auth-store",
    },
  ),
);
