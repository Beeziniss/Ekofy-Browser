"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Music, UserCheck, Radio } from "lucide-react";
import { useMemo } from "react";
import { StatsCard } from "../component/stats-card";
import { 
  totalListenersOptions, 
  totalArtistsOptions, 
  totalTracksOptions,
  trackDailyMetricsOptions,
} from "@/gql/options/dashboard-options";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStatsSection() {
  // Fetch all stats in parallel - they don't block each other
  const { data: listenersData, isLoading: listenersLoading } = useQuery(
    totalListenersOptions()
  );
  const { data: artistsData, isLoading: artistsLoading } = useQuery(
    totalArtistsOptions()
  );
  const { data: tracksData, isLoading: tracksLoading } = useQuery(
    totalTracksOptions()
  );

  // Calculate streams for monthly period only
  const now = useMemo(() => new Date(), []);
  const oneMonthAgo = useMemo(() => new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()), [now]);

  const { data: monthlyStreamsData, isLoading: monthlyStreamsLoading } = useQuery(
    trackDailyMetricsOptions({ createdAt: { gte: oneMonthAgo.toISOString() } })
  );

  const totalListeners = listenersData?.totalCount || 0;
  const totalArtists = artistsData?.totalCount || 0;
  const totalTracks = tracksData?.totalCount || 0;
  const monthlyStreams = monthlyStreamsData?.totalCount || 0;

  // Calculate month-over-month growth based on createdAt
  const calculateMonthOverMonthGrowth = useMemo(() => {
    return (items: Array<{ createdAt: string }> | null | undefined) => {
      if (!items || items.length === 0) {
        return { change: "0%", changeType: "positive" as const };
      }

      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      // Count items created this month
      const currentMonthCount = items.filter(
        (item) => new Date(item.createdAt) >= currentMonthStart
      ).length;

      // Count items created last month
      const lastMonthCount = items.filter(
        (item) => {
          const date = new Date(item.createdAt);
          return date >= lastMonthStart && date <= lastMonthEnd;
        }
      ).length;

      if (lastMonthCount === 0) {
        return {
          change: currentMonthCount > 0 ? "+100%" : "0%",
          changeType: "positive" as const,
        };
      }

      const percentageChange = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
      const roundedChange = Math.round(percentageChange * 10) / 10;

      return {
        change: `${roundedChange > 0 ? "+" : ""}${roundedChange}%`,
        changeType: roundedChange >= 0 ? ("positive" as const) : ("negative" as const),
      };
    };
  }, [now]);

  const listenersGrowth = calculateMonthOverMonthGrowth(listenersData?.items);
  const artistsGrowth = calculateMonthOverMonthGrowth(artistsData?.items);
  const tracksGrowth = calculateMonthOverMonthGrowth(tracksData?.items);

  // Calculate stream growth (month over month)
  const streamGrowth = useMemo(() => {
    if (!monthlyStreamsData?.items) {
      return { change: "0%", changeType: "positive" as const };
    }

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    
    const currentMonthStreams = monthlyStreamsData.items.filter((item) => {
      const date = new Date(item.createdAt);
      return date >= currentMonthStart;
    }).length;

    const lastMonthStreams = monthlyStreamsData.items.filter((item) => {
      const date = new Date(item.createdAt);
      return date >= lastMonthStart && date <= lastMonthEnd;
    }).length;

    if (lastMonthStreams === 0) {
      return {
        change: currentMonthStreams > 0 ? "+100%" : "0%",
        changeType: "positive" as const,
      };
    }

    const percentageChange = ((currentMonthStreams - lastMonthStreams) / lastMonthStreams) * 100;
    const roundedChange = Math.round(percentageChange * 10) / 10;

    return {
      change: `${roundedChange > 0 ? "+" : ""}${roundedChange}%`,
      changeType: roundedChange >= 0 ? ("positive" as const) : ("negative" as const),
    };
  }, [monthlyStreamsData, now]);

  const stats = [
    {
      title: "Total Listeners",
      value: totalListeners.toLocaleString(),
      change: listenersGrowth.change,
      changeType: listenersGrowth.changeType,
      icon: UserCheck,
      isLoading: listenersLoading,
    },
    {
      title: "Total Artists",
      value: totalArtists.toLocaleString(),
      change: artistsGrowth.change,
      changeType: artistsGrowth.changeType,
      icon: Users,
      isLoading: artistsLoading,
    },
    {
      title: "Total Tracks",
      value: totalTracks.toLocaleString(),
      change: tracksGrowth.change,
      changeType: tracksGrowth.changeType,
      icon: Music,
      isLoading: tracksLoading,
    },
    {
      title: "Total Streams (Monthly)",
      value: monthlyStreams.toLocaleString(),
      change: streamGrowth.change,
      changeType: streamGrowth.changeType,
      icon: Radio,
      isLoading: monthlyStreamsLoading,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        stat.isLoading ? (
          <Skeleton key={stat.title} className="h-32 w-full" />
        ) : (
          <StatsCard key={stat.title} {...stat} delay={index * 100} />
        )
      ))}
    </div>
  );
}
