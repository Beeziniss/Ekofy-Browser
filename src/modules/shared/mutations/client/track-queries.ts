import { graphql } from "@/gql";

export const FavoriteTrackMutation = graphql(`
  mutation FavoriteTrack($trackId: String!, $isAdding: Boolean!) {
    updateFavoriteCount(trackId: $trackId, isAdding: $isAdding)
  }
`);
