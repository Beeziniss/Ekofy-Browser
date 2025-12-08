"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { trackDetailOptions } from "@/gql/options/client-options";
import { useRelatedTracks } from "../../hooks/use-related-tracks";
import RelatedTrackCard from "../components/track-releated/related-track-card";
import { GraphQLTrack } from "@/utils/track-converter";

interface TrackRelatedSectionProps {
  trackId: string;
  take?: number;
}

// Helper type to extract track with id
type TrackWithId = { id: string } & Record<string, unknown>;

const TrackRelatedSection = ({ 
  trackId,
  take = 5,
}: TrackRelatedSectionProps) => {
  // Fetch the current track's categoryIds
  const { data: trackData } = useQuery(trackDetailOptions(trackId));
  const categoryIds = trackData?.tracks?.items?.[0]?.categoryIds || [];

  // Fetch related tracks using those categoryIds
  const { relatedTracks, isLoading: isLoadingRelated, error } = useRelatedTracks({
    categoryIds,
    take,
    enabled: categoryIds.length > 0,
  });

  if (error) {
    return (
      <div className="w-full space-y-4">
        <h2 className="text-sm font-bold uppercase text-white">Related Tracks</h2>
        <div className="rounded-md bg-red-500/10 p-4 text-center text-sm text-red-400">
          Failed to load related tracks
        </div>
      </div>
    );
  }

  if (isLoadingRelated) {
    return (
      <div className="w-full space-y-4">
        <h2 className="text-sm font-bold uppercase text-white">Related Tracks</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  if (!relatedTracks || relatedTracks.length === 0) {
    return (
      <div className="w-full space-y-4">
        <h2 className="text-sm font-bold uppercase text-white">Related Tracks</h2>
        <div className="rounded-md bg-gray-800/50 p-4 text-center text-sm text-gray-400">
          No related tracks available
        </div>
      </div>
    );
  }

  // Convert related tracks to queue format
  const trackQueue: GraphQLTrack[] = relatedTracks.map((track) => {
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
        <h2 className="text-sm font-bold uppercase text-white">Related Tracks</h2>
        <Link
          href={`/track/${trackId}/related`}
          className="text-primary-500 text-main-grey-dark-1 text-sm font-bold hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Track List */}
      <div className="flex flex-col">
        {relatedTracks.map((track, index) => {
          const trackWithId = track as unknown as TrackWithId;
          const currentTrackId = trackWithId.id;
          if (!currentTrackId) return null;

          return (
            <RelatedTrackCard
              key={`${currentTrackId}-${index}`}
              track={track}
              trackQueue={trackQueue}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TrackRelatedSection;
