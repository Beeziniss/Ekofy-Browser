import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/get-query-client";
import { royaltyPoliciesOptions } from "@/gql/options/royalty-policies-options";
import { RoyaltyPolicyView } from "@/modules/admin/royalty-policy/ui/view/royalty-policy-view";

const RoyaltyPolicyPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch royalty policies data
  await queryClient.prefetchQuery(royaltyPoliciesOptions(0, 10, undefined));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoyaltyPolicyView />
    </HydrationBoundary>
  );
};

export default RoyaltyPolicyPage;
