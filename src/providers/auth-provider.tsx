"use client";

import React, { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/store";
import { getUserInfoFromLocalStorage, getAccessTokenFromLocalStorage, isUserAuthenticated } from "@/utils/auth-utils";
import MainLoader from "@/components/main-loader";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isLoading, setUserData, setAuthenticated, setLoading, clearUserData } = useAuthStore();

  useEffect(() => {
    const initializeAuth = () => {
      setLoading(true);

      try {
        // Check if user is authenticated based on localStorage
        const isAuth = isUserAuthenticated();

        if (isAuth) {
          const userInfo = getUserInfoFromLocalStorage();
          const accessToken = getAccessTokenFromLocalStorage();
          if (userInfo && accessToken) {
            setUserData(userInfo, accessToken);
          }
        } else {
          // User is not authenticated, ensure auth state is cleared
          setAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setUserData, setAuthenticated, setLoading, clearUserData]);

  if (isLoading) {
    return <MainLoader />;
  }

  return <>{children}</>;
};

export default AuthProvider;
