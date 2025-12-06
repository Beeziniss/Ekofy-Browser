import {
  ApproveArtistRegistrationMutation,
  RejectArtistRegistrationMutation,
} from "@/modules/shared/mutations/moderator/artist-approval-mutation";
import {
  DeActiveUserMutation,
  ReActiveUserMutation,
} from "@/modules/shared/mutations/moderator/user-management-mutation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { execute } from "../execute";
import {
  ApproveTrackUploadRequestMutation,
  RejectTrackUploadRequestMutation,
} from "@/modules/shared/queries/moderator/track-approval-queries";
import { 
  REFUND_PARTIALLY_MUTATION,
  SWITCH_STATUS_BY_REQUESTOR_MUTATION 
} from "@/modules/shared/mutations/moderator/order-disputed-mutaion";
import { PackageOrderStatus } from "../graphql";

export const useApproveArtistRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: { userId: string; email: string; fullName: string }) => {
      const result = await execute(ApproveArtistRegistrationMutation, { request });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch artist lists
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      queryClient.invalidateQueries({ queryKey: ["artist-details"] });
    },
  });
};

export const useRejectArtistRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: { userId: string; email: string; fullName: string; rejectionReason: string }) => {
      const result = await execute(RejectArtistRegistrationMutation, { request });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch artist lists
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      queryClient.invalidateQueries({ queryKey: ["artist-details"] });
    },
  });
};

export const useDeActiveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const result = await execute(DeActiveUserMutation, { targetUserId: userId });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: ["moderator-users"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-user-detail"] });
    },
  });
};

export const useReActiveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const result = await execute(ReActiveUserMutation, { targetUserId: userId });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: ["moderator-users"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-user-detail"] });
    },
  });
};

// Export the service package mutations from the artist service package mutation file
// export { useApproveArtistPackage, useRejectArtistPackage } from "./artist-service-package-mutation";

// Track mutations with enhanced feedback
export const useApproveTrackWithFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uploadId: string) => {
      return await execute(ApproveTrackUploadRequestMutation, { uploadId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-tracks"] });
    },
  });
};

export const useRejectTrackWithFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uploadId, reasonReject }: { uploadId: string; reasonReject: string }) => {
      return await execute(RejectTrackUploadRequestMutation, { uploadId, reasonReject });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-tracks"] });
    },
  });
};

// Legacy aliases for backward compatibility
export const useApproveTrackUploadRequest = useApproveTrackWithFeedback;
export const useRejectTrackUploadRequest = useRejectTrackWithFeedback;

// Package Order Refund mutation for disputed orders
export const useRefundPartially = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: {
      id: string;
      artistPercentageAmount: number;
      requestorPercentageAmount: number;
    }) => {
      return await execute(REFUND_PARTIALLY_MUTATION, { request });
    },
    onSuccess: () => {
      // Invalidate package orders queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["moderator-package-orders"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-disputed-package-orders"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-package-order-detail"] });
    },
  });
};

// Switch Order Status mutation for moderators (e.g., cancel refund)
export const useSwitchStatusByRequestor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: {
      id: string;
      status: PackageOrderStatus;
    }) => {
      return await execute(SWITCH_STATUS_BY_REQUESTOR_MUTATION, { request });
    },
    onSuccess: () => {
      // Invalidate package orders queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["moderator-package-orders"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-disputed-package-orders"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-package-order-detail"] });
    },
  });
};
