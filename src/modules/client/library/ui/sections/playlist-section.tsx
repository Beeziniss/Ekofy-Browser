"use client";

import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { playlistOptions } from "@/gql/options/client-options";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import PlaylistCreate from "../../../playlist/ui/components/playlist-create";
import PlaylistList from "@/modules/client/playlist/ui/components/playlist-list";
import InfiniteScroll from "@/modules/shared/ui/components/infinite-scroll";
import { useAuthStore } from "@/store";

const PlaylistSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const { user } = useAuthStore();

  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      playlistOptions(user?.userId || "", debouncedSearchQuery, 11),
    );

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">
          {data?.pages[0].playlists?.totalCount}{" "}
          {data?.pages[0].playlists?.totalCount === 1
            ? "playlist"
            : "playlists"}
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

        <PlaylistList data={data} isPending={isPending} />
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
