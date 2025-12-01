import {CREATE_ROYALTY_POLICY, UPDATE_ROYALTY_POLICY} from "@/modules/shared/mutations/admin/royalty-policies-mutation";
import { CreateRoyaltyRequestInput, UpdateRoyaltyRequestInput } from "@/types/royalty-policies";
import { execute } from "@/gql/execute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
            toast.error(error.message || "Failed to create royalty policy");
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
            toast.error(error.message || "Failed to update royalty policy");
        },
    });
};