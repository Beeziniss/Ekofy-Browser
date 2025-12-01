"use client";

import { trackInsightAnalyticsOptions } from "@/gql/options/artist-options";
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
  return (
    <div className="bg-main-dark-grey rounded-lg p-6">
      <div className="mb-6 h-6 w-1/3 animate-pulse rounded bg-gray-600"></div>
      <div className="h-64 animate-pulse rounded bg-gray-600"></div>
    </div>
  );
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
  dateFrom,
  dateTo,
}: TrackInsightChartSectionSuspenseProps) => {
  const { data } = useSuspenseQuery(trackInsightAnalyticsOptions(trackId, dateFrom || undefined, dateTo || undefined));

  // Generate mock time-series data based on time range
  const generateChartData = () => {
    const days = getDaysInRange(timeRange);
    const trackData = data?.userEngagement?.items?.[0]?.tracks?.items?.[0];
    const baseStreamCount = trackData?.streamCount || 100;
    const baseFavoriteCount = trackData?.favoriteCount || 50;

    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));

      // Generate realistic variations
      const streamVariation = Math.sin(i / 2) * 20 + Math.random() * 40 - 20;
      const favoriteVariation = Math.sin(i / 3) * 10 + Math.random() * 20 - 10;

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        streams: Math.max(0, Math.floor(baseStreamCount / days + streamVariation)),
        favorites: Math.max(0, Math.floor(baseFavoriteCount / days + favoriteVariation)),
        payouts: 0, // Placeholder for future implementation
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

  const chartData = generateChartData();

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
              {`${
                entry.dataKey === "streams" ? "Streams" : entry.dataKey === "favorites" ? "Favorites" : "Payouts"
              }: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-main-dark-grey rounded-lg border border-gray-700 p-6">
      <h3 className="text-main-white mb-6 text-xl font-semibold">Analytics Over Time</h3>

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
              dataKey="streams"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
              name="Streams"
            />
            <Line
              type="monotone"
              dataKey="favorites"
              stroke="#EC4899"
              strokeWidth={2}
              dot={{ fill: "#EC4899", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#EC4899", strokeWidth: 2 }}
              name="Favorites"
            />
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
        <p>* Payouts feature is currently under development and will be available soon.</p>
      </div>
    </div>
  );
};

export default TrackInsightChartSection;
