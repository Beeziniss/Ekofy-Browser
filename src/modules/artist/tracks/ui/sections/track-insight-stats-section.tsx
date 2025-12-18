"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { Eye, Heart, MessageCircle, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { trackDailyMetricsOptions } from "@/gql/options/artist-options";

export type MetricType = "streams" | "favorites" | "comments" | "downloads";

interface TrackInsightStatsSectionProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
  selectedMetric: MetricType;
  onSelectMetric: (metric: MetricType) => void;
}

const TrackInsightStatsSection = ({
  trackId,
  timeRange,
  dateFrom,
  dateTo,
  selectedMetric,
  onSelectMetric
}: TrackInsightStatsSectionProps) => {
  return (
    <Suspense fallback={<TrackInsightStatsSkeleton />}>
      <TrackInsightStatsSectionSuspense
        trackId={trackId}
        timeRange={timeRange}
        dateFrom={dateFrom}
        dateTo={dateTo}
        selectedMetric={selectedMetric}
        onSelectMetric={onSelectMetric}
      />
    </Suspense>
  );
};

const TrackInsightStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-40 w-full rounded-lg" />
      ))}
    </div>
  );
};

interface TrackInsightStatsSectionSuspenseProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
  selectedMetric: MetricType;
  onSelectMetric: (metric: MetricType) => void;
}

const TrackInsightStatsSectionSuspense = ({
  trackId,
  timeRange,
  selectedMetric,
  onSelectMetric
}: TrackInsightStatsSectionSuspenseProps) => {
  // Get the take value based on time range
  const getDaysCount = (range: string) => {
    switch (range) {
      case "last-7-days":
        return 7;
      case "last-30-days":
        return 30;
      case "last-90-days":
        return 90;
      case "last-365-days":
        return 365;
      default:
        return 7;
    }
  };

  const daysCount = getDaysCount(timeRange);

  // Fetch track daily metrics for the selected time range
  const { data: metricsData } = useSuspenseQuery(trackDailyMetricsOptions(trackId, 0, daysCount));

  // Calculate totals from daily metrics
  const totalStreams = metricsData?.items?.reduce((sum: number, metric) => sum + Number(metric.streamCount), 0) || 0;
  const totalFavorites = metricsData?.items?.reduce((sum: number, metric) => sum + Number(metric.favoriteCount), 0) || 0;
  const totalComments = metricsData?.items?.reduce((sum: number, metric) => sum + Number(metric.commentCount), 0) || 0;
  const totalDownloads = metricsData?.items?.reduce((sum: number, metric) => sum + Number(metric.downloadCount), 0) || 0;

  const stats = [
    {
      id: "streams" as MetricType,
      title: "Stream Count",
      value: totalStreams,
      icon: Eye,
      color: "purple",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      iconColor: "text-purple-500",
      borderColor: "border-purple-500",
      hoverBorder: "hover:border-purple-500/50",
      shadowColor: "shadow-purple-500/20",
    },
    {
      id: "favorites" as MetricType,
      title: "Favorite Count",
      value: totalFavorites,
      icon: Heart,
      color: "pink",
      bgColor: "bg-pink-500/10",
      textColor: "text-pink-400",
      iconColor: "text-pink-500",
      borderColor: "border-pink-500",
      hoverBorder: "hover:border-pink-500/50",
      shadowColor: "shadow-pink-500/20",
    },
    {
      id: "comments" as MetricType,
      title: "Comment Count",
      value: totalComments,
      icon: MessageCircle,
      color: "blue",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500",
      hoverBorder: "hover:border-blue-500/50",
      shadowColor: "shadow-blue-500/20",
    },
    {
      id: "downloads" as MetricType,
      title: "Download Count",
      value: totalDownloads,
      icon: Download,
      color: "green",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
      iconColor: "text-green-500",
      borderColor: "border-green-500",
      hoverBorder: "hover:border-green-500/50",
      shadowColor: "shadow-green-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          onClick={() => onSelectMetric(stat.id)}
          className={`bg-main-dark-grey rounded-lg border p-6 text-left transition-all cursor-pointer ${stat.hoverBorder} ${
            selectedMetric === stat.id
              ? `${stat.borderColor} shadow-lg ${stat.shadowColor}`
              : "border-gray-700"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${stat.bgColor} rounded-lg p-2`}>
                <stat.icon className={`${stat.iconColor} h-5 w-5`} />
              </div>
              <h3 className="text-main-white text-sm font-medium">{stat.title}</h3>
            </div>
            {selectedMetric === stat.id && (
              <div className={`${stat.textColor} rounded-full bg-gray-800 px-2 py-1 text-xs font-semibold`}>
                Active
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className={`text-2xl font-bold ${selectedMetric === stat.id ? stat.textColor : "text-main-white"}`}>
              {stat.value.toLocaleString()}
            </p>
            <p className="text-main-grey text-xs">
              Click to view chart
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackInsightStatsSection;

