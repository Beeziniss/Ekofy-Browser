import { artistListOptions } from "@/gql/options/client-options";
import ArtistHireView from "@/modules/client/artist/ui/views/artist-hire-view";
import { getQueryClient } from "@/providers/get-query-client";

const Page = () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery(artistListOptions(9));

  return <ArtistHireView />;
};

export default Page;
