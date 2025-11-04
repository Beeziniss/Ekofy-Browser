import { graphql } from "@/gql";

export const FollowerQuery = graphql(`
  query Followers($userId: String, $artistId: String) {
    followers(userId: $userId, artistId: $artistId) {
      totalCount
    }
  }
`);

export const FollowingQuery = graphql(`
  query Followings($userId: String, $artistId: String) {
    followings(userId: $userId, artistId: $artistId) {
      totalCount
    }
  }
`);
