import { 
  ApproveArtistRegistrationMutation, 
  RejectArtistRegistrationMutation 
} from "@/modules/moderator/artist-approval/ui/views/artist-details-view";
import { 
  DeActiveUserMutation, 
  ReActiveUserMutation 
} from "@/modules/moderator/user-management/ui/views/moderator-user-management-view";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { execute } from "../execute";

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