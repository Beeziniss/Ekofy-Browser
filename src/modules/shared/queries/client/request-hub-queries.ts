import { graphql } from "@/gql";

export const REQUEST_HUB_QUERY = graphql(`
  query Requests($skip: Int, $take: Int, $where: RequestFilterInput) {
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

export const REQUEST_BY_ID_QUERY = graphql(`
  query RequestDetailById($requestId: String!) {
    requestDetailById(requestId: $requestId) {
      id
      requestUserId
      title
      titleUnsigned
      summary
      summaryUnsigned
      detailDescription
      currency
      duration
      status
      type
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

export const SEARCH_REQUESTS_QUERY = graphql(`
  query SearchRequests($searchTerm: String!, $skip: Int, $take: Int, $isIndividual: Boolean!) {
    searchRequests(searchTerm: $searchTerm, skip: $skip, take: $take, isIndividual: $isIndividual) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        requestUserId
        title
        titleUnsigned
        summary
        summaryUnsigned
        detailDescription
        currency
        duration
        status
        postCreatedTime
        updatedAt
        budget {
          min
          max
        }
      }
      totalCount
    }
  }
`);

export const OWN_REQUESTS_QUERY = graphql(`
  query OwnRequests($skip: Int, $take: Int, $where: RequestFilterInput) {
    ownRequests(skip: $skip, take: $take, where: $where) {
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
        currency
        duration
        status
        type
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
  }
`);

export const USER_QUERY_FOR_REQUESTS = graphql(`
  query UsersForRequests($userId: String!) {
    users(where: { id: { eq: $userId } }) {
      items {
        id
        fullName
        gender
      }
    }
  }
`);

export const MY_REQUESTS_QUERY = REQUEST_HUB_QUERY;
