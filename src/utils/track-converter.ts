import { Track as StoreTrack } from "@/store/types/audio";

// GraphQL Track type (from TrackListHomeQuery)
export type GraphQLTrack = {
  __typename?: "Track";
  id: string;
  name: string;
  coverImage: string;
  mainArtistIds: Array<string>;
  mainArtistsAsync?: {
    __typename?: "MainArtistsAsyncCollectionSegment";
    items?: Array<{
      __typename?: "Artist";
      id: string;
      stageName: string;
    }> | null;
  } | null;
};

/**
 * Converts GraphQL Track to Store Track format
 */
export const convertGraphQLTrackToStore = (
  gqlTrack: GraphQLTrack,
): StoreTrack => {
  return {
    id: gqlTrack.id,
    name: gqlTrack.name,
    artist:
      gqlTrack.mainArtistsAsync?.items
        ?.map((a) => a?.stageName)
        .filter(Boolean)
        .join(", ") || "Unknown Artist",
    coverImage: gqlTrack.coverImage,
  };
};

/**
 * Converts array of GraphQL Tracks to Store Track format
 */
export const convertGraphQLTracksToStore = (
  gqlTracks: GraphQLTrack[],
): StoreTrack[] => {
  return gqlTracks.map(convertGraphQLTrackToStore);
};
