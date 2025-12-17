"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trackDailyMetricsOptions } from "@/gql/options/artist-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TrackInsightChartSectionProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
}

const TrackInsightChartSection = ({ trackId, timeRange, dateFrom, dateTo }: TrackInsightChartSectionProps) => {
  return (
    <Suspense fallback={<TrackInsightChartSkeleton />}>
      <TrackInsightChartSectionSuspense trackId={trackId} timeRange={timeRange} dateFrom={dateFrom} dateTo={dateTo} />
    </Suspense>
  );
};

const TrackInsightChartSkeleton = () => {
  return <Skeleton className="h-[500px] w-full rounded-lg" />;
};

interface TrackInsightChartSectionSuspenseProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
}

const TrackInsightChartSectionSuspense = ({
  trackId,
  timeRange,
}: TrackInsightChartSectionSuspenseProps) => {
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

  const generateCombinedChartData = () => {
    if (!metricsData?.items || metricsData.items.length === 0) {
      return [];
    }

    // Sort by date (oldest first) for proper chart display
    const sortedMetrics = [...metricsData.items].reverse();

    return sortedMetrics.map((metric) => {
      const date = new Date(metric.createdAt);
      const displayDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const streams = Number(metric.streamCount);
      const favorites = Number(metric.favoriteCount);

      // Payouts are calculated based on streams (placeholder calculation)
      const payoutsPerStream = 0.003; // Example: $0.003 per stream
      const payouts = Math.round(streams * payoutsPerStream * 100) / 100; // Round to 2 decimal places

      return {
        date: displayDate,
        streams,
        favorites,
        payouts,
      };
    });
  };

  const chartData = generateCombinedChartData();

  // Calculate totals
  const totalStreams = metricsData?.items?.reduce((sum: number, metric) => sum + Number(metric.streamCount), 0) || 0;
  const totalFavorites = metricsData?.items?.reduce((sum: number, metric) => sum + Number(metric.favoriteCount), 0) || 0;

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      dataKey: string;
      value: number;
      color: string;
      name: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-main-dark-grey rounded-lg border border-gray-600 p-3 shadow-lg">
          <p className="text-main-white font-medium mb-2">{label}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === "streams"
                ? `Streams: ${entry.value.toLocaleString()}`
                : entry.dataKey === "favorites"
                  ? `Favorites: ${entry.value.toLocaleString()}`
                  : `Payouts: $${entry.value.toFixed(2)}`}
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
        <h3 className="text-main-white text-xl font-semibold">Track Metrics Over Time</h3>
        <div className="flex gap-4 text-sm">
          <div className="text-main-white">
            <span className="text-main-grey-dark-1">Total Streams: </span>
            <span className="font-semibold text-purple-400">{totalStreams.toLocaleString()}</span>
          </div>
          <div className="text-main-white">
            <span className="text-main-grey-dark-1">Total Favorites: </span>
            <span className="font-semibold text-pink-400">{totalFavorites.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#F3F4F6" }} />

            {/* Streams Line */}
            <Line
              type="monotone"
              dataKey="streams"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
              name="Streams"
            />

            {/* Favorites Line */}
            <Line
              type="monotone"
              dataKey="favorites"
              stroke="#EC4899"
              strokeWidth={2}
              dot={{ fill: "#EC4899", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#EC4899", strokeWidth: 2 }}
              name="Favorites"
            />

            {/* Payouts Line */}
            <Line
              type="monotone"
              dataKey="payouts"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
              name="Payouts (Coming Soon)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-main-grey mt-4 text-sm">
        <p>* Daily metrics showing streams, favorites, and calculated payouts. Payouts feature is currently under development.</p>
      </div>
    </div>
  );
};

export default TrackInsightChartSection;
