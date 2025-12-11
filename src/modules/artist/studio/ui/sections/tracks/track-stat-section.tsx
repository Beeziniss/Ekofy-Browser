"use client";

import { ActivityIcon, DownloadIcon, HeartIcon, MessageSquareTextIcon } from "lucide-react";
import TrackStatCard from "../../components/track-stat-card";
import { useQuery } from "@tanstack/react-query";
import { artistTrackListStatsOptions, artistTrackDailyMetricsOptions } from "@/gql/options/artist-activity-options";
import { useAuthStore } from "@/store";
import { useMemo } from "react";

const TrackStatSection = () => {
  const { user } = useAuthStore();
  
  // Fetch artist tracks to get track IDs
  const { data: trackStatsData } = useQuery({
    ...artistTrackListStatsOptions({ artistId: user?.userId || "" }),
    enabled: !!user?.userId,
  });
  
  // Extract track IDs
  const trackIds = useMemo(() => {
    return trackStatsData?.tracks?.items?.map(track => track.id).filter(Boolean) || [];
  }, [trackStatsData]);
  
  // Fetch daily metrics for all tracks
  const { data: metricsData } = useQuery({
    ...artistTrackDailyMetricsOptions({ trackIds }),
    enabled: trackIds.length > 0,
  });
  
  // Calculate total stats
  const totalStats = useMemo(() => {
    const metrics = metricsData?.trackDailyMetrics?.items || [];
    
    return metrics.reduce(
      (acc, metric) => ({
        favoriteCount: acc.favoriteCount + (metric.favoriteCount || 0),
        commentCount: acc.commentCount + (metric.commentCount || 0),
        downloadCount: acc.downloadCount + (metric.downloadCount || 0),
        streamCount: acc.streamCount + (metric.streamCount || 0),
      }),
      { favoriteCount: 0, commentCount: 0, downloadCount: 0, streamCount: 0 }
    );
  }, [metricsData]);
  
  const trackStats = [
    {
      title: "Likes",
      value: totalStats.favoriteCount,
      icon: HeartIcon,
    },
    {
      title: "Comments",
      value: totalStats.commentCount,
      icon: MessageSquareTextIcon,
    },
    {
      title: "Downloads",
      value: totalStats.downloadCount,
      icon: DownloadIcon,
    },
    {
      title: "Streams",
      value: totalStats.streamCount,
      icon: ActivityIcon,
    },
  ];

  return (
    <div className="rounded-md border border-white/30 p-8 pb-6">
      <div className="flex items-end gap-x-3">
        <h2 className="text-xl font-bold">Artist Tracks</h2>
        <span className="primary_gradient w-fit bg-clip-text text-sm text-transparent">Stats updated daily</span>
      </div>

      <div className="mt-12 flex items-center justify-between gap-8">
        {trackStats.map((stat) => (
          <TrackStatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default TrackStatSection;
