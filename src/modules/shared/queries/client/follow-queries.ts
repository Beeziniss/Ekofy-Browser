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

export const FollowerInfiniteQuery = graphql(`
  query FollowerInfinite($userId: String, $where: UserFilterInput, $take: Int, $skip: Int) {
    followers(userId: $userId, take: $take, skip: $skip, order: { createdAt: DESC }, where: $where) {
      totalCount
      pageInfo {
        hasNextPage
      }
      items {
        id
        fullName
        artists {
          items {
            id
            userId
            avatarImage
            stageName
          }
        }
        listeners {
          items {
            userId
            displayName
            avatarImage
          }
        }
        checkUserFollowing
        role
      }
    }
  }
`);

export const FollowingInfiniteQuery = graphql(`
  query FollowingInfinite($userId: String, $where: UserFilterInput, $take: Int, $skip: Int) {
    followings(userId: $userId, take: $take, skip: $skip, order: { createdAt: DESC }, where: $where) {
      totalCount
      pageInfo {
        hasNextPage
      }
      items {
        id
        fullName
        artists {
          items {
            id
            userId
            avatarImage
            stageName
          }
        }
        listeners {
          items {
            userId
            displayName
            avatarImage
          }
        }
        checkUserFollowing
        role
      }
    }
  }
`);
