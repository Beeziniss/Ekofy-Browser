"use client";

import { useState } from "react";
import { useAuthStore } from "@/store";
import { SearchIcon } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { followerInfiniteOptions } from "@/gql/options/client-options";
import InfiniteScroll from "@/modules/shared/ui/components/infinite-scroll";
import FollowerList from "@/modules/client/library/ui/components/follower-list";

/* const FollowerSection = () => {
  return (
    <Suspense fallback={<FollowerSectionSkeleton />}>
      <FollowerSectionSuspense />
    </Suspense>
  );
};

const FollowerSectionSkeleton = () => {
  return (
    <div className="pointer-events-none w-full cursor-not-allowed space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">{0} followers</span>

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
            <Skeleton className="aspect-square h-full w-full rounded-full" />
            <div className="flex flex-col gap-y-1 text-center">
              <Skeleton className="mx-auto h-5 w-28" />
              <Skeleton className="mx-auto h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; */

const FollowerSection = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery.toLowerCase(), 300);

  // This will only run when the component is rendered (i.e., when user is authenticated)
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    followerInfiniteOptions(user!.userId, 12, debouncedSearchQuery),
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">
          {data?.pages[0]?.followers?.totalCount ?? 0}{" "}
          {(data?.pages[0]?.followers?.totalCount ?? 0) === 1 ? "follower" : "followers"}
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
        {isPending
          ? [...Array(6)].map((_, index) => (
              <div key={index} className="flex w-full flex-col space-y-2.5">
                <Skeleton className="aspect-square h-full w-full rounded-full" />
                <div className="flex flex-col gap-y-1 text-center">
                  <Skeleton className="mx-auto h-5 w-28" />
                  <Skeleton className="mx-auto h-4 w-16" />
                </div>
              </div>
            ))
          : data && <FollowerList data={data} />}
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

export default FollowerSection;
