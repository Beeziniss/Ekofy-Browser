"use client";

import { graphql } from "@/gql";
import { ArtistApprovalLayout } from "../layout";
import { ArtistApprovalSection } from "../section";

export const PendingArtistRegistrationsQuery = graphql(`
  query PendingArtistRegistrationsList($pageNumber: Int!, $pageSize: Int!, $where: PaginatedDataOfPendingArtistRegistrationResponseFilterInput) {
    pendingArtistRegistrations(pageNumber: $pageNumber, pageSize: $pageSize, where: $where) {
      totalCount
      items {
        email
        fullName
        stageName
        stageNameUnsigned
        artistType
        gender
        birthDate
        phoneNumber
        avatarImage
        id
        requestedAt
      }
    }
  }
`)
export function ArtistApprovalView() {
  return (
    <ArtistApprovalLayout
      title="Approval Center"
      description="Manage artist registration requests and approvals"
    >
      <ArtistApprovalSection />
    </ArtistApprovalLayout>
  );
}
