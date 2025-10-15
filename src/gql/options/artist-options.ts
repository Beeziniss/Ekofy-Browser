import { TrackListWithFiltersQuery } from "@/modules/artist/studio/ui/sections/tracks/track-table-section";
import { execute } from "../execute";
import { queryOptions } from "@tanstack/react-query";
import { TrackInsightViewQuery } from "@/modules/artist/tracks/ui/views/track-insight-view";

export const trackListOptions = queryOptions({
  queryKey: ["tracks"],
  queryFn: () => execute(TrackListWithFiltersQuery, { skip: 0, take: 10 }),
});

export const trackInsightOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["track-insight", trackId],
    queryFn: () => execute(TrackInsightViewQuery, { trackId }),
  });
