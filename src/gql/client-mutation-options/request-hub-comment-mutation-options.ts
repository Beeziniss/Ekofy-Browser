import { useMutation, useQueryClient } from "@tanstack/react-query";
import { execute } from "../execute";
import { CommentType } from "../graphql";
import {
  RequestHubCommentCreateMutation,
  RequestHubCommentDeleteMutation,
  RequestHubCommentUpdateMutation,
} from "@/modules/shared/mutations/client/request-hub-comment-mutation";

export const useCreateRequestHubComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      targetId: string;
      commentType: CommentType;
      content: string;
      parentCommentId?: string;
    }) => {
      return await execute(RequestHubCommentCreateMutation, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request-hub-comments"] });
      queryClient.invalidateQueries({ queryKey: ["request-hub-comment-replies"] });
    },
  });
};

export const useUpdateRequestHubComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { commentId: string; content: string }) => {
      return await execute(RequestHubCommentUpdateMutation, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request-hub-comments"] });
      queryClient.invalidateQueries({ queryKey: ["request-hub-comment-replies"] });
    },
  });
};

export const useDeleteRequestHubComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      return await execute(RequestHubCommentDeleteMutation, { commentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request-hub-comments"] });
      queryClient.invalidateQueries({ queryKey: ["request-hub-comment-replies"] });
    },
  });
};
