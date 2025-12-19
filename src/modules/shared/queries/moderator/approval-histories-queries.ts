import { graphql } from "@/gql";

export const ApprovalHistoriesListQuery = graphql(`
  query ApprovalHistoriesList($skip: Int, $take: Int, $where: ApprovalHistoryFilterInput) {
    approvalHistories(skip: $skip, take: $take, where: $where, order: { actionAt: DESC }) {
      totalCount
      items {
        id
        approvalType
        actionAt
        action
        notes
        approvedByUserId
        snapshot
        approvedBy {
          id
          email
          fullName
          role
        }
        targetId
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

export const ModeratorApprovalHistoryDetailQuery = graphql(`
  query ModeratorApprovalHistoryDetail($where: ApprovalHistoryFilterInput) {
    approvalHistories(where: $where) {
      items {
        id
        approvalType
        actionAt
        action
        notes
        approvedByUserId
        snapshot
        approvedBy {
          id
          email
          fullName
          role
        }
        targetId
      }
    }
  }
`);

export const ApprovalHistoriesArtistQuery = graphql(`
  query ApprovalHistoriesArtist($where: ArtistFilterInput) {
    artists(where: $where) {
      items {
      id
      userId
      stageName
      email
      }
    }
  }
`);

export const ApprovalHistoriesUserQuery = graphql(`
  query ApprovalHistoriesUser($where: UserFilterInput) {
    users(where: $where) {
      items {
            id
            artists {
                items {
                    id
                    userId
                    stageName
                    email
                }
            }
        }
    }
}
`);

export const ApprovalHistoriesCategoryQuery = graphql(`
  query ApprovalHistoriesCategory($where: CategoryFilterInput) {
    categories(where: $where) {
      items {
        id
        name
        type
      }
    }
  }
`);

export const ApprovalHistoriesUserFullInfoQuery = graphql(`
  query ApprovalHistoriesUserFullInfo($where: UserFilterInput) {
    users(where: $where) {
      items {
        id
        fullName
        email
      }
    }
  }
`);