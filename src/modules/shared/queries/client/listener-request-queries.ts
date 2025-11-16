import { graphql } from '@/gql';

/**
 * Query to fetch listener's own direct requests (request history)
 * This is separate from the request hub and shows requests made directly to artists
 */
export const LISTENER_REQUESTS_QUERY = graphql(`
  query ListenerRequests(
    $skip: Int
    $take: Int
    $where: RequestFilterInput
  ) {
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
          id
          userId
          stageName
          avatarImage
        }
        artistPackage {
          id
          packageName
          description
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
export const LISTENER_REQUEST_BY_ID_QUERY = graphql(`
  query ListenerRequestById(
    $skip: Int
    $take: Int
    $where: RequestFilterInput
  ) {
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
          id
          userId
          stageName
          avatarImage
        }
        artistPackage {
          id
          packageName
          amount
          currency
          estimateDeliveryDays
          description
          maxRevision
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);
