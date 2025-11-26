import { graphql } from "@/gql";

export const TrackCommentUpdateMutation = graphql(`
  mutation UpdateTrackComment($commentId: String!, $content: String!) {
    updateComment(request: { commentId: $commentId, content: $content })
  }
`);

export const TrackCommentDeleteMutation = graphql(`
  mutation DeleteTrackComment($commentId: String!) {
    deleteComment(request: { commentId: $commentId })
  }
`);

export const TrackCommentCreateMutation = graphql(`
  mutation CreateTrackComment($request: CreateCommentRequestInput!) {
    createComment(request: $request)
  }
`);
