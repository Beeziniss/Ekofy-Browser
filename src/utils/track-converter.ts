import { Track as StoreTrack } from "@/store/types/audio";

// GraphQL Track type
export type GraphQLTrack = {
  id: string;
  name: string;
  coverImage?: string;
  artist: Array<{ id: string; stageName: string } | null>;
};

/**
 * Converts GraphQL Track to Store Track format
 */
export const convertGraphQLTrackToStore = (
  gqlTrack: GraphQLTrack,
): StoreTrack => {
  return {
    id: gqlTrack.id,
    title: gqlTrack.name,
    artist:
      gqlTrack.artist
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
