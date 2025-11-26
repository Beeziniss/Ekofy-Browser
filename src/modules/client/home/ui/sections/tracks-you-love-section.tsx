"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trackFavoriteOptions } from "@/gql/options/client-options";
import TrackCarousel from "@/modules/client/common/ui/components/track/track-carousel";

const TracksYouLoveSection = () => {
  return (
    <Suspense fallback={<TracksYouLoveSkeleton />}>
      <TracksYouLoveSectionSuspense />
    </Suspense>
  );
};

const TracksYouLoveSkeleton = () => {
  return (
    <div className="w-full space-y-6 px-4">
      <div className="text-2xl font-semibold">Tracks you love</div>
      <TrackCarousel data={{}} isLoading />
    </div>
  );
};

const TracksYouLoveSectionSuspense = () => {
  const { data, isPending } = useSuspenseQuery(trackFavoriteOptions(12));

  // Transform favorite tracks data to match TrackCarousel expected structure
  const transformedData = data?.favoriteTracks
    ? {
        tracks: {
          items: data.favoriteTracks.items,
          totalCount: data.favoriteTracks.totalCount,
        },
      }
    : {};

  return (
    <div className="w-full space-y-6 px-4">
      <div className="text-2xl font-semibold">Tracks you love</div>
      <TrackCarousel data={transformedData} isLoading={isPending} />
    </div>
  );
};

export default TracksYouLoveSection;
