import {
  CREATE_ESCOMMISSION_POLICY,
  DOWN_GRADE_ESCROW_COMMISSION_POLICY_VERSION,
  SWITCH_ESCROW_COMMISSION_POLICY_TO_LATEST_VERSION,
} from "@/modules/shared/mutations/admin/escrow-policies-mutation";
import { execute } from "@/gql/execute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseGraphQLError, parseGraphQLErrorEnhanced } from "@/utils/graphql-error-utils";
import { CreateEscrowCommissionPolicyRequestInput } from "@/gql/graphql";

// Mutation for creating a new escrow commission policy
export const useCreateEscrowPolicyMutation = () => {
  const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: CreateEscrowCommissionPolicyRequestInput) => {
            const result = await execute(CREATE_ESCOMMISSION_POLICY, {
                createRequest: input,
            });
            return result;
        },
        onSuccess: () => {
            // Invalidate and refetch escrow policies
            queryClient.invalidateQueries({ queryKey: ["escrow-policies"] });
            toast.success("Escrow commission policy created successfully");
        },
        onError: (error: Error) => {
            const errorHelper = parseGraphQLError(error, "Failed to create escrow commission policy");
            toast.error(errorHelper.detail);
        },
    });
};

// Mutation for downgrading escrow policy version
export const useDowngradeEscrowPolicyVersionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (version?: number) => {
      return await execute(DOWN_GRADE_ESCROW_COMMISSION_POLICY_VERSION, {
        version,
      });
    },
    onSuccess: (_, version) => {
      queryClient.invalidateQueries({ queryKey: ["escrow-policies"] });
      toast.success(
        version
          ? `Successfully downgraded to version ${version}`
          : "Successfully downgraded to previous version"
      );
    },
    onError: (error) => {
      const errorHelper = parseGraphQLErrorEnhanced(error, "Failed to downgrade version");
      toast.error(errorHelper.detail);
    },
  });
};

// Mutation for switching to latest escrow policy version
export const useSwitchEscrowToLatestVersionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await execute(SWITCH_ESCROW_COMMISSION_POLICY_TO_LATEST_VERSION);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escrow-policies"] });
      toast.success("Successfully switched to the latest policy version");
    },
    onError: (error) => {
      const errorHelper = parseGraphQLError(error, "Failed to switch to latest version");
      toast.error(errorHelper.detail);
    },
  });
};
