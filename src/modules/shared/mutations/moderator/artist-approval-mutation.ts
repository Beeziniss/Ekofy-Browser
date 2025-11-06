import { graphql } from "@/gql";

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
