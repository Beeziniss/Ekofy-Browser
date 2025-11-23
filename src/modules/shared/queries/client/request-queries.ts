import { graphql } from "@/gql";

export const RequestArtistFragment = graphql(`
  fragment RequestArtist on Artist {
    id
    userId
    stageName
  }
`);

export const RequestArtistPackageFragment = graphql(`
  fragment RequestArtistPackage on ArtistPackage {
    id
    packageName
    amount
    currency
    estimateDeliveryDays
    description
    maxRevision
  }
`);

/**
 * Query to fetch listener's own direct requests (request history)
 * This is separate from the request hub and shows requests made directly to artists
 */
export const RequestsQuery = graphql(`
  query ListenerRequests($skip: Int, $take: Int, $where: RequestFilterInput) {
    requests(skip: $skip, take: $take, where: $where) {
      totalCount
      items {
        id
        requestUserId
        artistId
        packageId
        title
        summary
        detailDescription
        requirements
        type
        currency
        deadline
        status
        requestCreatedTime
        updatedAt
        notes
        budget {
          min
          max
        }
        artist {
          ...RequestArtist
        }
        artistPackage {
          ...RequestArtistPackage
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

/**
 * Query to fetch a single request by ID for the detail page
 */
export const RequestQuery = graphql(`
  query ListenerRequestById($skip: Int, $take: Int, $where: RequestFilterInput) {
    requests(skip: $skip, take: $take, where: $where) {
      totalCount
      items {
        id
        requestUserId
        artistId
        packageId
        title
        summary
        detailDescription
        requirements
        type
        currency
        deadline
        status
        requestCreatedTime
        updatedAt
        notes
        budget {
          min
          max
        }
        artist {
          ...RequestArtist
        }
        artistPackage {
          ...RequestArtistPackage
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);
