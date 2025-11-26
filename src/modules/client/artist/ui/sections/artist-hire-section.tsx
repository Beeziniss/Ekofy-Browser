"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import ArtistHireList from "../components/artist-hire-list";
import { artistListOptions } from "@/gql/options/client-options";
import InfiniteScroll from "@/modules/shared/ui/components/infinite-scroll";

const ArtistHireSection = () => {
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    artistListOptions(9),
  );

  return (
    <div className="space-y-8 px-6 py-8">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">
          {data?.pages[0].artists?.totalCount || 0} {data?.pages[0].artists?.totalCount === 1 ? "artist" : "artists"}{" "}
          available for hire
        </span>
      </div>

      <ArtistHireList data={data} isPending={isPending} />

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

export default ArtistHireSection;
