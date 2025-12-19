import { fingerprintConfidencePolicyOptions } from "@/gql/options/fingerprint-options";
import { FingerprintView } from "@/modules/admin/fingerprint/ui/views/fingerprint-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const FingerprintPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch fingerprint confidence policy
  await queryClient.prefetchQuery(fingerprintConfidencePolicyOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FingerprintView />
    </HydrationBoundary>
  );
};

export default FingerprintPage;

