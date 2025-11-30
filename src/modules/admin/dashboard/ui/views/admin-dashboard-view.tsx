"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { adminProfileOptions } from "@/gql/options/admin-options";
import { DashboardLayout } from "../layouts/dashboard-layout";
import { DashboardHeader } from "../components/dashboard-header";
import { DashboardQuickActionsSection } from "../sections/dashboard-quick-actions-section";

const AdminDashboardView = () => {
  const { user, isAuthenticated } = useAuthStore();

  const { data: userProfile, isLoading } = useQuery({
    ...adminProfileOptions(user?.userId || ""),
    enabled: isAuthenticated && !!user?.userId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121212]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121212]">
        <div className="text-white">Please login to view dashboard</div>
      </div>
    );
  }

  const displayName = userProfile?.fullName || "Admin";

  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout>
      <DashboardHeader displayName={displayName} currentDate={currentDate} />
      <DashboardQuickActionsSection />
    </DashboardLayout>
  );
};

export default AdminDashboardView;
