import { graphql } from "@/gql";

export const UserBasicInfoQuery = graphql(`
  query UserBasicInfo($userId: String!) {
    users(where: { id: { eq: $userId } }) {
      items {
        email
        phoneNumber
      }
    }
  }
`);

export const ListenerQuery = graphql(`
  query Listener($userId: String!) {
    listeners(where: { userId: { eq: $userId }, isVisible: { eq: true } }) {
      items {
        userId
        displayName
        avatarImage
        user {
          fullName
        }
      }
    }
  }
`);

export const ArtistQuery = graphql(`
  query Artist($userId: String!) {
    artists(where: { userId: { eq: $userId }, isVisible: { eq: true } }) {
      items {
        userId
        stageName
        avatarImage
        user {
          fullName
          checkUserFollowing
        }
        followerCount
      }
    }
  }
`);

export const ArtistListQuery = graphql(`
  query ArtistList($take: Int, $skip: Int) {
    artists(where: { isVisible: { eq: true } }, take: $take, skip: $skip, order: { popularity: DESC }) {
      items {
        id
        userId
        stageName
        biography
        avatarImage
        identityCard {
          nationality
          placeOfResidence {
            province
          }
        }
        user {
          fullName
        }
      }
      pageInfo {
        hasNextPage
      }
      totalCount
    }
  }
`);

export const ArtistDetailQuery = graphql(`
  query ArtistDetail($artistId: String!) {
    artists(where: { id: { eq: $artistId }, isVisible: { eq: true } }) {
      items {
        userId
        stageName
        avatarImage
        bannerImage
        biography
        email
        user {
          id
          fullName
          checkUserFollowing
        }
        followerCount
        categoryIds
        categories {
          items {
            name
          }
        }
      }
    }
  }
`);

export const GetListenerProfileQuery = graphql(`
  query GetListenerProfile($where: ListenerFilterInput) {
    listeners(where: $where, take: 1) {
      items {
        id
        userId
        displayName
        email
        avatarImage
        bannerImage
        createdAt
        followerCount
        followingCount
        isVerified
        user {
          birthDate
          gender
        }
      }
    }
  }
`);

// Active subscription for a user to derive membership status
export const GetUserActiveSubscriptionQuery = graphql(`
  query GetUserActiveSubscription($where: UserSubscriptionFilterInput, $take: Int, $skip: Int) {
    userSubscriptions(where: $where, take: $take, skip: $skip) {
      items {
        id
        isActive
        subscriptionId
        subscription {
          tier
          status
          name
        }
        periodEnd
        cancelAtEndOfPeriod
        canceledAt
      }
    }
  }
`);

export const GetUserstripeAccountIdQuery = graphql(`
  query GetUserStripeAccountId($userId: String!) {
    users(where: { id: { eq: $userId } }) {
      items {
        role
        stripeAccountId
      }
    }
  }
`);
