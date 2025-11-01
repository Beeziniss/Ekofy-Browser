import { graphql } from "@/gql";

export const UserFollowMutation = graphql(`
  mutation FollowUser($targetId: String!) {
    followUser(request: { targetId: $targetId })
  }
`);

export const UserUnfollowMutation = graphql(`
  mutation UnfollowUser($targetId: String!) {
    unfollowUser(request: { targetId: $targetId })
  }
`);
