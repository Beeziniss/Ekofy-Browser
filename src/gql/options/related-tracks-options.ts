import { queryOptions } from "@tanstack/react-query";
import { execute } from "../execute";
import { RELATED_TRACKS_QUERY_KEY } from "@/modules/shared/queries/client/related-tracks-queries";
import { TrackFilterInput, TrackSortInput } from "../graphql";

interface RelatedTracksParams {
  categoryIds: string[];
  skip?: number;
  take?: number;
  order?: TrackSortInput[];
}

export const relatedTracksByCategoryOptions = ({
  categoryIds,
  skip = 0,
  take = 10,
  order = [],
}: RelatedTracksParams) =>
  queryOptions({
    queryKey: ["related-tracks", categoryIds, skip, take],
    queryFn: async () => {
      if (!categoryIds || categoryIds.length === 0) return null;

      const where: TrackFilterInput = {
        categoryIds: {
          some: {
            in: categoryIds,
          },
        },
      };

      const result = await execute(RELATED_TRACKS_QUERY_KEY, {
        skip,
        take,
        where,
        order,
      });
      return result.tracks || null;
    },
    retry: 1,
    enabled: !!categoryIds && categoryIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
