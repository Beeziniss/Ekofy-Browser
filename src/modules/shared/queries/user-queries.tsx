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
    artists(where: { userId: { eq: $userId } }) {
      items {
        userId
        stageName
        avatarImage
        user {
          fullName
        }
      }
    }
  }
`);
