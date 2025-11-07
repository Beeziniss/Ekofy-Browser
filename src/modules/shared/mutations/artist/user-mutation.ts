import { graphql } from "@/gql";

export const UpdateArtistProfileMutation = graphql(`
  mutation UpdateArtistProfile($updateArtistRequest: UpdateArtistRequestInput!) {
    updateArtistProfile(updateArtistRequest: $updateArtistRequest)
  }
`);
