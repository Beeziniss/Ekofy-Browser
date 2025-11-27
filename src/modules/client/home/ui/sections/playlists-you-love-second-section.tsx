"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { playlistsFavoriteOptions } from "@/gql/options/client-options";
import PlaylistCarousel from "@/modules/client/common/ui/components/playlist/playlist-carousel";
import { useAuthStore } from "@/store";

const PlaylistsYouLoveSecondSection = () => {
  return (
    <Suspense fallback={<PlaylistsYouLoveSecondSkeleton />}>
      <PlaylistsYouLoveSecondSectionSuspense />
    </Suspense>
  );
};

const PlaylistsYouLoveSecondSkeleton = () => {
  return (
    <div className="w-full space-y-6 px-4">
      <div className="text-2xl font-semibold">More playlists for you</div>
      <PlaylistCarousel data={{}} isLoading />
    </div>
  );
};

const PlaylistsYouLoveSecondSectionSuspense = () => {
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
      <div className="text-2xl font-semibold">Playlists you love</div>
      <PlaylistCarousel data={transformedData} isLoading={isPending} />
    </div>
  );
};

export default PlaylistsYouLoveSecondSection;
