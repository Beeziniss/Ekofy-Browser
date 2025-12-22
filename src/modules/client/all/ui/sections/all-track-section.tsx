"use client";

import { Suspense, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { trackPublicInfiniteOptions } from "@/gql/options/client-options";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "@/modules/shared/ui/components/infinite-scroll";
import TrackCard from "@/modules/client/common/ui/components/track/track-card";

const AllTrackSection = () => {
  return (
    <Suspense fallback={<AllTrackSectionSkeleton />}>
      <AllTrackSectionSuspense />
    </Suspense>
  );
};

const AllTrackSectionSkeleton = () => {
  return (
    <div className="pointer-events-none w-full cursor-not-allowed space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">{0} tracks</span>

        <div className="relative">
          <Input
            placeholder="Search"
            className="focus-visible:border-main-purple focus-visible:ring-main-purple/90 h-8 w-60 pl-10"
          />
          <SearchIcon className="text-main-white absolute top-1/2 left-3 size-5 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="flex w-full flex-col space-y-2.5">
            <Skeleton className="aspect-square h-full w-full rounded-md" />
            <div className="flex flex-col gap-y-1">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AllTrackSectionSuspense = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery.toLowerCase(), 300);

  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    trackPublicInfiniteOptions(12),
  );

  // Get all tracks and filter by search query on the client side
  const allTracks = data?.pages.flatMap((page) => page.tracks?.items || []).filter((track) => track !== null) || [];
  const filteredTracks = debouncedSearchQuery
    ? allTracks.filter((track) => track.name.toLowerCase().includes(debouncedSearchQuery))
    : allTracks;

  const totalCount = data?.pages[0]?.tracks?.totalCount ?? 0;
  const filteredCount = filteredTracks.length;

  // Convert all tracks to track queue format for TrackCard
  const trackQueue = allTracks.map((track) => ({
    __typename: "Track" as const,
    id: track.id,
    name: track.name,
    coverImage: track.coverImage,
    mainArtistIds: track.mainArtistIds,
    mainArtists: track.mainArtists,
  }));

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">
          {debouncedSearchQuery ? filteredCount : totalCount}{" "}
          {(debouncedSearchQuery ? filteredCount : totalCount) === 1 ? "track" : "tracks"}
        </span>

        <div className="relative">
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-visible:border-main-purple focus-visible:ring-main-purple/90 h-8 w-60 pl-10"
          />
          <SearchIcon className="text-main-white absolute top-1/2 left-3 size-5 -translate-y-1/2" />
          {isPending && searchQuery !== "" && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <div className="border-main-purple h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {isPending
          ? [...Array(12)].map((_, index) => (
              <div key={index} className="flex w-full flex-col space-y-2.5">
                <Skeleton className="aspect-square h-full w-full rounded-md" />
                <div className="flex flex-col gap-y-1">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))
          : filteredTracks.length > 0
            ? filteredTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  trackId={track.id}
                  coverImage={track.coverImage}
                  trackName={track.name}
                  artists={track.mainArtists?.items || []}
                  trackQueue={trackQueue}
                  checkTrackInFavorite={track.checkTrackInFavorite}
                  isExplicit={track.isExplicit}
                />
              ))
            : null}
      </div>

      {!isPending && filteredTracks.length === 0 && (
        <div className="flex w-full items-center justify-center py-12">
          <p className="text-main-grey-text text-sm">
            {debouncedSearchQuery ? "No tracks found matching your search" : "No tracks available"}
          </p>
        </div>
      )}

      <div className="flex items-center justify-center">
        <InfiniteScroll
          isManual
          hasNextPage={hasNextPage && !debouncedSearchQuery}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
};

export default AllTrackSection;
