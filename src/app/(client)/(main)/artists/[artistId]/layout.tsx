// app/(client)/artist/[artistId]/layout.tsx (Server Component)
import { getQueryClient } from "@/providers/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { artistDetailOptions, followerOptions, followingOptions } from "@/gql/options/client-options";

import ArtistDetailLayout from "@/modules/client/artist/ui/layouts/artist-detail-layout";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ artistId: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { artistId } = await params;
  const queryClient = getQueryClient();

  // IMPORTANT: Fetch all three queries IN PARALLEL
  await Promise.all([
    queryClient.prefetchQuery(artistDetailOptions(artistId)),
    queryClient.prefetchQuery(followerOptions({ artistId })),
    queryClient.prefetchQuery(followingOptions({ artistId })),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArtistDetailLayout>{children}</ArtistDetailLayout>
    </HydrationBoundary>
  );
};

export default Layout;
