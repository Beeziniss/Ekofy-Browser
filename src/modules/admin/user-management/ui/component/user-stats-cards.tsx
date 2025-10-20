"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";

interface UserStatsCardsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsers: number;
}

export function UserStatsCards({
  totalUsers,
  activeUsers,
  inactiveUsers,
  newUsers,
}: UserStatsCardsProps) {
  const stats = [
    {
      title: "Total User",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: "Active User",
      value: activeUsers.toLocaleString(),
      icon: UserCheck,
      color: "text-green-400",
    },
    {
      title: "Inactive User",
      value: inactiveUsers.toLocaleString(),
      icon: UserX,
      color: "text-red-400",
    },
    {
      title: "New User",
      value: newUsers.toLocaleString(),
      icon: UserPlus,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-700 p-4">
      <div className="flex items-end gap-x-3 pb-6 p-3">
        <h2 className="text-xl font-bold">User Management</h2>
        <span className="primary_gradient w-fit bg-clip-text text-sm text-transparent">
          Stats updated daily
        </span>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-main-dark-bg border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold primary_gradient text-transparent bg-clip-text">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
