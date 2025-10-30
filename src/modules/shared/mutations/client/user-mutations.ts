import { graphql } from "@/gql";

export const UserFollowMutation = graphql(`
  mutation FollowUser($targetId: String!) {
    followUser(
      request: { targetId: $targetId, targetType: ARTIST, action: FOLLOW }
    )
  }
`);

export const UserUnfollowMutation = graphql(`
  mutation UnfollowUser($targetId: String!) {
    unfollowUser(
      request: { targetId: $targetId, targetType: ARTIST, action: FOLLOW }
    )
  }
`);
