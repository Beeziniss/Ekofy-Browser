import { graphql } from "@/gql";

export const UpsertStreamCountMutation = graphql(`
  mutation UpsertStreamCount($trackId: String!) {
    upsertStreamCount(trackId: $trackId)
  }
`);
