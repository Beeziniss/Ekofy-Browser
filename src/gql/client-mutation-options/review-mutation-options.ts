import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { execute } from "@/gql/execute";
import { 
  CreateReviewMutation, 
  UpdateReviewMutation, 
  DeleteReviewMutation 
} from "@/modules/shared/mutations/client/review-mutation";

// Create Review
interface CreateReviewInput {
  packageOrderId: string;
  rating: number;
  content: string;
}

export function useCreateReview(
  options?: UseMutationOptions<boolean, Error, CreateReviewInput>
) {
  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const result = await execute(CreateReviewMutation, {
        createReviewRequest: {
          packageOrderId: input.packageOrderId,
          rating: input.rating,
          content: input.content,
        },
      });
      return result.createReview;
    },
    ...options,
  });
}

// Update Review
interface UpdateReviewInput {
  packageOrderId: string;
  rating?: number;
  comment?: string;
}

export function useUpdateReview(
  options?: UseMutationOptions<boolean, Error, UpdateReviewInput>
) {
  return useMutation({
    mutationFn: async (input: UpdateReviewInput) => {
      const result = await execute(UpdateReviewMutation, {
        updateReviewRequest: {
          packageOrderId: input.packageOrderId,
          rating: input.rating,
          comment: input.comment,
        },
      });
      return result.updateReview;
    },
    ...options,
  });
}

// Delete Review
interface DeleteReviewInput {
  reviewId: string;
}

export function useDeleteReview(
  options?: UseMutationOptions<boolean, Error, DeleteReviewInput>
) {
  return useMutation({
    mutationFn: async (input: DeleteReviewInput) => {
      const result = await execute(DeleteReviewMutation, {
        reviewId: input.reviewId,
      });
      return result.deleteReviewHard;
    },
    ...options,
  });
}
