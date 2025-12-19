import { graphql } from "@/gql";

export const GET_PENDING_ARTIST_REQUEST = graphql(`
  query GetPendingArtistRequest($skip: Int!, $take: Int!, $where: RequestFilterInput) {
    requests(skip: $skip, take: $take, where: $where, order: { requestCreatedTime: DESC }) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        requestUserId
        artistId
        packageId
        orderId
        title
        requestCreatedTime
        type
        status
        duration
        budget {
          min
          max
        }
        postCreatedTime
        currency
        requestor {
          id
          userId
          displayName
        }
        artist {
          id
          stageName
          userId
        }
        artistPackage {
          artistId
          id
          packageName
          amount
          currency
        }
      }
    }
  }
`);

export const GET_PENDING_ARTIST_REQUEST_DETAILS = graphql(`
  query RequestPendingDetailById($where: RequestFilterInput) {
    requests(where: $where) {
      totalCount
      items {
        id
        requestUserId
        artistId
        packageId
        orderId
        title
        titleUnsigned
        summary
        summaryUnsigned
        detailDescription
        requirements
        postCreatedTime
        updatedAt
        type
        currency
        duration
        status
        requestCreatedTime
        notes
        requestor {
          id
          userId
          displayName
          email
        }
        artist {
          id
          userId
          stageName
        }
        artistPackage {
          id
          artistId
          packageName
          amount
          currency
          maxRevision
          estimateDeliveryDays
        }
        budget {
          min
          max
        }
      }
    }
  }
`);
