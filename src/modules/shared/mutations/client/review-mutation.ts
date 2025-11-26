import { graphql } from "@/gql";

export const CreateReviewMutation = graphql(`
  mutation CreateReview($createReviewRequest: CreateReviewRequestInput!) {
    createReview(createReviewRequest: $createReviewRequest)
  }
`);

export const UpdateReviewMutation = graphql(`
  mutation UpdateReview($updateReviewRequest: UpdateReviewRequestInput!) {
    updateReview(updateReviewRequest: $updateReviewRequest)
  }
`);
