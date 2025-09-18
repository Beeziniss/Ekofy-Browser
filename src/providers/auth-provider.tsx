"use client";

import React, { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/store";
import {
  getUserInfoFromLocalStorage,
  isUserAuthenticated,
} from "@/utils/auth-utils";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setUserData, setAuthenticated, setLoading, clearUserData } =
    useAuthStore();

  useEffect(() => {
    const initializeAuth = () => {
      setLoading(true);

      try {
        // Check if user is authenticated based on localStorage
        const isAuth = isUserAuthenticated();

        if (isAuth) {
          const userInfo = getUserInfoFromLocalStorage();
          if (userInfo) {
            setUserData(userInfo);
          } else {
            // If no user info found but isAuth is true, clear auth state
            clearUserData();
          }
        } else {
          // User is not authenticated, ensure auth state is cleared
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error initializing auth state:", error);
        // On error, clear auth state
        clearUserData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setUserData, setAuthenticated, setLoading, clearUserData]);

  return <>{children}</>;
};

export default AuthProvider;
