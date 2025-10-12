import { queryOptions } from "@tanstack/react-query";
import { execute } from "../execute";
import { TrackListHomeQuery } from "@/modules/client/home/ui/views/home-view";
import { TrackDetailViewQuery } from "@/modules/client/track/ui/views/track-detail-view";

export const trackListHomeOptions = queryOptions({
  queryKey: ["tracks-home"],
  queryFn: async () => await execute(TrackListHomeQuery, { take: 10 }),
});

export const trackDetailOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["track-detail", trackId],
    queryFn: async () => await execute(TrackDetailViewQuery, { trackId }),
  });
