import { graphql } from "@/gql";

export const TrackCommentUpdateMutation = graphql(`
  mutation UpdateTrackComment($commentId: String!, $content: String!) {
    updateTrackComment(request: { commentId: $commentId, content: $content })
  }
`);

export const TrackCommentDeleteMutation = graphql(`
  mutation DeleteTrackComment($commentId: String!) {
    deleteTrackComment(request: { commentId: $commentId })
  }
`);

export const TrackCommentCreateMutation = graphql(`
  mutation CreateTrackComment(
    $targetId: String!
    $commentType: CommentType!
    $content: String!
    $parentCommentId: String
  ) {
    createTrackComment(
      request: {
        targetId: $targetId
        commentType: $commentType
        content: $content
        parentCommentId: $parentCommentId
      }
    )
  }
`);
