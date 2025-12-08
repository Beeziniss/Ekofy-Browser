"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRelatedTracks } from "../../hooks/use-related-tracks";
import RelatedTrackCardFull from "../components/track-releated/related-track-card-full";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { trackDetailOptions } from "@/gql/options/client-options";
import { GraphQLTrack } from "@/utils/track-converter";

interface RelatedTracksViewProps {
  trackId: string;
}

// Helper type to extract track with id
type TrackWithId = { id: string } & Record<string, unknown>;

const RelatedTracksView = ({ trackId }: RelatedTracksViewProps) => {
  const [take, setTake] = useState(5);

  // Fetch original track info
  const { data: trackData } = useQuery(trackDetailOptions(trackId));
  const originalTrack = trackData?.tracks?.items?.[0];

  // Fetch current track's categoryIds
//   const { data: categoriesData } = useQuery(trackCategoriesOptions(trackId));
//   const categoryIds = categoriesData?.tracks?.items?.[0]?.categoryIds || [];

  const { relatedTracks, isLoading, error, totalCount } = useRelatedTracks({
    categoryIds: [],
    take,
    enabled: false,
  });

  const handleLoadMore = () => {
    setTake((prev) => prev + 5);
  };

  // Convert related tracks to queue format
  const trackQueue: GraphQLTrack[] =
    relatedTracks?.map((track) => {
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
              <p className="text-xs text-gray-400">Related tracks to:</p>
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
              <h1 className="text-3xl font-bold text-white">Related Tracks</h1>
              <p className="mt-1 text-sm text-gray-400">
                Tracks in similar categories
                {totalCount > 0 && ` • ${totalCount} tracks found`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {error ? (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-8 text-center">
            <p className="text-lg text-red-400">Failed to load related tracks</p>
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
        ) : !relatedTracks || relatedTracks.length === 0 ? (
          <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-12 text-center">
            <p className="text-lg text-gray-300">No related tracks available</p>
            <p className="mt-2 text-sm text-gray-500">
              This track may not have categories assigned or there are no other tracks in these categories
            </p>
          </div>
        ) : (
          <>
            {/* Track List */}
            <div className="space-y-2">
              {relatedTracks.map((track, index) => {
                const trackWithId = track as unknown as TrackWithId;
                const currentTrackId = trackWithId.id;
                if (!currentTrackId) return null;

                return (
                  <RelatedTrackCardFull
                    key={`${currentTrackId}-${index}`}
                    track={track}
                    trackQueue={trackQueue}
                  />
                );
              })}
            </div>

            {/* Load More Button */}
            {relatedTracks.length < totalCount && (
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
                    `Load More (${totalCount - relatedTracks.length} remaining)`
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

export default RelatedTracksView;
