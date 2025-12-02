"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trackInsightFavoriteCountOptions, trackInsightFavCountOptions } from "@/gql/options/artist-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TrackInsightFavoritesChartSectionProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
}

const TrackInsightFavoritesChartSection = ({
  trackId,
  timeRange,
  dateFrom,
  dateTo,
}: TrackInsightFavoritesChartSectionProps) => {
  return (
    <Suspense fallback={<TrackInsightFavoritesChartSkeleton />}>
      <TrackInsightFavoritesChartSectionSuspense
        trackId={trackId}
        timeRange={timeRange}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />
    </Suspense>
  );
};

const TrackInsightFavoritesChartSkeleton = () => {
  return <Skeleton className="h-[400px] w-full rounded-lg" />;
};

interface TrackInsightFavoritesChartSectionSuspenseProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
}

const TrackInsightFavoritesChartSectionSuspense = ({
  trackId,
  timeRange,
  dateFrom,
  dateTo,
}: TrackInsightFavoritesChartSectionSuspenseProps) => {
  // First get the total count
  const { data: totalCountData } = useSuspenseQuery(
    trackInsightFavCountOptions(trackId, dateFrom || undefined, dateTo || undefined),
  );

  // Then get the detailed favorite count data
  const { data: favoriteData } = useSuspenseQuery(
    trackInsightFavoriteCountOptions(
      trackId,
      dateFrom || undefined,
      dateTo || undefined,
      totalCountData.userEngagement?.totalCount,
    ),
  );

  const generateFavoritesChartData = () => {
    const days = getDaysInRange(timeRange);
    const favoritesByDate = favoriteData?.favoritesByDate || [];

    // Create a map for quick lookup
    const favoritesMap = new Map();
    favoritesByDate.forEach((item) => {
      favoritesMap.set(item.date, item.count);
    });

    // Generate data for each day in the range
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));

      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const displayDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      return {
        date: displayDate,
        favorites: favoritesMap.get(dateKey) || 0,
      };
    });
  };

  const getDaysInRange = (timeRange: string) => {
    switch (timeRange) {
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

  const chartData = generateFavoritesChartData();
  const totalFavorites = totalCountData?.userEngagement?.totalCount || 0;

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      dataKey: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-main-dark-grey rounded-lg border border-gray-600 p-3 shadow-lg">
          <p className="text-main-white font-medium">{label}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
              {`Favorites: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-main-dark-grey rounded-lg border border-gray-700 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-main-white text-xl font-semibold">Favorites Over Time</h3>
        <div className="text-main-white text-sm">
          <span className="text-main-grey-dark-1">Total: </span>
          <span className="font-semibold text-pink-400">{totalFavorites.toLocaleString()}</span>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#F3F4F6" }} />
            <Line
              type="monotone"
              dataKey="favorites"
              stroke="#EC4899"
              strokeWidth={2}
              dot={{ fill: "#EC4899", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#EC4899", strokeWidth: 2 }}
              name="Favorites"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-main-grey mt-4 text-sm">
        <p>* Daily favorite data shows when users liked your track over time.</p>
      </div>
    </div>
  );
};

export default TrackInsightFavoritesChartSection;
