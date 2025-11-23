import { graphql } from "@/gql";

export const ArtistPackageQuery = graphql(`
  query ArtistPackages($where: ArtistPackageFilterInput!) {
    artistPackages(where: $where) {
      items {
        id
        artistId
        amount
        currency
        packageName
        description
        serviceDetails {
          value
        }
        artist {
          id
          avatarImage
          stageName
          biography
        }
      }
    }
  }
`);
