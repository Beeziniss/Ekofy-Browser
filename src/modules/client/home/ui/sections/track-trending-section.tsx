"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trackListHomeOptions } from "@/gql/options/client-options";
import TrackCarousel from "@/modules/client/common/ui/components/track/track-carousel";

const TrackTrendingSection = () => {
  return (
    <Suspense fallback={<TrackTrendingSkeleton />}>
      <TrackTrendingSectionSuspense />
    </Suspense>
  );
};

const TrackTrendingSkeleton = () => {
  return (
    <div className="w-full space-y-6 px-4">
      <div className="text-xl font-semibold">Trending Tracks</div>
      <TrackCarousel data={{}} isLoading />
    </div>
  );
};

const TrackTrendingSectionSuspense = () => {
  const { data, isPending } = useSuspenseQuery(trackListHomeOptions);

  return (
    <div className="w-full space-y-6 px-4">
      <div className="text-xl font-semibold">Trending Tracks</div>
      <TrackCarousel data={data} isLoading={isPending} />
    </div>
  );
};

export default TrackTrendingSection;
