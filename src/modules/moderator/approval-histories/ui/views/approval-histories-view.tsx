"use client";

import { graphql } from "@/gql";
import { ApprovalHistoriesLayout } from "../layouts/approval-histories-layout";
import { ApprovalHistoriesSection } from "../section";

export const ApprovalHistoriesListQuery = graphql(`
  query ApprovalHistoriesList($skip: Int, $take: Int, $where: ApprovalHistoryFilterInput) {
    approvalHistories(skip: $skip, take: $take, where: $where) {
      totalCount
      items {
        id
        approvalType
        actionByUserId
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
        actionByUserId
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

export function ApprovalHistoriesView() {
  return (
    <ApprovalHistoriesLayout
      title="Approval Histories"
      description="View and manage approval history records"
    >
      <ApprovalHistoriesSection />
    </ApprovalHistoriesLayout>
  );
}