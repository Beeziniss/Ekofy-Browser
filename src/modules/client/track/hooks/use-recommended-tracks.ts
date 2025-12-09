"use client";

import { useQuery } from "@tanstack/react-query";
import { recommendedTracksByTrackIdOptions } from "@/gql/options/recommended-tracks-options";
import { RecommendationAlgorithm } from "@/gql/graphql";

interface UseRecommendedTracksParams {
  trackId: string;
  take?: number;
  algorithm?: RecommendationAlgorithm;
  limit?: number;
  enabled?: boolean;
}

export const useRecommendedTracks = ({
  trackId,
  take = 10,
  algorithm = RecommendationAlgorithm.Cosine,
  limit = 5,
  enabled = true,
}: UseRecommendedTracksParams) => {
  const { data, isLoading, error, refetch } = useQuery({
    ...recommendedTracksByTrackIdOptions({
      trackId,
      take,
      algorithm,
      limit,
    }),
    enabled: !!trackId && enabled,
  });

  return {
    recommendedTracks: data?.items || [],
    totalCount: data?.totalCount || 0,
    pageInfo: data?.pageInfo,
    isLoading,
    error,
    refetch,
  };
};
