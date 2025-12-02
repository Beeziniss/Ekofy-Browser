"use client";

import { execute } from "@/gql/execute";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
// import TrackUploadEmpty from "../../components/track-upload/track-upload-empty";
import TrackTableWrapper from "../../components/track-table/track-table-wrapper";
import { TrackFilterInput, TrackSortInput, SortEnumType } from "@/gql/graphql";
import { TrackListWithFiltersQuery } from "@/modules/shared/queries/artist/track-queries";
import { useAuthStore } from "@/store";
import TrackUploadEmpty from "../../components/track-upload/track-upload-empty";

const TrackTableSection = () => {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";
  const searchQuery = searchParams.get("search") || "";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const privacyFilter = searchParams.get("privacy") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const skip = (currentPage - 1) * pageSize;

  // Build where filter
  const where: TrackFilterInput = {};
  if (searchQuery.trim()) {
    where.name = { contains: searchQuery };
  }
  if (privacyFilter !== "all") {
    where.releaseInfo = {
      isRelease: { eq: privacyFilter === "public" },
    };
  }
  if (user?.userId) {
    where.createdBy = { eq: user.userId };
  }

  // Build order
  const order: TrackSortInput[] = [
    // TODO: Uncomment if necessary
    /* {
      createdAt: SortEnumType.Desc,
    }, */
  ];

  if (sortBy) {
    switch (sortBy) {
      case "releaseDate":
        order.push({
          releaseInfo: {
            releaseDate: sortOrder === "desc" ? SortEnumType.Desc : SortEnumType.Asc,
          },
        });
        break;
      case "streamCount":
        order.push({
          streamCount: sortOrder === "desc" ? SortEnumType.Desc : SortEnumType.Asc,
        });
        break;
      case "favoriteCount":
        order.push({
          favoriteCount: sortOrder === "desc" ? SortEnumType.Desc : SortEnumType.Asc,
        });
        break;
    }
  }

  const { data } = useSuspenseQuery({
    queryKey: ["tracks", skip, pageSize, searchQuery, privacyFilter, sortBy, sortOrder],
    queryFn: () =>
      execute(TrackListWithFiltersQuery, {
        skip,
        take: pageSize,
        where: Object.keys(where).length > 0 ? where : undefined,
        order: order.length > 0 ? order : undefined,
      }),
  });

  // Helper boolean to check if user is filtering (Search OR Privacy filter)
  const isFiltering = !!searchQuery || privacyFilter !== "all";

  // Helper boolean to check if API returned empty
  const isDataEmpty = data.tracks?.totalCount === 0;
  return (
    <div className="mt-8">
      {/* Only show the "Upload Empty" (Onboarding) screen if:
        1. The data is empty
        2. AND the user is NOT currently filtering/searching
      */}
      {isDataEmpty && !isFiltering ? (
        <TrackUploadEmpty />
      ) : (
        data.tracks && (
          <TrackTableWrapper
            data={data.tracks?.items || []}
            totalCount={data.tracks?.totalCount || 0}
            hasNextPage={data.tracks?.pageInfo?.hasNextPage || false}
            hasPreviousPage={data.tracks?.pageInfo?.hasPreviousPage || false}
            pageSize={pageSize}
          />
        )
      )}
    </div>
  );
};

export default TrackTableSection;
