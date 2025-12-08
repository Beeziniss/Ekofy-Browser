"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRecommendedTracks } from "../../hooks/use-recommended-tracks";
import RecommendedTrackCardFull from "../components/track-recommended/track-recommended-card-full";
import { RecommendationAlgorithm } from "@/gql/graphql";
import { Loader2, ArrowLeft} from "lucide-react";
import { GraphQLTrack } from "@/utils/track-converter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { trackDetailOptions } from "@/gql/options/client-options";

interface RecommendedTracksViewProps {
  trackId: string;
}

// Helper type to extract track with id
type TrackWithId = { id: string } & Record<string, unknown>;

const RecommendedTracksView = ({ trackId }: RecommendedTracksViewProps) => {
  const [algorithm] = useState<RecommendationAlgorithm>(RecommendationAlgorithm.Cosine);
  const [take, setTake] = useState(5);

  // Fetch original track info
  const { data: trackData } = useQuery(trackDetailOptions(trackId));
  const originalTrack = trackData?.tracks?.items?.[0];

  const { recommendedTracks, isLoading, error, totalCount } = useRecommendedTracks({
    trackId,
    take,
    algorithm,
    limit: 5,
  });

  // Convert recommended tracks to queue format
  const trackQueue: GraphQLTrack[] =
    recommendedTracks?.map((track) => {
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
    }) || [];

  const handleLoadMore = () => {
    setTake((prev) => prev + 5);
  };

//   const getAlgorithmLabel = (algo: RecommendationAlgorithm) => {
//     switch (algo) {
//       case RecommendationAlgorithm.Cosine:
//         return "Cosine Similarity";
//       case RecommendationAlgorithm.Euclidean:
//         return "Euclidean Distance";
//       default:
//         return "Default";
//     }
//   };

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb & Original Track Info */}
        {originalTrack && (
          <div className="mb-6 flex items-center gap-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            <Image
              src={originalTrack.coverImage || "https://placehold.co/64x64"}
              alt={originalTrack.name}
              width={64}
              height={64}
              className="rounded object-cover"
              unoptimized
            />
            <div className="flex-1">
              <p className="text-xs text-gray-400">Recommendations based on:</p>
              <Link href={`/track/${trackId}`} className="group hover:text-white hover:underline">
                <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-primary-500">
                  {originalTrack.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-400">
                {originalTrack.mainArtists?.items
                  ?.map((artist: { stageName?: string }) => artist?.stageName)
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/track/${trackId}`}>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Recommended Tracks</h1>
              <p className="mt-1 text-sm text-gray-400">
                Based on audio features and similarity
                {totalCount > 0 && ` • ${totalCount} tracks found`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {error ? (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-8 text-center">
            <p className="text-lg text-red-400">Failed to load recommended tracks</p>
            <p className="mt-2 text-sm text-gray-400">Please try again later</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 rounded-lg bg-gray-800/50 p-4">
                <div className="h-16 w-16 rounded bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-700"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-700"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !recommendedTracks || recommendedTracks.length === 0 ? (
          <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-12 text-center">
            <p className="text-lg text-gray-300">No recommendations available</p>
            <p className="mt-2 text-sm text-gray-500">Try a different algorithm or check back later</p>
          </div>
        ) : (
          <>
            {/* Track List */}
            <div className="space-y-2">
              {recommendedTracks.map((track, index) => {
                const trackWithId = track as unknown as TrackWithId;
                const currentTrackId = trackWithId.id;
                if (!currentTrackId) return null;

                return (
                  <RecommendedTrackCardFull
                    key={`${currentTrackId}-${index}`}
                    track={track}
                    trackQueue={trackQueue}
                  />
                );
              })}
            </div>

            {/* Load More Button */}
            {recommendedTracks.length < totalCount && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Load More (${totalCount - recommendedTracks.length} remaining)`
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendedTracksView;
