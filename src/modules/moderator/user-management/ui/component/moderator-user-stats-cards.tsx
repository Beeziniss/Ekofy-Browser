"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { moderatorUserAnalyticsOptions } from "@/gql/options/moderator-options";
import { UserStatus } from "@/gql/graphql";
import { ModeratorUserTableData } from "@/types";

export function ModeratorUserStatsCards() {
  const { data: analyticsData, isLoading, error } = useQuery(moderatorUserAnalyticsOptions());

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 h-4 animate-pulse rounded bg-gray-600"></div>
                  <div className="h-8 animate-pulse rounded bg-gray-600"></div>
                </div>
                <div className="animate-pulse rounded-full bg-gray-600 p-3">
                  <div className="h-6 w-6"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full border-gray-700 bg-gray-800/50">
          <CardContent className="p-6">
            <div className="text-center text-red-400">Error loading analytics: {error.message}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const users = analyticsData?.users?.items || [];
  const totalCount = analyticsData?.users?.totalCount || 0;

  // Calculate stats from analytics data
  const statsData = {
    totalUsers: totalCount,
    activeUsers: users.filter((user: ModeratorUserTableData) => user.status === UserStatus.Active).length,
    inactiveUsers: users.filter((user: ModeratorUserTableData) => user.status === UserStatus.Inactive).length,
    newUsers: users.filter((user: ModeratorUserTableData) => {
      const createdAt = new Date(user.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdAt > thirtyDaysAgo;
    }).length,
  };
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Users */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total User</p>
              <p className="text-3xl font-bold text-blue-400">{statsData.totalUsers.toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-blue-500/20 p-3">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active User</p>
              <p className="text-3xl font-bold text-green-400">{statsData.activeUsers.toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-green-500/20 p-3">
              <UserCheck className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inactive Users */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Inactive User</p>
              <p className="text-3xl font-bold text-red-400">{statsData.inactiveUsers.toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-red-500/20 p-3">
              <UserX className="h-6 w-6 text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Users */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">New User</p>
              <p className="text-3xl font-bold text-purple-400">{statsData.newUsers.toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-purple-500/20 p-3">
              <UserPlus className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
