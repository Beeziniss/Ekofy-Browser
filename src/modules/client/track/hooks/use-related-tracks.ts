"use client";

import { useQuery } from "@tanstack/react-query";
import { relatedTracksByCategoryOptions } from "@/gql/options/related-tracks-options";

interface UseRelatedTracksParams {
  categoryIds: string[];
  take?: number;
  enabled?: boolean;
}

export const useRelatedTracks = ({
  categoryIds,
  take = 10,
  enabled = true,
}: UseRelatedTracksParams) => {
  const { data, isLoading, error, refetch } = useQuery({
    ...relatedTracksByCategoryOptions({
      categoryIds,
      take,
    }),
    enabled: !!categoryIds && categoryIds.length > 0 && enabled,
  });

  return {
    relatedTracks: data?.items || [],
    totalCount: data?.totalCount || 0,
    pageInfo: data?.pageInfo,
    isLoading,
    error,
    refetch,
  };
};
