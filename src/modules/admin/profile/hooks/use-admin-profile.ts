"use client";

import { format } from "date-fns";
import { useAuthStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { adminProfileOptions } from "@/gql/options/admin-options";

export function useAdminProfile() {
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.userId || "";
  const enabled = !!userId && !!isAuthenticated;

  const query = useQuery({
    ...adminProfileOptions(userId),
    enabled,
  });

  // Transform profile data
  const profileData = query.data;

  const header = {
    name: profileData?.fullName || profileData?.email || "Admin",
    userId: userId,
  };

  const personal = {
    fullName: profileData?.fullName || "",
    email: profileData?.email || "",
    phoneNumber: profileData?.phoneNumber || undefined,
  };

  const account = {
    createdAt: profileData?.createdAt
      ? (() => {
          try {
            const date = new Date(profileData.createdAt);
            return isNaN(date.getTime()) ? "N/A" : format(date, "dd-MM-yyyy");
          } catch {
            return "N/A";
          }
        })()
      : "N/A",
    role: profileData?.role || "ADMIN",
    status: profileData?.status || "Active",
  };

  return {
    ...query,
    data: profileData,
    header,
    personal,
    account,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
