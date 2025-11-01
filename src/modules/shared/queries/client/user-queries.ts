import { graphql } from "@/gql";

export const ListenerQuery = graphql(`
  query Listener($userId: String!) {
    listeners(where: { userId: { eq: $userId } }) {
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
        bannerImage
        biography
        email
        user {
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

export const ArtistListQuery = graphql(`
  query ArtistList($take: Int, $skip: Int) {
    artists(
      where: { isVisible: { eq: true } }
      take: $take
      skip: $skip
      order: { popularity: DESC }
    ) {
      items {
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
