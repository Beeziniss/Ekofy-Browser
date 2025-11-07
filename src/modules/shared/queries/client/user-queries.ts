import { graphql } from "@/gql";

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
