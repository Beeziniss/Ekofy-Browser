import { useMutation, useQueryClient } from "@tanstack/react-query";
import { execute } from "@/gql/execute";
import { updateFingerprintConfidencePolicyMutation } from "@/modules/shared/mutations/admin/fingerprint-mutation";
import { toast } from "sonner";
import { parseGraphQLError } from "@/utils/graphql-error-utils";
import type { UpdateFingerprintConfidencePolicyRequestInput } from "@/gql/graphql";

// Mutation for updating fingerprint confidence policy
export const useUpdateFingerprintConfidencePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateRequest: UpdateFingerprintConfidencePolicyRequestInput) => {
      const result = await execute(updateFingerprintConfidencePolicyMutation, {
        updateRequest,
      });
      return result.updateFingerprintConfidencePolicy;
    },
    onSuccess: () => {
      // Invalidate and refetch fingerprint confidence policy
      queryClient.invalidateQueries({ queryKey: ["fingerprint-confidence-policy"] });
      toast.success("Fingerprint confidence policy updated successfully");
    },
    onError: (error: Error) => {
      const errorHelper = parseGraphQLError(error, "Failed to update fingerprint confidence policy");
      toast.error(errorHelper.detail);
    },
  });
};

