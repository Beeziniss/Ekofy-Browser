"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackInsightOptions } from "@/gql/options/artist-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Suspense } from "react";

interface TrackInsightInfoSectionProps {
  trackId: string;
}

const TrackInsightInfoSection = ({ trackId }: TrackInsightInfoSectionProps) => {
  return (
    <Suspense fallback={<TrackInsightInfoSkeleton />}>
      <TrackInsightInfoSectionSuspense trackId={trackId} />
    </Suspense>
  );
};

const TrackInsightInfoSkeleton = () => {
  return <div>Loading...</div>;
};

const TrackInsightInfoSectionSuspense = ({ trackId }: TrackInsightInfoSectionProps) => {
  const { data } = useSuspenseQuery(trackInsightOptions(trackId));

  const trackData = data?.tracks?.items?.[0];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-main-white text-2xl font-bold">Track Insights</h1>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Last 7 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7-days">Last 7 days</SelectItem>
            <SelectItem value="last-30-days">Last 30 days</SelectItem>
            <SelectItem value="last-90-days">Last 90 days</SelectItem>
            <SelectItem value="last-365-days">Last 365 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end gap-x-6">
        <Image
          src={trackData?.coverImage || "https://placehold.co/80"}
          alt={trackData?.name || "Track Cover"}
          width={80}
          height={80}
          className="rounded-md object-cover"
          unoptimized
        />

        <div className="flex flex-col gap-y-1">
          <p className="text-main-white line-clamp-1 text-2xl font-semibold">{trackData?.name}</p>
          <p className="text-main-grey text-xs">
            {Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
              new Date(trackData?.releaseInfo?.releaseDate),
            )}
          </p>
        </div>
      </div>

      <div className="text-main-white text-center text-3xl font-semibold">
        This track got {trackData?.streamCount || 0} streams in the last 7 days
      </div>
    </div>
  );
};

export default TrackInsightInfoSection;
