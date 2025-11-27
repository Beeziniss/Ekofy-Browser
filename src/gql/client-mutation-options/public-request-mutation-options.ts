import { useMutation, useQueryClient } from "@tanstack/react-query";
import { execute } from "../execute";
import { BLOCK_PUBLIC_REQUEST_MUTATION } from "@/modules/shared/mutations/moderator/public-request-mutaion";
import { toast } from "sonner";

export const useBlockPublicRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const result = await execute(BLOCK_PUBLIC_REQUEST_MUTATION, {
        requestId,
      });
      return result.blockPublicRequest;
    },
    onSuccess: () => {
      // Invalidate public requests queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["moderator-public-requests"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-public-request-by-id"] });
      toast.success("Request blocked successfully");
    },
    onError: (error) => {
      console.error("Error blocking request:", error);
      toast.error("Failed to block request. Please try again.");
    },
  });
};
