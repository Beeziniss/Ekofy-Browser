import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { EntitlementView } from "@/modules/admin/entitlement/ui/views";
import { entitlementsQueryOptions } from "@/gql/options/entitlements-options";

const EntitlementPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of entitlements
  await queryClient.prefetchQuery(entitlementsQueryOptions(0, 10, undefined));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EntitlementView />
    </HydrationBoundary>
  );
};

export default EntitlementPage;

