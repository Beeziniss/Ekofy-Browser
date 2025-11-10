import { graphql } from "@/gql";

export const ArtistPackageQuery = graphql(`
  query ArtistPackages($artistId: String!) {
    artistPackages(where: { status: { eq: ENABLED }, artistId: { eq: $artistId } }) {
      items {
        id
        artistId
        amount
        currency
        packageName
        description
      }
    }
  }
`);
