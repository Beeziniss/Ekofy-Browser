"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Music, UserCheck, Radio, Download, Heart, MessageCircle } from "lucide-react";
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
  
  // Calculate totals by summing up counts from all items
  const monthlyStreams = useMemo(() => {
    if (!monthlyStreamsData?.items) return 0;
    return monthlyStreamsData.items.reduce((total, item) => total + (item.streamCount || 0), 0);
  }, [monthlyStreamsData]);

  const monthlyDownloads = useMemo(() => {
    if (!monthlyStreamsData?.items) return 0;
    return monthlyStreamsData.items.reduce((total, item) => total + (item.downloadCount || 0), 0);
  }, [monthlyStreamsData]);

  const monthlyFavorites = useMemo(() => {
    if (!monthlyStreamsData?.items) return 0;
    return monthlyStreamsData.items.reduce((total, item) => total + (item.favoriteCount || 0), 0);
  }, [monthlyStreamsData]);

  const monthlyComments = useMemo(() => {
    if (!monthlyStreamsData?.items) return 0;
    return monthlyStreamsData.items.reduce((total, item) => total + (item.commentCount || 0), 0);
  }, [monthlyStreamsData]);


  const stats = [
    {
      title: "Total Listeners",
      value: totalListeners.toLocaleString(),
      icon: UserCheck,
      isLoading: listenersLoading,
    },
    {
      title: "Total Artists",
      value: totalArtists.toLocaleString(),
      icon: Users,
      isLoading: artistsLoading,
    },
    {
      title: "Total Tracks",
      value: totalTracks.toLocaleString(),
      icon: Music,
      isLoading: tracksLoading,
    },
    {
      title: "Total Streams (Monthly)",
      value: monthlyStreams.toLocaleString(),
      icon: Radio,
      isLoading: monthlyStreamsLoading,
    },
    {
      title: "Total Downloads (Monthly)",
      value: monthlyDownloads.toLocaleString(),
      icon: Download,
      isLoading: monthlyStreamsLoading,
    },
    {
      title: "Total Favorites (Monthly)",
      value: monthlyFavorites.toLocaleString(),
      icon: Heart,
      isLoading: monthlyStreamsLoading,
    },
    {
      title: "Total Comments (Monthly)",
      value: monthlyComments.toLocaleString(),
      icon: MessageCircle,
      isLoading: monthlyStreamsLoading,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
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