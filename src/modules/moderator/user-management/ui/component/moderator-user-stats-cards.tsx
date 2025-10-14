"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import { ModeratorUserStatsData } from "@/types";

interface ModeratorUserStatsCardsProps {
  data: ModeratorUserStatsData;
}

export function ModeratorUserStatsCards({ data }: ModeratorUserStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Users */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Total User</p>
              <p className="text-3xl font-bold text-blue-400">
                {data.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Active User</p>
              <p className="text-3xl font-bold text-green-400">
                {data.activeUsers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <UserCheck className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inactive Users */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Inactive User</p>
              <p className="text-3xl font-bold text-red-400">
                {data.inactiveUsers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-full">
              <UserX className="h-6 w-6 text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Users */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">New User</p>
              <p className="text-3xl font-bold text-purple-400">
                {data.newUsers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <UserPlus className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}