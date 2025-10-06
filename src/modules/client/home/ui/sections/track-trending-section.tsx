"use client";

import { execute } from "@/gql/execute";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TrackListHomeQuery } from "../views/home-view";
import { Suspense } from "react";
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
  const { data, isPending } = useSuspenseQuery({
    queryKey: ["tracks-home"],
    queryFn: () => execute(TrackListHomeQuery, { take: 10 }),
  });

  return <TrackCarousel data={data} isLoading={isPending} />;
};

export default TrackTrendingSection;
