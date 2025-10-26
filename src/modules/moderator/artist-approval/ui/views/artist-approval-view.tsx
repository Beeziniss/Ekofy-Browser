"use client";

import { graphql } from "@/gql";
import { ArtistApprovalLayout } from "../layout";
import { ArtistApprovalSection } from "../section";

export const PendingArtistRegistrationsQuery = graphql(`
  query PendingArtistRegistrationsView(
    $pageNumber: Int!
    $pageSize: Int!
    $where: PaginatedDataOfPendingArtistRegistrationResponseFilterInput
  ) {
    pendingArtistRegistrations(
      pageNumber: $pageNumber
      pageSize: $pageSize
      where: $where
    ) {
      items {
        email
        fullName
        stageName
        artistType
        gender
        birthDate
        phoneNumber
        avatarImage
        id
      }
      totalCount
    }
  }
`);

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
