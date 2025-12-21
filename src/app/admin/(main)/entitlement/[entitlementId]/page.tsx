import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { EntitlementDetailView } from "@/modules/admin/entitlement/ui/views";
import { entitlementsQueryOptions } from "@/gql/options/entitlements-options";

interface EntitlementDetailPageProps {
  params: Promise<{
    entitlementId: string;
  }>;
}

const EntitlementDetailPage = async ({ params }: EntitlementDetailPageProps) => {
  const queryClient = getQueryClient();
  const resolvedParams = await params;
  const entitlementId = resolvedParams.entitlementId;

  // Prefetch entitlement detail
  await queryClient.prefetchQuery(
    entitlementsQueryOptions(0, 1, { id: { eq: entitlementId } })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EntitlementDetailView entitlementId={entitlementId} />
    </HydrationBoundary>
  );
};

export default EntitlementDetailPage;

