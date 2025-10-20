import { TrackListWithFiltersQuery } from "@/modules/artist/studio/ui/sections/tracks/track-table-section";
import { GetArtistProfileQuery } from "@/modules/artist/profile/ui/views/queries";
import { execute } from "../execute";
import { queryOptions } from "@tanstack/react-query";

export const trackListOptions = queryOptions({
  queryKey: ["tracks"],
  queryFn: () => execute(TrackListWithFiltersQuery, { skip: 0, take: 10 }),
});

export const artistProfileOptions = (userId: string) =>
  queryOptions({
    queryKey: ["artist-profile", userId],
    queryFn: async () => {
      const result = await execute(GetArtistProfileQuery, {
        where: { userId: { eq: userId } },
        take: 1,
        skip: 0,
      });
      return result.artists?.items?.[0] || null;
    },
    enabled: !!userId,
    retry: 0,
  });
