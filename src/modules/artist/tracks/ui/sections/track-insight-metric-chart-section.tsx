"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trackDailyMetricsOptions } from "@/gql/options/artist-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type MetricType = "streams" | "favorites" | "comments" | "downloads";

interface TrackInsightMetricChartSectionProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
  selectedMetric: MetricType;
}

const TrackInsightMetricChartSection = ({
  trackId,
  timeRange,
  dateFrom,
  dateTo,
  selectedMetric
}: TrackInsightMetricChartSectionProps) => {
  return (
    <Suspense fallback={<TrackInsightMetricChartSkeleton />}>
      <TrackInsightMetricChartSectionSuspense
        trackId={trackId}
        timeRange={timeRange}
        dateFrom={dateFrom}
        dateTo={dateTo}
        selectedMetric={selectedMetric}
      />
    </Suspense>
  );
};

const TrackInsightMetricChartSkeleton = () => {
  return <Skeleton className="h-[400px] w-full rounded-lg" />;
};

interface TrackInsightMetricChartSectionSuspenseProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
  selectedMetric: MetricType;
}

const TrackInsightMetricChartSectionSuspense = ({
  trackId,
  timeRange,
  selectedMetric,
}: TrackInsightMetricChartSectionSuspenseProps) => {
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

  const metricConfig: Record<MetricType, {
    title: string;
    dataKey: string;
    label: string;
    totalLabel: string;
    color: string;
  }> = {
    streams: {
      title: "Streams Over Time",
      dataKey: "streams",
      label: "Streams",
      totalLabel: "Total Streams",
      color: "#8B5CF6",
    },
    favorites: {
      title: "Favorites Over Time",
      dataKey: "favorites",
      label: "Favorites",
      totalLabel: "Total Favorites",
      color: "#EC4899",
    },
    comments: {
      title: "Comments Over Time",
      dataKey: "comments",
      label: "Comments",
      totalLabel: "Total Comments",
      color: "#3B82F6",
    },
    downloads: {
      title: "Downloads Over Time",
      dataKey: "downloads",
      label: "Downloads",
      totalLabel: "Total Downloads",
      color: "#10B981",
    },
  };

  const config = metricConfig[selectedMetric];

  // Chart configuration for the UI Chart component
  const chartConfig = {
    [config.dataKey]: {
      label: config.label,
      color: config.color,
    },
  } satisfies ChartConfig;

  const generateChartData = () => {
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

      let value = 0;
      switch (selectedMetric) {
        case "streams":
          value = Number(metric.streamCount);
          break;
        case "favorites":
          value = Number(metric.favoriteCount);
          break;
        case "comments":
          value = Number(metric.commentCount);
          break;
        case "downloads":
          value = Number(metric.downloadCount);
          break;
      }

      return {
        date: displayDate,
        [config.dataKey]: value,
      };
    });
  };

  const chartData = generateChartData();

  const totalValue = metricsData?.items?.reduce((sum: number, metric) => {
    switch (selectedMetric) {
      case "streams":
        return sum + Number(metric.streamCount);
      case "favorites":
        return sum + Number(metric.favoriteCount);
      case "comments":
        return sum + Number(metric.commentCount);
      case "downloads":
        return sum + Number(metric.downloadCount);
      default:
        return sum;
    }
  }, 0) || 0;


  return (
    <div className="bg-main-dark-grey rounded-lg border border-gray-700 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-main-white text-xl font-semibold">{config.title}</h3>
        <div className="text-main-white text-sm">
          <span className="text-main-grey-dark-1">{config.totalLabel}: </span>
          <span className="font-semibold" style={{ color: config.color }}>{totalValue.toLocaleString()}</span>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-80 w-full">
        <LineChart accessibilityLayer data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={config.color} />
          <XAxis
            dataKey="date"
            // tickLine={false}
            tickMargin={10}
            // axisLine={false}
            tick={{ fill: "#9CA3AF" }}
            fontSize={12}
          />
          <YAxis
            // tickLine={false}
            // axisLine={false}
            tick={{ fill: "#9CA3AF" }}
            fontSize={12}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey={config.dataKey}
            stroke={config.color}
            strokeWidth={2}
            dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
            name={config.label}
          />
        </LineChart>
      </ChartContainer>

      <div className="text-main-grey mt-4 text-sm">
        <p>* Daily {config.label.toLowerCase()} data from track metrics.</p>
      </div>
    </div>
  );
};

export default TrackInsightMetricChartSection;

