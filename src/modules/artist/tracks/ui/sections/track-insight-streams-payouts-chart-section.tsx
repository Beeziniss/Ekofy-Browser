"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trackInsightOptions } from "@/gql/options/artist-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TrackInsightStreamsPayoutsChartSectionProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
}

const TrackInsightStreamsPayoutsChartSection = ({
  trackId,
  timeRange,
  dateFrom,
  dateTo,
}: TrackInsightStreamsPayoutsChartSectionProps) => {
  return (
    <Suspense fallback={<TrackInsightStreamsPayoutsChartSkeleton />}>
      <TrackInsightStreamsPayoutsChartSectionSuspense
        trackId={trackId}
        timeRange={timeRange}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />
    </Suspense>
  );
};

const TrackInsightStreamsPayoutsChartSkeleton = () => {
  return <Skeleton className="h-[400px] w-full rounded-lg" />;
};

interface TrackInsightStreamsPayoutsChartSectionSuspenseProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
}

const TrackInsightStreamsPayoutsChartSectionSuspense = ({
  trackId,
  timeRange,
}: TrackInsightStreamsPayoutsChartSectionSuspenseProps) => {
  const { data } = useSuspenseQuery(trackInsightOptions(trackId));

  const generateStreamsPayoutsChartData = () => {
    const trackData = data?.tracks?.items?.[0];
    const baseStreamCount = trackData?.streamCount || 100;

    // For streams and payouts, we show monthly data only
    const months = getMonthsInRange(timeRange);

    return Array.from({ length: months }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - 1 - i));

      const displayDate = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      // Generate realistic stream variations (monthly aggregated data)
      const streamVariation = Math.sin(i / 2) * 500 + Math.random() * 1000 - 500;
      const streams = Math.max(0, Math.floor(baseStreamCount / months + streamVariation));

      // Payouts are calculated based on streams (placeholder calculation)
      const payoutsPerStream = 0.003; // Example: $0.003 per stream
      const payouts = Math.round(streams * payoutsPerStream * 100) / 100; // Round to 2 decimal places

      return {
        date: displayDate,
        streams,
        payouts,
      };
    });
  };

  const getMonthsInRange = (timeRange: string) => {
    switch (timeRange) {
      case "last-7-days":
        return 1; // Show current month for short ranges
      case "last-30-days":
        return 1; // Show current month
      case "last-90-days":
        return 3; // Show last 3 months
      case "last-365-days":
        return 12; // Show last 12 months
      default:
        return 1;
    }
  };

  const chartData = generateStreamsPayoutsChartData();

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
              {entry.dataKey === "streams"
                ? `Streams: ${entry.value.toLocaleString()}`
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
      <h3 className="text-main-white mb-6 text-xl font-semibold">Streams & Payouts (Monthly)</h3>

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
        <p>* Stream data is aggregated monthly. Payouts feature is currently under development.</p>
      </div>
    </div>
  );
};

export default TrackInsightStreamsPayoutsChartSection;
