"use client";

import { useAuthStore } from "@/store";
import { Suspense, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { playlistOptions } from "@/gql/options/client-options";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "@/modules/shared/ui/components/infinite-scroll";
import PlaylistCreate from "../../../playlist/ui/components/playlist-create";
import PlaylistList from "@/modules/client/playlist/ui/components/playlist-list";

const PlaylistSection = () => {
  return (
    <Suspense fallback={<PlaylistSectionSkeleton />}>
      <PlaylistSectionSuspense />
    </Suspense>
  );
};

const PlaylistSectionSkeleton = () => {
  return (
    <div className="pointer-events-none w-full cursor-not-allowed space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">{0} playlist</span>

        <div className="relative">
          <Input
            placeholder="Search"
            className="focus-visible:border-main-purple focus-visible:ring-main-purple/90 h-8 w-60 pl-10"
          />
          <SearchIcon className="text-main-white absolute top-1/2 left-3 size-5 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        <div className="flex w-full flex-col space-y-2.5">
          <div className="bg-main-card-bg hover:bg-main-purple/20 flex aspect-square w-full cursor-pointer items-center justify-center rounded-md transition">
            <PlusIcon className="text-main-white size-9" />
          </div>
          <p className="text-main-white hover:text-main-purple cursor-pointer text-sm hover:underline">
            Create a playlist
          </p>
        </div>

        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex w-full flex-col space-y-2.5">
            <Skeleton className="h-full w-full rounded-md" />
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

const PlaylistSectionSuspense = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // This will only run when the component is rendered (i.e., when user is authenticated)
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    playlistOptions(user!.userId, debouncedSearchQuery, 11),
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">
          {data?.pages[0].playlists?.totalCount} {data?.pages[0].playlists?.totalCount === 1 ? "playlist" : "playlists"}
        </span>

        <div className="relative">
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-visible:border-main-purple focus-visible:ring-main-purple/90 h-8 w-60 pl-10"
          />
          <SearchIcon className="text-main-white absolute top-1/2 left-3 size-5 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {debouncedSearchQuery === "" && <PlaylistCreate />}

        <PlaylistList data={data} />
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

export default PlaylistSection;
