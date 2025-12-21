"use client";

import Image from "next/image";
import { useAuthStore } from "@/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/utils/format-currency";
import { artistRevenueOptions } from "@/gql/options/artist-options";
import { RevenueStatCard } from "../../components/revenue-stat-card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Music2, Wallet, Coins } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardSection = () => {
  return (
    <Suspense fallback={<DashboardSectionSkeleton />}>
      <DashboardSectionSuspense />
    </Suspense>
  );
};

export const DashboardSectionSkeleton = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-5 w-80" />
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton - 6 cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border-slate-700/50 bg-slate-800/30 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Skeleton */}
        <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-8 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DashboardSectionSuspense = () => {
  const { user } = useAuthStore();
  const artistId = user?.artistId || "";

  const { data: artistData } = useSuspenseQuery(artistRevenueOptions(artistId));

  if (!artistData) {
    return null;
  }

  // Chart configuration
  const chartConfig = {
    value: {
      label: "Amount",
    },
    grossRevenue: {
      label: "Gross Revenue",
      color: "#ec4899",
    },
    netRevenue: {
      label: "Net Revenue",
      color: "#a855f7",
    },
    royaltyEarnings: {
      label: "Royalty Earnings",
      color: "#22d3ee",
    },
    serviceRevenue: {
      label: "Service Revenue",
      color: "#f97316",
    },
    serviceEarnings: {
      label: "Service Earnings",
      color: "#8b5cf6",
    },
  } satisfies ChartConfig;

  // Prepare revenue data for the chart
  const revenueChartData = [
    {
      name: "Gross Revenue",
      value: artistData.grossRevenue || 0,
      fill: "var(--color-grossRevenue)",
    },
    {
      name: "Net Revenue",
      value: artistData.netRevenue || 0,
      fill: "var(--color-netRevenue)",
    },
    {
      name: "Royalty Earnings",
      value: artistData.royaltyEarnings || 0,
      fill: "var(--color-royaltyEarnings)",
    },
    {
      name: "Service Revenue",
      value: artistData.serviceRevenue || 0,
      fill: "var(--color-serviceRevenue)",
    },
    {
      name: "Service Earnings",
      value: artistData.serviceEarnings || 0,
      fill: "var(--color-serviceEarnings)",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {artistData.avatarImage && (
              <Image
                src={artistData.avatarImage}
                alt={artistData.stageName || "Artist"}
                width={64}
                height={64}
                className="border-main-purple h-16 w-16 rounded-full border-2"
              />
            )}
            <div>
              <h1 className="from-main-blue to-main-purple bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
                Hello, {artistData.stageName || "Artist"}
              </h1>
              <p className="mt-1 text-slate-300">Welcome back! Here&apos;s your performance overview</p>
            </div>
          </div>
        </div>

        {/* Stats Grid - 6 cards in 3 columns */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <RevenueStatCard
            title="Followers"
            value={artistData.followerCount || 0}
            icon={Users}
            iconColor="text-cyan-400"
          />
          <RevenueStatCard
            title="Gross Revenue"
            value={formatCurrency(artistData.grossRevenue)}
            icon={DollarSign}
            iconColor="text-pink-400"
          />
          <RevenueStatCard
            title="Net Revenue"
            value={formatCurrency(artistData.netRevenue)}
            icon={TrendingUp}
            iconColor="text-purple-400"
          />
          <RevenueStatCard
            title="Royalty Earnings"
            value={formatCurrency(artistData.royaltyEarnings)}
            icon={Music2}
            iconColor="text-cyan-400"
          />
          <RevenueStatCard
            title="Service Revenue"
            value={formatCurrency(artistData.serviceRevenue)}
            icon={Wallet}
            iconColor="text-pink-400"
          />
          <RevenueStatCard
            title="Service Earnings"
            value={formatCurrency(artistData.serviceEarnings)}
            icon={Coins}
            iconColor="text-purple-400"
          />
        </div>

        {/* Revenue Breakdown Chart */}
        <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Revenue Breakdown</CardTitle>
            <p className="text-sm text-slate-400">Overview of your revenue streams</p>
            {/* Thêm chú thích đơn vị tiền tệ ở góc phải trên */}
            <div className="rounded border border-slate-600 bg-slate-700/30 px-2 py-1 text-sm font-medium text-slate-500">
              Unit: <span className="text-sm font-bold text-purple-400">VND</span>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
              <BarChart accessibilityLayer data={revenueChartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-700" />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis
                  width={100} // Tăng giá trị này lên (ví dụ 80 hoặc 100 tùy độ dài số)
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8" }}
                  tickFormatter={(value) => value.toLocaleString("vi-VN")}
                />
                <ChartTooltip
                  // cursor={false}
                  content={<ChartTooltipContent className={"w-50"} />}
                />
                <Bar dataKey="value" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSection;
