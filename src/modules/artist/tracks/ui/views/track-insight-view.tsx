"use client";

import { graphql } from "@/gql";
import { ArrowLeftIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import TrackInsightInfoSection from "../sections/track-insight-info-section";
import TrackInsightChartSection from "../sections/track-insight-chart-section";
import TrackInsightStatsSection from "../sections/track-insight-stats-section";

interface TrackInsightViewProps {
  trackId: string;
}

export const TrackInsightViewQuery = graphql(`
  query TrackInsightView($trackId: String!) {
    tracks(where: { id: { eq: $trackId } }) {
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

      <TrackInsightInfoSection trackId={trackId} timeRange={timeRange} dateFrom={dateFrom} dateTo={dateTo} />

      <TrackInsightStatsSection trackId={trackId} timeRange={timeRange} dateFrom={dateFrom} dateTo={dateTo} />

      <TrackInsightChartSection trackId={trackId} timeRange={timeRange} dateFrom={dateFrom} dateTo={dateTo} />
    </div>
  );
};

export default TrackInsightView;
