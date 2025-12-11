"use client";

import { useRecommendedTracks } from "../../hooks/use-recommended-tracks";
import RecommendedTrackCard from "../components/track-recommended/track-recommended-card";
import { RecommendationAlgorithm } from "@/gql/graphql";
import { Loader2 } from "lucide-react";
import { GraphQLTrack } from "@/utils/track-converter";
import Link from "next/link";

interface RecommendedTracksSectionProps {
  trackId: string;
  take?: number;
  algorithm?: RecommendationAlgorithm;
  limit?: number;
}

// Helper type to extract track with id
type TrackWithId = { id: string } & Record<string, unknown>;

const RecommendedTracksSection = ({
  trackId,
  take = 5,
  algorithm = RecommendationAlgorithm.Cosine,
  limit = 5,
}: RecommendedTracksSectionProps) => {
  const { recommendedTracks, isLoading, error } = useRecommendedTracks({
    trackId,
    take,
    algorithm,
    limit,
  });

  if (error) {
    return (
      <div className="w-full space-y-4">
        <h2 className="text-sm font-bold uppercase text-white">Recommended Tracks</h2>
        <div className="rounded-md bg-red-500/10 p-4 text-center text-sm text-red-400">
          Failed to load recommended tracks
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <h2 className="text-sm font-bold uppercase text-white">Recommended Tracks</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  if (!recommendedTracks || recommendedTracks.length === 0) {
    return (
      <div className="w-full space-y-4">
        <h2 className="text-sm font-bold uppercase text-white">Recommended Tracks</h2>
        <div className="rounded-md bg-gray-800/50 p-4 text-center text-sm text-gray-400">
          No recommendations available
        </div>
      </div>
    );
  }

  // Convert recommended tracks to queue format
  const trackQueue: GraphQLTrack[] = recommendedTracks.map((track) => {
    const trackWithId = track as unknown as TrackWithId;
    return {
      id: trackWithId.id || "",
      name: track.name || "Unknown Track",
      coverImage: track.coverImage || "",
      mainArtistIds: track.mainArtistIds || [],
      featuredArtistIds: track.featuredArtistIds || [],
      mainArtists: track.mainArtists || { items: [] },
      featuredArtists: track.featuredArtists || { items: [] },
      checkTrackInFavorite: track.checkTrackInFavorite || false,
      favoriteCount: track.favoriteCount || 0,
      streamCount: track.streamCount || 0,
      createdAt: track.createdAt || new Date().toISOString(),
      tags: track.tags || [],
      categoryIds: track.categoryIds || [],
      type: track.type || null,
      categories: track.categories || { items: [] },
    };
  });

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase text-white">Recommended Tracks</h2>
        <Link
          href={`/track/${trackId}/recommended`}
          className="text-primary-500 text-main-grey-dark-1 text-sm font-bold hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Track List */}
      <div className="flex flex-col">
        {recommendedTracks.map((track, index) => {
          const trackWithId = track as unknown as TrackWithId;
          const trackId = trackWithId.id;
          if (!trackId) return null;

          const mainArtists =
            track.mainArtists?.items?.map((artist) => ({
              id: artist?.id || "",
              stageName: artist?.stageName || "Unknown",
            })) || [];

          const featuredArtists =
            track.featuredArtists?.items?.map((artist) => ({
              id: artist?.id || "",
              stageName: artist?.stageName || "Unknown",
            })) || [];

          const allArtists = [...mainArtists, ...featuredArtists];

          const categories = track.categories?.items?.filter(Boolean) || [];

          return (
            <RecommendedTrackCard
              key={`${trackId}-${index}`}
              trackId={trackId}
              coverImage={track.coverImage || undefined}
              trackName={track.name || undefined}
              artists={allArtists}
              trackQueue={trackQueue}
              checkTrackInFavorite={track.checkTrackInFavorite || false}
              favoriteCount={track.favoriteCount || 0}
              streamCount={track.streamCount || 0}
              categories={categories}
            />
          );
        })}
      </div>

      {/* Footer - Algorithm Info */}
      {/* <div className="pt-2 text-center">
        <p className="text-xs text-gray-500">
          {algorithm === RecommendationAlgorithm.Cosine
            ? "Recommended based on audio similarity (Cosine)"
            : algorithm === RecommendationAlgorithm.Euclidean
              ? "Recommended based on audio similarity (Euclidean)"
              : "Recommended for you"}
        </p>
      </div> */}
    </div>
  );
};

export default RecommendedTracksSection;
