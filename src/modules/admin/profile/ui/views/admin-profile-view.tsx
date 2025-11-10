"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { adminProfileOptions } from "@/gql/options/admin-options";
import ProfileSection from "../section/profile-section";
import { graphql } from "@/gql";

export const GetUserProfileQuery = graphql(`
  query Users($where: UserFilterInput) {
    users(where: $where) {
      items {
        id
        email
        fullName
        gender
        birthDate
        role
        phoneNumber
        status
        createdAt
        updatedAt
      }
    }
  }
`);

const AdminProfileView = () => {
  const { user, isAuthenticated } = useAuthStore();

  const { data: userProfile, isLoading } = useQuery({
    ...adminProfileOptions(user?.userId || ""),
    enabled: isAuthenticated && !!user?.userId,
  });

  // Show loading while fetching data
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121212]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
      </div>
    );
  }

  // Don't render if not authenticated or no user
  if (!isAuthenticated || !user?.userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121212]">
        <div className="text-white">Please login to view profile</div>
      </div>
    );
  }

  // Get display name from email
  const displayName =
    userProfile?.email
      ?.split("@")[0]
      ?.replace(".", " ")
      ?.replace(/\b\w/g, (l: string) => l.toUpperCase()) || "User";

  // Format current date
  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 pl-4">
          <h1 className="mb-2 text-3xl font-bold text-white">Welcome, {displayName}</h1>
          <p className="text-gray-400">{currentDate}</p>
        </div>

        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
            </div>
          }
        >
          <ProfileSection />
        </Suspense>
      </div>
    </div>
  );
};

export default AdminProfileView;
