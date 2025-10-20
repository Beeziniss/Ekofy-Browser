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
  return <TrackCarousel data={{}} isLoading />;
};

const TrackTrendingSectionSuspense = () => {
  const { data, isPending } = useSuspenseQuery(trackListHomeOptions);

  return <TrackCarousel data={data} isLoading={isPending} />;
};

export default TrackTrendingSection;
