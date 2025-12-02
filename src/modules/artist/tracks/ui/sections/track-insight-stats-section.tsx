"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { Eye, Heart, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { trackInsightFavCountOptions, trackInsightOptions } from "@/gql/options/artist-options";

interface TrackInsightStatsSectionProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
}

const TrackInsightStatsSection = ({ trackId, timeRange, dateFrom, dateTo }: TrackInsightStatsSectionProps) => {
  return (
    <Suspense fallback={<TrackInsightStatsSkeleton />}>
      <TrackInsightStatsSectionSuspense trackId={trackId} timeRange={timeRange} dateFrom={dateFrom} dateTo={dateTo} />
    </Suspense>
  );
};

const TrackInsightStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
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
}

const TrackInsightStatsSectionSuspense = ({ trackId, dateFrom, dateTo }: TrackInsightStatsSectionSuspenseProps) => {
  // Get the total count first using trackInsightFavCountOptions
  const { data: totalCountData } = useSuspenseQuery(
    trackInsightFavCountOptions(trackId, dateFrom || undefined, dateTo || undefined),
  );

  // Get track basic info for stream count
  const { data: trackData } = useSuspenseQuery(trackInsightOptions(trackId));

  const track = trackData?.tracks?.items?.[0];
  const totalFavorites = totalCountData?.userEngagement?.totalCount || 0;

  const stats = [
    {
      title: "Stream Count",
      value: track?.streamCount || 0,
      icon: Eye,
      trend: "+12%",
      trendPositive: true,
    },
    {
      title: "Favorite Count",
      value: totalFavorites,
      icon: Heart,
      trend: "+8%",
      trendPositive: true,
    },
    {
      title: "Payouts",
      value: "Coming Soon",
      icon: DollarSign,
      trend: "N/A",
      trendPositive: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-main-dark-grey rounded-lg border border-gray-700 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-main-purple/10 rounded-lg p-2">
                <stat.icon className="text-main-purple h-5 w-5" />
              </div>
              <h3 className="text-main-white text-sm font-medium">{stat.title}</h3>
            </div>
            {stat.trendPositive !== null && (
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  stat.trendPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                }`}
              >
                {stat.trend}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-main-white text-2xl font-bold">
              {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
            </p>
            <p className="text-main-grey text-xs">
              {stat.title === "Payouts" ? "Feature in development" : "Total accumulated"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackInsightStatsSection;
