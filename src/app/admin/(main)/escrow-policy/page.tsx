import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/get-query-client";
import { escrowPoliciesOptions } from "@/gql/options/escrow-policies-options";
import { EscrowPolicyView } from "@/modules/admin/escrow-policy/ui/view/escrow-policy-view";

const EscrowPolicyPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch escrow policies data
  await queryClient.prefetchQuery(escrowPoliciesOptions(0, 10, undefined));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EscrowPolicyView />
    </HydrationBoundary>
  );
};

export default EscrowPolicyPage;
