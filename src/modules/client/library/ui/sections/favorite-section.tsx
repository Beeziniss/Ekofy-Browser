"use client";

import { Suspense, useState, useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trackFavoriteOptions } from "@/gql/options/client-options";
import { useAuthStore } from "@/store";
import FavoriteTracksTable, { FavoriteTrack } from "../components/favorite-tracks-table";
import { Skeleton } from "@/components/ui/skeleton";

const FavoriteSection = () => {
  return (
    <Suspense fallback={<FavoriteSectionSkeleton />}>
      <FavoriteSectionSuspense />
    </Suspense>
  );
};

const FavoriteSectionSkeleton = () => {
  return (
    <div className="w-full space-y-6 px-6 py-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
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

const FavoriteSectionSuspense = () => {
  const { isAuthenticated } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50; // Default 50 per page as requested
  const skip = (currentPage - 1) * pageSize;

  const { data } = useSuspenseQuery(trackFavoriteOptions(pageSize, skip, isAuthenticated));

  // Reset to page 1 if current page is beyond available data
  useEffect(() => {
    if (data?.favoriteTracks) {
      const totalPages = Math.ceil(data.favoriteTracks.totalCount / pageSize);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
      }
    }
  }, [data?.favoriteTracks, currentPage, pageSize]);

  if (!isAuthenticated) {
    return (
      <div className="w-full px-6 py-8">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold text-white">Sign in to view your favorites</h2>
          <p className="text-gray-400">You need to be signed in to see your favorite tracks.</p>
        </div>
      </div>
    );
  }

  if (!data?.favoriteTracks?.items?.length) {
    return (
      <div className="w-full px-6 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Your Favorite Tracks</h1>
            <p className="text-gray-400">Tracks you love will appear here.</p>
          </div>
          <div className="space-y-4 py-16 text-center">
            <h2 className="text-xl font-semibold text-white">No favorite tracks yet</h2>
            <p className="text-gray-400">Start exploring music and add tracks to your favorites!</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform favorite tracks data to match FavoriteTracksTable expected structure
  const favoriteTracksData: FavoriteTrack[] = (data.favoriteTracks?.items || [])
    .filter((track): track is NonNullable<typeof track> => track !== null)
    .map((track) => ({
      id: track.id,
      name: track.name,
      coverImage: track.coverImage,
      artist:
        track.mainArtists?.items
          ?.map((artist) => artist?.stageName)
          .filter(Boolean)
          .join(", ") || "Unknown Artist",
      addedTime: track.createdAt || new Date().toISOString(),
    }));

  return (
    <div className="w-full">
      <div className="space-y-6">
        <p className="text-main-white text-2xl font-semibold">{data.favoriteTracks?.totalCount || 0} tracks you love</p>
        <FavoriteTracksTable
          tracks={favoriteTracksData}
          totalCount={data.favoriteTracks?.totalCount || 0}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default FavoriteSection;
