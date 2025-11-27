import { graphql } from "@/gql";

export const REQUEST_PUBLIC_QUERY = graphql(`
  query RequestsPublic($skip: Int, $take: Int, $where: RequestFilterInput) {
    requests(skip: $skip, take: $take, where: $where) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
      items {
        id
        requestUserId
        title
        titleUnsigned
        summary
        summaryUnsigned
        detailDescription
        budget {
          min
          max
        }
        currency
        duration
        status
        type
        postCreatedTime
        requestCreatedTime
        updatedAt
        artistId
        packageId
        artist {
          id
          stageName
          avatarImage
        }
        requestor {
          id
          userId
          displayName
        }
      }
    }
  }
`);

export const REQUEST_PUBLIC_BY_ID_QUERY = graphql(`
  query RequestPublicDetailById($requestId: String!) {
    requestDetailById(requestId: $requestId) {
      id
      requestUserId
      title
      titleUnsigned
      summary
      summaryUnsigned
      detailDescription
      currency
      status
      type
      duration
      postCreatedTime
      requestCreatedTime
      updatedAt
      artistId
      packageId
      budget {
        min
        max
      }
      artist {
        id
        stageName
        avatarImage
      }
      requestor {
        id
        userId
        displayName
      }
    }
  }
`);