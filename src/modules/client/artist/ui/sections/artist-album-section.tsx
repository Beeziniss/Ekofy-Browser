"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { artistGetDataOptions } from "@/gql/options/artist-options";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import InfiniteScroll from "@/modules/shared/ui/components/infinite-scroll";
import AlbumList from "@/modules/client/albums/ui/components/album-list";
import { artistAlbumOptions } from "@/gql/options/client-options";

interface ArtistAlbumSectionProps {
  artistId: string;
}

// Custom album options for artist albums

const ArtistAlbumSection = ({ artistId }: ArtistAlbumSectionProps) => {
  // Fetch artist data to get userId
  const { data: artistData, isLoading: isArtistLoading } = useQuery(artistGetDataOptions(artistId));

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery.toLowerCase(), 300);

  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    artistAlbumOptions(artistData?.userId || "", debouncedSearchQuery, 12),
  );

  if (isArtistLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-8 w-60" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {[...Array(6)].map((_, index) => (
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
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">
          {data?.pages[0]?.albums?.totalCount ?? 0}{" "}
          {(data?.pages[0]?.albums?.totalCount ?? 0) === 1 ? "album" : "albums"}
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

      {isPending ? (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex w-full flex-col space-y-2.5">
              <Skeleton className="aspect-square h-full w-full rounded-md" />
              <div className="flex flex-col gap-y-1">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : !data || data.pages[0]?.albums?.totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-main-grey text-lg">
            {artistData?.stageName || "This artist"} has no albums yet. Please check back later.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            <AlbumList data={data} />
          </div>

          <div className="flex items-center justify-center">
            <InfiniteScroll
              isManual
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ArtistAlbumSection;
