import { graphql } from "@/gql";

export const FollowerQuery = graphql(`
  query Followers($userId: String!) {
    followersByUserId(userId: $userId) {
      totalCount
    }
  }
`);

export const FollowingQuery = graphql(`
  query Followings($userId: String!) {
    followingsByUserId(userId: $userId) {
      totalCount
    }
  }
`);
