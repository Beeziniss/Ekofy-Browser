import { queryOptions } from "@tanstack/react-query";
import { execute } from "../execute";
import { TrackListHomeQuery } from "@/modules/client/home/ui/views/home-view";

export const trackListHomeOptions = queryOptions({
  queryKey: ["tracks-home"],
  queryFn: () => execute(TrackListHomeQuery, { take: 10 }),
});
