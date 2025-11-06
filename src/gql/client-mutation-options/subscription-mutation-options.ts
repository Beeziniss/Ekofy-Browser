import { useMutation, useQueryClient } from "@tanstack/react-query";
import { execute } from "@/gql/execute";
import { CREATE_SUBSCRIPTION, CREATE_SUBSCRIPTION_PLAN } from "@/modules/shared/mutations/admin/subcription-mutation";
import type {
  CreateSubscriptionInput,
  CreateSubscriptionPlanInput,
  CreateSubScriptionPlanRequestInput,
  UpdateSubscriptionInput,
  UpdateSubscriptionPlanInput,
} from "@/types";
import { toast } from "sonner";

// Mutation for creating a new subscription
export const useCreateSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSubscriptionInput) => {
      const result = await execute(CREATE_SUBSCRIPTION, {
        createSubscriptionRequest: input,
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch subscriptions
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create subscription");
    },
  });
};

// Mutation for creating a new subscription plan
export const useCreateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSubscriptionPlanInput) => {
      // Transform input to match GraphQL schema - build required fields first
      const requestInput: CreateSubScriptionPlanRequestInput = {
        name: input.name,
        subscriptionCode: input.subscriptionCode,
        prices: input.prices.map((price) => ({
          interval: price.interval,
          intervalCount: price.intervalCount,
          lookupKey: price.lookupKey,
        })),
      };

      // Only add optional fields if they exist and are not empty
      if (input.images && input.images.length > 0) {
        requestInput.images = input.images;
      }

      if (input.metadata && input.metadata.length > 0) {
        requestInput.metadata = input.metadata;
      }

      const result = await execute(CREATE_SUBSCRIPTION_PLAN, {
        createSubScriptionPlanRequest: requestInput,
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch subscription plans
      queryClient.invalidateQueries({ queryKey: ["subscriptionPlans"] });
      toast.success("Subscription plan created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create subscription plan");
    },
  });
};

// Note: Add UPDATE and DELETE mutations when the GraphQL schema is available
// For now, these are placeholder implementations

export const useUpdateSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateSubscriptionInput) => {
      // TODO: Implement when UPDATE_SUBSCRIPTION mutation is available
      console.log("Update subscription:", input);
      throw new Error("Update subscription mutation not implemented yet");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update subscription");
    },
  });
};

export const useDeleteSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      // TODO: Implement when DELETE_SUBSCRIPTION mutation is available
      console.log("Delete subscription:", subscriptionId);
      throw new Error("Delete subscription mutation not implemented yet");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete subscription");
    },
  });
};

export const useUpdateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateSubscriptionPlanInput) => {
      // TODO: Implement when UPDATE_SUBSCRIPTION_PLAN mutation is available
      console.log("Update subscription plan:", input);
      throw new Error("Update subscription plan mutation not implemented yet");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionPlans"] });
      toast.success("Subscription plan updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update subscription plan");
    },
  });
};

export const useDeleteSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      // TODO: Implement when DELETE_SUBSCRIPTION_PLAN mutation is available
      console.log("Delete subscription plan:", planId);
      throw new Error("Delete subscription plan mutation not implemented yet");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionPlans"] });
      toast.success("Subscription plan deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete subscription plan");
    },
  });
};
