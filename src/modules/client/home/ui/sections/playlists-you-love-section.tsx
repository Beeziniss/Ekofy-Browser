"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { playlistsFavoriteOptions } from "@/gql/options/client-options";
import PlaylistCarousel from "@/modules/client/common/ui/components/playlist/playlist-carousel";
import { useAuthStore } from "@/store";

const PlaylistsYouLoveSection = () => {
  return (
    <Suspense fallback={<PlaylistsYouLoveSkeleton />}>
      <PlaylistsYouLoveSectionSuspense />
    </Suspense>
  );
};

const PlaylistsYouLoveSkeleton = () => {
  return (
    <div className="w-full space-y-6 px-4">
      <div className="text-xl font-semibold">Playlists you&apos;ll love</div>
      <PlaylistCarousel data={{}} isLoading />
    </div>
  );
};

const PlaylistsYouLoveSectionSuspense = () => {
  const { isAuthenticated } = useAuthStore();
  const { data, isPending } = useSuspenseQuery(playlistsFavoriteOptions(12, isAuthenticated));

  if (!isAuthenticated) {
    return null;
  }

  if (!data || data?.favoritePlaylists?.items?.length === 0) {
    return null;
  }

  // Transform favorite playlists data to match PlaylistCarousel expected structure
  const transformedData = data?.favoritePlaylists
    ? {
        playlists: {
          items: data.favoritePlaylists.items,
        },
      }
    : {};

  return (
    <div className="w-full space-y-6 px-4">
      <div className="text-xl font-semibold">Playlists you&apos;ll love</div>
      <PlaylistCarousel data={transformedData} isLoading={isPending} />
    </div>
  );
};

export default PlaylistsYouLoveSection;
