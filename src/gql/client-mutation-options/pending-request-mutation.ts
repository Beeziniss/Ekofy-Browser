import { useMutation, useQueryClient } from "@tanstack/react-query";
import { execute } from "../execute";
import { CHANGE_REQUEST_STATUS_MUTATION } from "@/modules/shared/mutations/artist/pending-artist-request-mutation";
import { ChangeStatusRequestInput, RequestStatus } from "../graphql";
import { toast } from "sonner";

// Change request status (approve/reject)
export const useChangeRequestStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ChangeStatusRequestInput) => {
      const result = await execute(CHANGE_REQUEST_STATUS_MUTATION, {
        request: input,
      });
      return result.changeRequestStatus;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch pending requests queries
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
      queryClient.invalidateQueries({ queryKey: ["pending-request-detail", variables.requestId] });
      queryClient.invalidateQueries({ queryKey: ["pending-requests-by-status"] });
      
      // Show success message
      const action = variables.status === RequestStatus.Confirmed ? "approved" : "rejected";
      toast.success(`Request ${action} successfully!`);
    },
    onError: (error) => {
      console.error("Failed to change request status:", error);
      toast.error("Failed to change request status. Please try again.");
    },
  });
};