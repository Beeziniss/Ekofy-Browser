import {
  CREATE_ROYALTY_POLICY,
  UPDATE_ROYALTY_POLICY,
  DOWN_GRADE_ROYALTY_POLICY_VERSION,
  SWITCH_TO_LASTEST_VERSION,
} from "@/modules/shared/mutations/admin/royalty-policies-mutation";
import { CreateRoyaltyRequestInput, UpdateRoyaltyRequestInput } from "@/types/royalty-policies";
import { execute } from "@/gql/execute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseGraphQLError, parseGraphQLErrorEnhanced } from "@/utils/graphql-error-utils";

// Mutation for creating a new royalty policy
export const useCreateRoyaltyPolicyMutation = () => {
  const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: CreateRoyaltyRequestInput) => {
            const result = await execute(CREATE_ROYALTY_POLICY, {
                createRoyalPolicyRequest: input,
            });
            return result;
        },
        onSuccess: () => {
            // Invalidate and refetch royalty policies
            queryClient.invalidateQueries({ queryKey: ["royalty-policies"] });
            toast.success("Royalty policy created successfully");
        },
        onError: (error: Error) => {
            const errorHelper = parseGraphQLError(error, "Failed to create royalty policy");
            toast.error(errorHelper.detail);
        },
    });
};

// Mutation for updating an existing royalty policy
export const useUpdateRoyaltyPolicyMutation = () => {
  const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: UpdateRoyaltyRequestInput) => {
            const result = await execute(UPDATE_ROYALTY_POLICY, {
                updateRoyalPolicyRequest: input,
            });
            return result;
        },
        onSuccess: () => {
            // Invalidate and refetch royalty policies
            queryClient.invalidateQueries({ queryKey: ["royalty-policies"] });
            toast.success("Royalty policy updated successfully");
        },
        onError: (error: Error) => {
            const errorHelper = parseGraphQLError(error, "Failed to update royalty policy");
            toast.error(errorHelper.detail);
        },
    });
};

// Mutation for downgrading royalty policy version
export const useDowngradeRoyaltyPolicyVersionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (version?: number) => {
      return await execute(DOWN_GRADE_ROYALTY_POLICY_VERSION, {
        version,
      });
    },
    onSuccess: (_, version) => {
      queryClient.invalidateQueries({ queryKey: ["royalty-policies"] });
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

// Mutation for switching to latest royalty policy version
export const useSwitchToLatestVersionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await execute(SWITCH_TO_LASTEST_VERSION);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["royalty-policies"] });
      toast.success("Successfully switched to the latest policy version");
    },
    onError: (error) => {
      const errorHelper = parseGraphQLError(error, "Failed to switch to latest version");
      toast.error(errorHelper.detail);
    },
  });
};