import { useMutation, useQueryClient } from "@tanstack/react-query";
import { execute } from "../execute";
import {
  CREATE_REQUEST_MUTATION,
  UPDATE_REQUEST_MUTATION,
  BLOCK_REQUEST_MUTATION,
} from "@/modules/shared/mutations/client/request-hub-mutation";
import { RequestCreatingRequestInput, RequestUpdatingRequestInput, RequestStatus } from "@/gql/graphql";

export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: RequestCreatingRequestInput) => {
      // Convert Date to ISO string for GraphQL DateTime
      const requestInput = {
        ...request,
        deadline: request.deadline.toISOString()
      };
      return await execute(CREATE_REQUEST_MUTATION, { request: requestInput });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
  });
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: RequestUpdatingRequestInput) => {
      // Convert Date to ISO string for GraphQL DateTime if needed
      const requestInput = {
        ...request,
        deadline: request.deadline?.toISOString ? request.deadline.toISOString() : request.deadline
      };
      return await execute(UPDATE_REQUEST_MUTATION, { request: requestInput });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      queryClient.invalidateQueries({ queryKey: ["request"] });
    },
  });
};

export const useBlockRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      return await execute(BLOCK_REQUEST_MUTATION, { requestId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["request"] });
    },
  });
};

export const useDeleteRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: RequestUpdatingRequestInput) => {
      // Set status to DELETED using UPDATE_REQUEST_MUTATION
      const requestInput = {
        ...request,
        deadline: request.deadline?.toISOString ? request.deadline.toISOString() : request.deadline,
        status: RequestStatus.Deleted
      };
      return await execute(UPDATE_REQUEST_MUTATION, { request: requestInput });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      queryClient.invalidateQueries({ queryKey: ["request"] });
    },
  });
};