"use client";

import Link from "next/link";
import { graphql } from "@/gql";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { ArrowLeftIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import TrackInsightInfoSection from "../sections/track-insight-info-section";
import TrackInsightStatsSection, { MetricType } from "../sections/track-insight-stats-section";
import TrackInsightMetricChartSection from "../sections/track-insight-metric-chart-section";
import TrackInsightPayoutsChartSection from "../sections/track-insight-payouts-chart-section";

interface TrackInsightViewProps {
  trackId: string;
}

export const TrackInsightViewQuery = graphql(`
  query TrackInsightView($trackId: String!) {
    tracks(where: { id: { eq: $trackId } }, take: 1) {
      items {
        id
        name
        coverImage
        releaseInfo {
          releaseDate
        }
        streamCount
        favoriteCount
      }
    }
  }
`);

const TrackInsightView = ({ trackId }: TrackInsightViewProps) => {
  const searchParams = useSearchParams();
  const timeRange = searchParams.get("timeRange") || "last-7-days";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  // State to track which metric is selected
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("streams");

  return (
    <div className="w-full space-y-6 px-4 py-8">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/artist/studio/tracks"
          className="text-main-white hover:text-main-purple group border-b-main-white hover:border-b-main-purple flex w-fit items-center gap-x-2 border-b text-sm"
        >
          <ArrowLeftIcon className="text-main-white group-hover:text-main-purple size-4" />
          Back to Tracks
        </Link>

        <Link href={`/artist/studio/tracks/detail/${trackId}`}>
          <Button variant="outline" size="sm">
            <SettingsIcon className="mr-2 size-4" />
            Edit Track
          </Button>
        </Link>
      </div>

      {/* Track Info & Time Range Selector */}
      <TrackInsightInfoSection trackId={trackId} timeRange={timeRange} dateFrom={dateFrom} dateTo={dateTo} />

      {/* Stats Cards - Upper Section (Streams, Favorites, Comments, Downloads) */}
      <TrackInsightStatsSection
        trackId={trackId}
        timeRange={timeRange}
        dateFrom={dateFrom}
        dateTo={dateTo}
        selectedMetric={selectedMetric}
        onSelectMetric={setSelectedMetric}
      />

      {/* Selected Metric Chart */}
      <TrackInsightMetricChartSection
        trackId={trackId}
        timeRange={timeRange}
        dateFrom={dateFrom}
        dateTo={dateTo}
        selectedMetric={selectedMetric}
      />

      {/* Payouts Section - Lower Section */}
      <TrackInsightPayoutsChartSection
        trackId={trackId}
        timeRange={timeRange}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />
    </div>
  );
};

export default TrackInsightView;


