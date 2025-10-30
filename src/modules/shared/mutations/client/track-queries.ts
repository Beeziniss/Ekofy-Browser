import { graphql } from "@/gql";

export const FavoriteTrackMutation = graphql(`
  mutation FavoriteTrack($trackId: String!, $isAdding: Boolean!) {
    addToFavoriteTrack(trackId: $trackId, isAdding: $isAdding)
  }
`);
