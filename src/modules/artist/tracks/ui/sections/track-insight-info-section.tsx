"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackDailyMetricsOptions, trackInsightOptions } from "@/gql/options/artist-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackInsightInfoSectionProps {
  trackId: string;
  timeRange: string;
  dateFrom: string | null;
  dateTo: string | null;
}

const TrackInsightInfoSection = ({ trackId, timeRange }: TrackInsightInfoSectionProps) => {
  return (
    <Suspense fallback={<TrackInsightInfoSkeleton />}>
      <TrackInsightInfoSectionSuspense trackId={trackId} timeRange={timeRange} />
    </Suspense>
  );
};

const TrackInsightInfoSkeleton = () => {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-main-white text-2xl font-bold">Track Insights</h1>

        <Select value={"last-7-days"}>
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
        <Skeleton className="h-20 w-20 rounded-md" />

        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-8 w-48 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
      </div>

      <div className="text-main-white text-center font-semibold">
        <Skeleton className="mx-auto h-9 w-1/2 rounded-md" />
      </div>
    </div>
  );
};

interface TrackInsightInfoSectionSuspenseProps {
  trackId: string;
  timeRange: string;
}

const TrackInsightInfoSectionSuspense = ({ trackId, timeRange }: TrackInsightInfoSectionSuspenseProps) => {
  const { data } = useSuspenseQuery(trackInsightOptions(trackId));
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const trackData = data?.tracks?.items?.[0];

  // Calculate total streams from daily metrics
  const totalStreams = metricsData?.items?.reduce((sum, metric) => sum + Number(metric.streamCount), 0) || 0;

  const handleTimeRangeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("timeRange", value);

    // Calculate date ranges based on selection
    const now = new Date();
    let dateFrom: Date;

    switch (value) {
      case "last-7-days":
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "last-30-days":
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "last-90-days":
        dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "last-365-days":
        dateFrom = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    params.set("dateFrom", dateFrom.toISOString().split("T")[0]);
    params.set("dateTo", now.toISOString().split("T")[0]);

    router.push(`?${params.toString()}`);
  };

  const getTimeRangeNumber = (timeRange: string) => {
    switch (timeRange) {
      case "last-7-days":
        return "7";
      case "last-30-days":
        return "30";
      case "last-90-days":
        return "90";
      case "last-365-days":
        return "365";
      default:
        return "7";
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-main-white text-2xl font-bold">Track Insights</h1>

        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
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
        This track got {totalStreams.toLocaleString()} streams in the last {getTimeRangeNumber(timeRange)} days
      </div>
    </div>
  );
};

export default TrackInsightInfoSection;
