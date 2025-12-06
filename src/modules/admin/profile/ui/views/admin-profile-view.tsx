"use client";

import { Suspense } from "react";
import { useAuthStore } from "@/store";
import { useAdminProfile } from "../../hooks/use-admin-profile";
import ProfileSection from "../sections/profile-section";

const AdminProfileView = () => {
  const { isAuthenticated } = useAuthStore();
  const profileData = useAdminProfile();
  const { data, isLoading } = profileData;

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121212]">
        <div className="text-white">Please login to view profile</div>
      </div>
    );
  }

  // Show loading while fetching data
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121212]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="container mx-auto px-4 py-8">
        {/* Simple Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="mt-2 text-gray-400">Manage your account information</p>
        </div>

        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
            </div>
          }
        >
          <ProfileSection userProfile={data} />
        </Suspense>
      </div>
    </div>
  );
};

export default AdminProfileView;
