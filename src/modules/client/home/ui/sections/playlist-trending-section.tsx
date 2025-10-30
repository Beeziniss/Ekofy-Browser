"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { playlistsHomeOptions } from "@/gql/options/client-options";
import PlaylistCarousel from "@/modules/client/common/ui/components/playlist/playlist-carousel";

const PlaylistTrendingSection = () => {
  return (
    <Suspense fallback={<PlaylistTrendingSkeleton />}>
      <PlaylistTrendingSectionSuspense />
    </Suspense>
  );
};

const PlaylistTrendingSkeleton = () => {
  return <PlaylistCarousel data={{}} isLoading />;
};

const PlaylistTrendingSectionSuspense = () => {
  const { data, isPending } = useSuspenseQuery(playlistsHomeOptions);

  return <PlaylistCarousel data={data} isLoading={isPending} />;
};

export default PlaylistTrendingSection;
