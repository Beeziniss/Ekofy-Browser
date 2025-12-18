"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trackDailyMetricsOptions } from "@/gql/options/artist-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DollarSign } from "lucide-react";

interface TrackInsightPayoutsChartSectionProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
}

const TrackInsightPayoutsChartSection = ({
  trackId,
  timeRange,
  dateFrom,
  dateTo
}: TrackInsightPayoutsChartSectionProps) => {
  return (
    <Suspense fallback={<TrackInsightPayoutsChartSkeleton />}>
      <TrackInsightPayoutsChartSectionSuspense
        trackId={trackId}
        timeRange={timeRange}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />
    </Suspense>
  );
};

const TrackInsightPayoutsChartSkeleton = () => {
  return <Skeleton className="h-[400px] w-full rounded-lg" />;
};

interface TrackInsightPayoutsChartSectionSuspenseProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
}

const TrackInsightPayoutsChartSectionSuspense = ({
  trackId,
  timeRange,
}: TrackInsightPayoutsChartSectionSuspenseProps) => {
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

  const generatePayoutsChartData = () => {
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

      // Payouts are calculated based on streams (placeholder calculation)
      const payoutsPerStream = 0.003; // Example: $0.003 per stream
      const payouts = Math.round(streams * payoutsPerStream * 100) / 100; // Round to 2 decimal places

      return {
        date: displayDate,
        payouts,
      };
    });
  };

  const chartData = generatePayoutsChartData();

  const totalPayouts = chartData.reduce((sum, item) => sum + item.payouts, 0);

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
              {`Payouts: $${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Payouts Stats Card */}
      <div className="bg-main-dark-grey rounded-lg border border-gray-700 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 rounded-lg p-2">
              <DollarSign className="text-emerald-500 h-5 w-5" />
            </div>
            <h3 className="text-main-white text-sm font-medium">Payouts</h3>
          </div>
          <span className="bg-yellow-500/10 text-yellow-500 rounded-full px-2 py-1 text-xs">
            Coming Soon
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-main-white text-2xl font-bold">
            ${totalPayouts.toFixed(2)}
          </p>
          <p className="text-main-grey text-xs">
            Estimated based on $0.003 per stream
          </p>
        </div>
      </div>

      {/* Payouts Chart */}
      <div className="bg-main-dark-grey rounded-lg border border-gray-700 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-main-white text-xl font-semibold">Payouts Over Time</h3>
          <div className="text-main-white text-sm">
            <span className="text-main-grey-dark-1">Total: </span>
            <span className="font-semibold text-emerald-400">${totalPayouts.toFixed(2)}</span>
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
          <p>* Estimated payouts based on stream count. Actual payouts feature is currently under development.</p>
        </div>
      </div>
    </div>
  );
};

export default TrackInsightPayoutsChartSection;

