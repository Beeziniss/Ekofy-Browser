import { graphql } from "@/gql";

export const RequestHubCommentUpdateMutation = graphql(`
  mutation UpdateRequestHubComment($commentId: String!, $content: String!) {
    updateComment(request: { commentId: $commentId, content: $content })
  }
`);

export const RequestHubCommentDeleteMutation = graphql(`
  mutation DeleteRequestHubComment($commentId: String!) {
    deleteComment(request: { commentId: $commentId })
  }
`);

export const RequestHubCommentCreateMutation = graphql(`
  mutation CreateRequestHubComment(
    $targetId: String!
    $commentType: CommentType!
    $content: String!
    $parentCommentId: String
  ) {
    createComment(
      request: {
        targetId: $targetId
        commentType: $commentType
        content: $content
        parentCommentId: $parentCommentId
      }
    )
  }
`);