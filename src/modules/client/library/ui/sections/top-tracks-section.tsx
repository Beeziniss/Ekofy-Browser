"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { topTracksOptions } from "@/gql/options/client-options";
import TopTracksTable, { TopTrack } from "../components/top-tracks-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store";

const TopTracksSection = () => {
  return (
    <Suspense fallback={<TopTracksSectionSkeleton />}>
      <TopTracksSectionSuspense />
    </Suspense>
  );
};

const TopTracksSectionSkeleton = () => {
  return (
    <div className="w-full space-y-6 px-6 py-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex h-16 items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

const TopTracksSectionSuspense = () => {
  const { user } = useAuthStore();
  const { data } = useSuspenseQuery(topTracksOptions(user?.userId || ""));

  console.log(JSON.stringify(data, null, 2));

  if (!data?.topTracks?.items || data.topTracks.items.length === 0) {
    return (
      <div className="w-full px-6 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Top Tracks</h1>
            <p className="text-gray-400">The most popular tracks on the platform.</p>
          </div>
          <div className="space-y-4 py-16 text-center">
            <h2 className="text-xl font-semibold text-white">No tracks available</h2>
            <p className="text-gray-400">Check back later for popular tracks!</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform top tracks data to match TopTracksTable expected structure
  // The topTracks query returns an array of TopTrack objects, each with tracksInfo array
  const topTracksData: TopTrack[] = (data.topTracks.items || []).flatMap((topTrack) =>
    (topTrack?.tracksInfo || [])
      .filter(
        (trackInfo): trackInfo is NonNullable<typeof trackInfo> & { track: NonNullable<typeof trackInfo.track> } =>
          trackInfo !== null && trackInfo.track !== null,
      )
      .map((trackInfo) => ({
        id: trackInfo.track.id,
        name: trackInfo.track.name || "Unknown Track",
        coverImage: trackInfo.track.coverImage || "",
        artist:
          trackInfo.track.mainArtists?.items
            ?.map((artist) => artist?.stageName)
            .filter(Boolean)
            .join(", ") || "Unknown Artist",
        streamCount: trackInfo.track.streamCount || 0,
        checkTrackInFavorite: trackInfo.track.checkTrackInFavorite,
      })),
  );

  return (
    <div className="w-full">
      <div className="space-y-6">
        <p className="text-main-white text-2xl font-semibold">Top tracks for you</p>
        <TopTracksTable tracks={topTracksData} />
      </div>
    </div>
  );
};

export default TopTracksSection;
