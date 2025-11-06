import { graphql } from "@/gql";

export const ApprovalHistoriesListQuery = graphql(`
  query ApprovalHistoriesList($skip: Int, $take: Int, $where: ApprovalHistoryFilterInput) {
    approvalHistories(skip: $skip, take: $take, where: $where) {
      totalCount
      items {
        id
        approvalType
        actionAt
        action
        notes
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
