"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Play, Pause, ListPlus, Flag, ExternalLink, Link as LinkIcon } from "lucide-react";
import { useAudioStore, useAuthStore } from "@/store";
import { GraphQLTrack, convertGraphQLTracksToStore } from "@/utils/track-converter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteTrackMutationOptions } from "@/gql/options/client-mutation-options";
import { toast } from "sonner";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";
import { ReportDialog } from "@/modules/shared/ui/components/report-dialog";
import PlaylistAddModal from "@/modules/client/playlist/ui/components/playlist-add-modal";
import { Button } from "@/components/ui/button";
import { ReportRelatedContentType } from "@/gql/graphql";
import { TrackInfo } from "@/types";

interface RecommendedTrackCardFullProps {
  track: TrackInfo;
  trackQueue?: GraphQLTrack[];
}

const RecommendedTrackCardFull = React.memo(
  ({ track, trackQueue }: RecommendedTrackCardFullProps) => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuthStore();
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [authDialogAction, setAuthDialogAction] = useState<"play" | "favorite">("play");
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);

    const trackId = track.id || "";
    const trackName = track.name || "Unknown Track";
    const coverImage = track.coverImage;
    const checkTrackInFavorite = track.checkTrackInFavorite || false;
    const favoriteCount = track.favoriteCount || 0;
    const streamCount = track.streamCount || 0;

    // Extract artists
    const mainArtists = track.mainArtists?.items?.filter((a) => a) || [];
    const featuredArtists = track.featuredArtists?.items?.filter((a) => a) || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const allArtists = [...mainArtists, ...featuredArtists];

    // Audio store selectors
    const isCurrentTrack = useAudioStore((state) => state.currentTrack?.id === trackId);
    const globalIsPlaying = useAudioStore((state) => state.isPlaying);
    const setCurrentTrack = useAudioStore((state) => state.setCurrentTrack);
    const togglePlayPause = useAudioStore((state) => state.togglePlayPause);
    const play = useAudioStore((state) => state.play);
    const setQueue = useAudioStore((state) => state.setQueue);
    const skipToTrack = useAudioStore((state) => state.skipToTrack);

    const isPlaying = isCurrentTrack && globalIsPlaying;

    // Memoize track data
    const trackData = React.useMemo(
      () => ({
        id: trackId,
        name: trackName || "Unknown Track",
        artist:
          allArtists
            .map((a) => a?.stageName)
            .filter(Boolean)
            .join(", ") || "Unknown Artist",
        coverImage: coverImage || undefined,
      }),
      [trackId, trackName, allArtists, coverImage],
    );

    // Play/Pause handler
    const handlePlayPauseClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
          setAuthDialogAction("play");
          setShowAuthDialog(true);
          return;
        }

        if (isCurrentTrack) {
          togglePlayPause();
        } else {
          if (trackQueue && trackQueue.length > 0) {
            const queueTracks = convertGraphQLTracksToStore(trackQueue);
            setQueue(queueTracks);
            const trackIndex = queueTracks.findIndex((t) => t.id === trackId);
            if (trackIndex !== -1) {
              setTimeout(() => skipToTrack(trackIndex), 0);
            }
          } else {
            setCurrentTrack(trackData);
          }
          play();
        }
      },
      [
        isAuthenticated,
        isCurrentTrack,
        togglePlayPause,
        trackQueue,
        setQueue,
        trackId,
        skipToTrack,
        setCurrentTrack,
        trackData,
        play,
      ],
    );

    // Favorite mutation
    const { mutate: favoriteTrack, isPending: isFavoriting } = useMutation({
      ...favoriteTrackMutationOptions,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recommended-tracks"] });
        toast.success(checkTrackInFavorite ? "Removed from favorites" : "Added to favorites");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to update favorite status");
      },
    });

    const handleFavoriteClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
          setAuthDialogAction("favorite");
          setShowAuthDialog(true);
          return;
        }

        favoriteTrack({
          trackId,
          isAdding: !checkTrackInFavorite,
        });
      },
      [isAuthenticated, trackId, checkTrackInFavorite, favoriteTrack],
    );

    const handleAddToPlaylist = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isAuthenticated) {
        setAuthDialogAction("play");
        setShowAuthDialog(true);
        return;
      }
      setPlaylistModalOpen(true);
    }, [isAuthenticated]);

    const handleReport = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isAuthenticated) {
        setAuthDialogAction("play");
        setShowAuthDialog(true);
        return;
      }
      setReportDialogOpen(true);
    }, [isAuthenticated]);

    const handleCopyLink = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(`${window.location.origin}/track/${trackId}`);
      toast.success("Link copied to clipboard");
    }, [trackId]);

    const artistLinks = allArtists.filter((a): a is NonNullable<typeof a> => a !== null);

    return (
      <>
        <div className="group relative flex items-center gap-4 rounded-md border border-transparent p-3 transition-all hover:border-gray-700 hover:bg-gray-800/50">
          {/* Cover Image with Play Button Overlay */}
          <div className="relative h-20 w-20 flex-shrink-0">
            <Link href={`/track/${trackId}`}>
              <Image
                src={coverImage || "https://placehold.co/80x80"}
                alt={trackName || "Track"}
                width={80}
                height={80}
                className="rounded object-cover"
                unoptimized
              />
            </Link>
            {/* Play/Pause Button Overlay */}
            <button
              onClick={handlePlayPauseClick}
              className="absolute inset-0 flex items-center justify-center rounded bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 fill-white text-white" />
              ) : (
                <Play className="h-8 w-8 fill-white text-white" />
              )}
            </button>
          </div>

          {/* Track Info */}
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <Link href={`/track/${trackId}`} className="group/link hover:text-white hover:underline">
              <h4 className="line-clamp-1 text-base font-semibold text-white transition-colors group-hover/link:text-primary-500">
                {trackName || "Unknown Track"}
              </h4>
            </Link>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              {artistLinks.length > 0 ? (
                artistLinks.map((artist, index) => (
                  <React.Fragment key={artist.id}>
                    <Link
                      href={`/artist/${artist.id}`}
                      className="hover:text-white hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {artist.stageName}
                    </Link>
                    {index < artistLinks.length - 1 && <span>, </span>}
                  </React.Fragment>
                ))
              ) : (
                <span>Unknown Artist</span>
              )}
            </div>
            {/* Stats */}
            <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
              {streamCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  {streamCount.toLocaleString()}
                </span>
              )}
              {favoriteCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {favoriteCount.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons - Always Visible */}
          <div className="flex items-center gap-2">
            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-400 hover:text-main-purple"
              onClick={handleFavoriteClick}
              disabled={isFavoriting}
              title="Like"
            >
              <Heart
                className={`h-5 w-5 ${checkTrackInFavorite ? "fill-main-purple text-main-purple" : ""}`}
              />
            </Button>

            {/* Add to Playlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-400 hover:text-white"
              onClick={handleAddToPlaylist}
              title="Add to playlist"
            >
              <ListPlus className="h-5 w-5" />
            </Button>

            {/* Copy Link Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-400 hover:text-white"
              onClick={handleCopyLink}
              title="Copy track link"
            >
              <LinkIcon className="h-5 w-5" />
            </Button>

            {/* View Details Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-400 hover:text-white"
              asChild
              title="View details"
            >
              <Link href={`/track/${trackId}`}>
                <ExternalLink className="h-5 w-5" />
              </Link>
            </Button>

            {/* Report Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-400 hover:text-red-500"
              onClick={handleReport}
              title="Report"
            >
              <Flag className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <WarningAuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          action={authDialogAction}
        />

        <PlaylistAddModal
          open={playlistModalOpen}
          onOpenChange={setPlaylistModalOpen}
          trackId={trackId}
        />

        <ReportDialog
          contentType={ReportRelatedContentType.Track}
          contentId={trackId}
          reportedUserId={""}
          reportedUserName={trackName || "Unknown Track"}
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
        />
      </>
    );
  },
);

RecommendedTrackCardFull.displayName = "RecommendedTrackCardFull";

export default RecommendedTrackCardFull;
