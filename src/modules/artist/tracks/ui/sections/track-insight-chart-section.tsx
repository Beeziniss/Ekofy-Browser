"use client";

import TrackInsightFavoritesChartSection from "./track-insight-favorites-chart-section";
import TrackInsightStreamsPayoutsChartSection from "./track-insight-streams-payouts-chart-section";

interface TrackInsightChartSectionProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
}

const TrackInsightChartSection = ({ trackId, timeRange, dateFrom, dateTo }: TrackInsightChartSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Favorites Chart - Daily/Monthly Data */}
      <TrackInsightFavoritesChartSection trackId={trackId} timeRange={timeRange} dateFrom={dateFrom} dateTo={dateTo} />

      {/* Streams & Payouts Chart - Monthly Data Only */}
      <TrackInsightStreamsPayoutsChartSection
        trackId={trackId}
        timeRange={timeRange}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />
    </div>
  );
};

export default TrackInsightChartSection;
