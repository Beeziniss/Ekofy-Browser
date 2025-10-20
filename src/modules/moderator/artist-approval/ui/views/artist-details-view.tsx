"use client";

import { graphql } from "@/gql";
import { ArtistDetailsLayout } from "../layout";
import { ArtistDetailsSection } from "../section";

interface ArtistDetailsViewProps {
  userId: string;
}

export const PendingArtistRegistrationsDetailQuery = graphql(`
  query PendingArtistRegistrationsDetail($id: String) {
    pendingArtistRegistrations(where: { id: { eq: $id } }) {
      email
      fullName
      stageName
      artistType
      gender
      birthDate
      phoneNumber
      avatarImage
      id
      members {
        fullName
        email
        phoneNumber
        isLeader
        gender
      }
      requestedAt
      timeToLive
      identityCardNumber
      identityCardDateOfBirth
      identityCardFullName
      placeOfOrigin
      placeOfResidence
      frontImageUrl
      backImageUrl
    }
  }
`);

export const ApproveArtistRegistrationMutation = graphql(`
  mutation ApproveArtistRegistration($request: ArtistRegistrationApprovalRequestInput!) {
    approveArtistRegistration(request: $request)
  }
`);

export const RejectArtistRegistrationMutation = graphql(`
  mutation RejectArtistRegistration($request: ArtistRegistrationApprovalRequestInput!) {
    rejectArtistRegistration(request: $request)
  }
`);

export function ArtistDetailsView({ userId }: ArtistDetailsViewProps) {
  return (
    <ArtistDetailsLayout
      title="Artist information"
      description="Review artist details and approve or reject the application"
    >
      <ArtistDetailsSection userId={userId} />
    </ArtistDetailsLayout>
  );
}
