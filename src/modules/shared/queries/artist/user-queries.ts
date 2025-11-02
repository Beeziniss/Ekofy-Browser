import { graphql } from "@/gql";

export const TrackUploadArtistListQuery = graphql(`
  query TrackUploadArtistList {
    artists(where: { isVisible: { eq: true } }, take: 50) {
      items {
        id
        userId
        stageName
        user {
          stripeAccountId
        }
      }
    }
  }
`);
