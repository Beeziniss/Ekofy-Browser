import { queryOptions } from "@tanstack/react-query";
import { execute } from "../execute";
import { RECOMMENDED_TRACKS_BY_TRACK_ID } from "@/modules/shared/queries/client/recommeneded-track-queries";
import { RecommendationAlgorithm, AudioFeatureWeightInput, TrackSortInput } from "../graphql";

interface RecommendedTracksParams {
  trackId: string;
  skip?: number;
  take?: number;
  algorithm?: RecommendationAlgorithm;
  limit?: number;
  audioFeatureWeight?: AudioFeatureWeightInput;
  order?: TrackSortInput[];
}

export const recommendedTracksByTrackIdOptions = ({
  trackId,
  skip = 0,
  take = 10,
  algorithm = RecommendationAlgorithm.Cosine,
  limit = 5,
  audioFeatureWeight = {
    tempo: 1.2,
  },
  order = [],
}: RecommendedTracksParams) =>
  queryOptions({
    queryKey: ["recommended-tracks", trackId, skip, take, algorithm, limit],
    queryFn: async () => {
      if (!trackId) return null;
      const result = await execute(RECOMMENDED_TRACKS_BY_TRACK_ID, {
        trackId,
        skip,
        take,
        algorithm,
        limit,
        audioFeatureWeight,
        order,
      });
      return result.recommendedTracksByTrackId || null;
    },
    retry: 1,
    enabled: !!trackId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
