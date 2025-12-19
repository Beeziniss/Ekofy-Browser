"use client";

import Image from "next/image";
import { useAuthStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import MainLoader from "@/components/main-loader";
import { formatCurrency } from "@/utils/format-currency";
import { artistRevenueOptions } from "@/gql/options/artist-options";
import { RevenueStatCard } from "../../components/revenue-stat-card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Users, DollarSign, TrendingUp, Music2, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const DashboardSection = () => {
  const { user } = useAuthStore();
  const artistId = user?.artistId || "";

  const { data: artistData, isLoading, error } = useQuery(artistRevenueOptions(artistId));

  if (isLoading) {
    return <MainLoader />;
  }

  if (error || !artistData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-center">
            <p className="text-red-400">Failed to load dashboard data. Please try again later.</p>
          </div>
        </div>
      </div>
    );
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
            icon={DollarSign}
            iconColor="text-purple-400"
          />
        </div>

        {/* Revenue Breakdown Chart */}
        <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Revenue Breakdown</CardTitle>
            <p className="text-sm text-slate-400">Overview of your revenue streams</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
              <BarChart accessibilityLayer data={revenueChartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-700" />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8" }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
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
