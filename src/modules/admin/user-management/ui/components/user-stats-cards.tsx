"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";
// import { UserPlus } from "lucide-react"; // Commented out - not used anymore

interface UserStatsCardsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  // newUsers: number; // Commented out - data not working
}

export function UserStatsCards({ totalUsers, activeUsers, inactiveUsers /* newUsers */ }: UserStatsCardsProps) {
  const stats = [
    {
      title: "Total User",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "text-white",
    },
    {
      title: "Active User",
      value: activeUsers.toLocaleString(),
      icon: UserCheck,
      color: "text-white",
    },
    {
      title: "Inactive User",
      value: inactiveUsers.toLocaleString(),
      icon: UserX,
      color: "text-white",
    },
    // Commented out - New User data not working
    // {
    //   title: "New User",
    //   value: newUsers.toLocaleString(),
    //   icon: UserPlus,
    //   color: "text-white",
    // },
  ];

  return (
    <div className="border-gradient-input rounded-xl border bg-[#121212] p-6">
      <div className="flex items-end gap-x-3 p-3 pb-6">
        <h2 className="text-xl font-bold">User Management</h2>
        <span className="primary_gradient w-fit bg-clip-text text-sm text-transparent">Stats updated daily</span>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className=" border-gray-700 bg-white/2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{stat.title}</p>
                  <p className="primary_gradient bg-clip-text text-2xl font-bold text-transparent">{stat.value}</p>
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
