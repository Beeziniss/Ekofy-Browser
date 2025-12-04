import { graphql } from "@/gql";

export const UpsertStreamCountMutation = graphql(`
  mutation UpsertStreamCount($trackId: String!) {
    upsertStreamCount(trackId: $trackId)
  }
`);

export const UpsertTopTrackCountMutation = graphql(`
  mutation UpsertTopTrackCount($trackId: String!) {
    upsertTopTrackCount(trackId: $trackId)
  }
`);
