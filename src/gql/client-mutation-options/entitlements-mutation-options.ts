import {
  CREATE_ENTITLEMENT,
  DEACTIVATE_ENTITLEMENT,
  REACTIVATE_ENTITLEMENT,
} from "@/modules/shared/mutations/admin/entitlements-muatation";
import { execute } from "@/gql/execute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseGraphQLError } from "@/utils/graphql-error-utils";
import type { CreateEntitlementRequestInput } from "@/gql/graphql";

// Mutation for creating a new entitlement
export const useCreateEntitlementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEntitlementRequestInput) => {
      const result = await execute(CREATE_ENTITLEMENT, {
        createEntitlementRequest: input,
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch entitlements
      queryClient.invalidateQueries({ queryKey: ["entitlements"] });
      toast.success("Entitlement created successfully");
    },
    onError: (error: Error) => {
      const errorHelper = parseGraphQLError(error, "Failed to create entitlement");
      toast.error(errorHelper.detail);
    },
  });
};

// Mutation for deactivating an entitlement
export const useDeactivateEntitlementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const result = await execute(DEACTIVATE_ENTITLEMENT, {
        code,
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch entitlements
      queryClient.invalidateQueries({ queryKey: ["entitlements"] });
      toast.success("Entitlement deactivated successfully");
    },
    onError: (error: Error) => {
      const errorHelper = parseGraphQLError(error, "Failed to deactivate entitlement");
      toast.error(errorHelper.detail);
    },
  });
};

// Mutation for reactivating an entitlement
export const useReactivateEntitlementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const result = await execute(REACTIVATE_ENTITLEMENT, {
        code,
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch entitlements
      queryClient.invalidateQueries({ queryKey: ["entitlements"] });
      toast.success("Entitlement reactivated successfully");
    },
    onError: (error: Error) => {
      const errorHelper = parseGraphQLError(error, "Failed to reactivate entitlement");
      toast.error(errorHelper.detail);
    },
  });
};

