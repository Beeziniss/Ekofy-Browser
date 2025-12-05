"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle, DollarSign } from "lucide-react";

interface OrderDisputedStatsProps {
  totalDisputed?: number;
  pendingResolution?: number;
  resolvedToday?: number;
  totalAmount?: number;
}

export function OrderDisputedStats({
  totalDisputed = 0,
  pendingResolution = 0,
  resolvedToday = 0,
  totalAmount = 0,
}: OrderDisputedStatsProps) {
  const stats = [
    {
      title: "Total Disputed Orders",
      value: totalDisputed,
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Pending Resolution",
      value: pendingResolution,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Resolved Today",
      value: resolvedToday,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Disputed Amount",
      value: `${(totalAmount / 1000000).toFixed(1)}M VND`,
      icon: DollarSign,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-gray-700 bg-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
            <div className={`rounded-lg p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
