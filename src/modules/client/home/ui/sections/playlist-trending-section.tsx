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
  return (
    <div className="w-full space-y-6 px-4">
      <div className="text-2xl font-semibold">Playlists you&apos;ll love</div>
      <PlaylistCarousel data={{}} isLoading />
    </div>
  );
};

const PlaylistTrendingSectionSuspense = () => {
  const { data, isPending } = useSuspenseQuery(playlistsHomeOptions);

  return (
    <div className="w-full space-y-6 px-4">
      <div className="text-2xl font-semibold">Playlists you&apos;ll love</div>
      <PlaylistCarousel data={data} isLoading={isPending} />
    </div>
  );
};

export default PlaylistTrendingSection;
