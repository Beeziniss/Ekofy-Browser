"use client";

import { Suspense, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { albumListOptions } from "@/gql/options/client-options";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "@/modules/shared/ui/components/infinite-scroll";
import AlbumList from "../components/album-list";
import { AlbumCreate } from "@/modules/artist/albums/ui/components";

const AlbumSection = () => {
  return (
    <Suspense fallback={<AlbumSectionSkeleton />}>
      <AlbumSectionSuspense />
    </Suspense>
  );
};

const AlbumSectionSkeleton = () => {
  return (
    <div className="pointer-events-none w-full cursor-not-allowed space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">{0} album</span>

        <div className="relative">
          <Input
            placeholder="Search"
            className="focus-visible:border-main-purple focus-visible:ring-main-purple/90 h-8 w-60 pl-10"
          />
          <SearchIcon className="text-main-white absolute top-1/2 left-3 size-5 -translate-y-1/2" />
        </div>
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
};

const AlbumSectionSuspense = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery.toLowerCase(), 300);

  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    albumListOptions(debouncedSearchQuery, 12),
  );

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

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        <AlbumCreate />

        {isPending
          ? [...Array(6)].map((_, index) => (
              <div key={index} className="flex w-full flex-col space-y-2.5">
                <Skeleton className="aspect-square h-full w-full rounded-md" />
                <div className="flex flex-col gap-y-1">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))
          : data && <AlbumList data={data} />}
      </div>

      <div className="flex items-center justify-center">
        <InfiniteScroll
          isManual
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
};

export default AlbumSection;
