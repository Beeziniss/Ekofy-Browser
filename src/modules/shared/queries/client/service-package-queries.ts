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
        review {
          averageRating
          totalReviews
        }
      }
    }
  }
`);

export const ArtistPackageReviewQuery = graphql(`
  query ArtistPackageReview($skip: Int, $take: Int, $where: PackageOrderFilterInput) {
    packageOrders(skip: $skip, take: $take, where: $where, order: { review: { createdAt: DESC } }) {
      items {
            id
            artistPackageId
            review {
                rating
                content
                createdAt
                updatedAt
            }
            clientId
            providerId
            client {
                displayName
                avatarImage
            }
        }
    }
}
`);
