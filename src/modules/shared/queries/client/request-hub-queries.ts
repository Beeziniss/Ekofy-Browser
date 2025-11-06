import { graphql } from "@/gql";

export const REQUEST_HUB_QUERY = graphql(`
  query Requests($skip: Int, $take: Int, $where: RequestHubFilterInput) {
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
        deadline
        status
        createdAt
        updatedAt
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
      deadline
      status
      createdAt
      updatedAt
      budget {
        min
        max
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
        deadline
        status
        createdAt
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
