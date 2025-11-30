"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { adminProfileOptions } from "@/gql/options/admin-options";
import { ArrowRight, Users, FileText, CreditCard } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#121212]">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 pl-4">
          <h1 className="mb-2 text-3xl font-bold text-white">Welcome, {displayName}</h1>
          <p className="text-gray-400">{currentDate}</p>
        </div>

        {/* Get Started Section */}
        <div className="border-gradient-input max-w-4xl rounded-xl border bg-[#121212] p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Get Started</h2>
          
          <div className="space-y-4">
            <p className="text-gray-300">
              Welcome to the Admin Dashboard. Here you can manage all aspects of the platform.
            </p>

            {/* Quick Actions */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* User Management */}
              <Link
                href="/admin/user-management"
                className="group flex items-start gap-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-purple-500 hover:bg-gray-800"
              >
                <div className="rounded-lg bg-purple-500/10 p-3">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-white">User Management</h3>
                  <p className="text-sm text-gray-400">Manage users, roles, and permissions</p>
                  <ArrowRight className="mt-2 h-4 w-4 text-purple-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>

              {/* Transactions */}
              <Link
                href="/admin/transactions"
                className="group flex items-start gap-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-blue-500 hover:bg-gray-800"
              >
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <CreditCard className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-white">Transactions</h3>
                  <p className="text-sm text-gray-400">View and manage payment transactions</p>
                  <ArrowRight className="mt-2 h-4 w-4 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>

              {/* Subscriptions */}
              <Link
                href="/admin/subscription"
                className="group flex items-start gap-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-green-500 hover:bg-gray-800"
              >
                <div className="rounded-lg bg-green-500/10 p-3">
                  <FileText className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-white">Subscriptions</h3>
                  <p className="text-sm text-gray-400">Manage subscription plans and pricing</p>
                  <ArrowRight className="mt-2 h-4 w-4 text-green-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
