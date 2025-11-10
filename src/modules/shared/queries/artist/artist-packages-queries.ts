import { graphql } from "@/gql";

// Query for listing artist packages
export const ServicePackageServiceViewQuery = graphql(`
  query ArtistPackagesService($skip: Int, $take: Int, $where: ArtistPackageFilterInput) {
    artistPackages(skip: $skip, take: $take, where: $where) {
      totalCount
      items {
        id
        packageName
        amount
        currency
        estimateDeliveryDays
        description
        maxRevision
        serviceDetails {
          key
          value
        }
        updatedAt
        createdAt
        artistId
        status
        isDelete
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

// Query for single package detail
export const ServicePackageDetailQuery = graphql(`
  query ArtistPackagesDetail($where: ArtistPackageFilterInput) {
    artistPackages(where: $where) {
      items {
        id
        packageName
        amount
        currency
        estimateDeliveryDays
        description
        maxRevision
        serviceDetails {
          key
          value
        }
        status
        isDelete
        createdAt
        updatedAt
        artistId
      }
    }
  }
`)

// Query for pending packages
export const PendingArtistPackagesQuery = graphql(`
  query PendingArtistPackages($pageNumber: Int!, $pageSize: Int!, $where: PaginatedDataOfPendingArtistPackageResponseFilterInput, $artistWhere: ArtistFilterInput) {
    pendingArtistPackages(pageNumber: $pageNumber, pageSize: $pageSize, where: $where) {
      totalCount
      items {
        id
        artistId
        packageName
        amount
        currency
        estimateDeliveryDays
        description
        status
        requestedAt
        timeToLive
        serviceDetails {
          key
          value
        }
      }
    }
    artists(where: $artistWhere) {
      items {
        stageName
        userId
        id
      }
    }
  }
`)