import { TrackListWithFiltersQuery } from "@/modules/artist/studio/ui/sections/tracks/track-table-section";
import { execute } from "../execute";
import { queryOptions } from "@tanstack/react-query";

export const trackListOptions = queryOptions({
  queryKey: ["tracks"],
  queryFn: () => execute(TrackListWithFiltersQuery, { skip: 0, take: 10 }),
});
