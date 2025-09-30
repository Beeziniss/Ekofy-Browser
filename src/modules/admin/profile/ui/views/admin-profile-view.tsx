"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
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
  const { user } = useAuthStore();
  const { data: userProfile } = useSuspenseQuery(adminProfileOptions(user?.userId || ""));
  
  // Get display name from email
  const displayName = userProfile?.email?.split("@")[0]?.replace(".", " ")?.replace(/\b\w/g, l => l.toUpperCase()) || "User";
  
  // Format current date
  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit", 
    month: "long",
    year: "numeric"
  });

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 pl-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {displayName}
          </h1>
          <p className="text-gray-400">
            {currentDate}
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        }>
          <ProfileSection />
        </Suspense>
      </div>
    </div>
  );
};

export default AdminProfileView;
