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

interface RelatedTrackCardFullProps {
  track: TrackInfo;
  trackQueue?: GraphQLTrack[];
}

const RelatedTrackCardFull = React.memo(
  ({ track, trackQueue }: RelatedTrackCardFullProps) => {
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

    // Extract categories and tags
    const categories = track.categories?.items?.filter((c) => c && c.name) || [];
    const tags = track.tags?.filter((t) => t) || [];

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
        name: trackName,
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
        queryClient.invalidateQueries({ queryKey: ["related-tracks"] });
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
          trackId: trackId,
          isAdding: !checkTrackInFavorite,
        });
      },
      [isAuthenticated, favoriteTrack, trackId, checkTrackInFavorite],
    );

    const handleCopyLink = useCallback(() => {
      const trackUrl = `${window.location.origin}/track/${trackId}`;
      navigator.clipboard.writeText(trackUrl);
      toast.success("Track link copied to clipboard");
    }, [trackId]);

    const handleAddToPlaylist = useCallback(() => {
      if (!isAuthenticated) {
        setAuthDialogAction("play");
        setShowAuthDialog(true);
        return;
      }
      setPlaylistModalOpen(true);
    }, [isAuthenticated]);

    const handleReport = useCallback(() => {
      if (!isAuthenticated) {
        setAuthDialogAction("play");
        setShowAuthDialog(true);
        return;
      }
      setReportDialogOpen(true);
    }, [isAuthenticated]);

    // Get the first artist's ID for reporting
    const firstArtistId = allArtists[0]?.id || "";

    return (
      <>
        <div className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-accent/50">
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
          <div className="flex min-w-0 flex-1 flex-col">
            <Link href={`/track/${trackId}`} className="line-clamp-1 text-base font-semibold hover:underline">
              {trackName}
            </Link>
            <div className="line-clamp-1 text-sm text-muted-foreground">
              {allArtists
                .map((artist, idx) => (
                  <Link
                    key={artist?.id || idx}
                    href={`/artist/${artist?.id}`}
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {artist?.stageName}
                  </Link>
                ))
                .reduce<React.ReactNode[]>(
                  (prev, curr, idx) => (idx === 0 ? [curr] : [...prev, <span key={`sep-${idx}`}>, </span>, curr]),
                  [],
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

            {/* Categories and Tags */}
            {(categories.length > 0 || tags.length > 0) && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {categories
                  .filter((category): category is NonNullable<typeof category> => category !== null)
                  .map((category) => (
                    <span
                      key={category.id}
                      className="rounded-full bg-primary-500/10 px-2 py-0.5 text-xs font-medium text-primary-500"
                    >
                      {category.name}
                    </span>
                  ))}
                {tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="rounded-full bg-gray-700/50 px-2 py-0.5 text-xs text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
                {tags.length > 3 && <span className="text-xs text-gray-500">+{tags.length - 3}</span>}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-shrink-0 items-center gap-1">
            {/* Favorite Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleFavoriteClick}
              disabled={isFavoriting}
              className="h-10 w-10 text-gray-400 hover:text-main-purple"
            >
              <Heart className={`h-5 w-5 ${checkTrackInFavorite ? "fill-main-purple text-main-purple" : ""}`} />
            </Button>

            {/* Add to Playlist Button */}
            <Button size="icon" variant="ghost" onClick={handleAddToPlaylist}>
              <ListPlus className="h-5 w-5" />
            </Button>

            {/* Copy Link Button */}
            <Button size="icon" variant="ghost" onClick={handleCopyLink}>
              <LinkIcon className="h-5 w-5" />
            </Button>

            {/* View Details Button */}
            <Button size="icon" variant="ghost" asChild>
              <Link href={`/track/${trackId}`}>
                <ExternalLink className="h-5 w-5" />
              </Link>
            </Button>

            {/* Report Button */}
            <Button size="icon" variant="ghost" onClick={handleReport}>
              <Flag className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Modals */}
        <WarningAuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          action={authDialogAction === "play" ? "play" : "favorite"}
        />

        <PlaylistAddModal open={playlistModalOpen} onOpenChange={setPlaylistModalOpen} trackId={trackId} />

        <ReportDialog
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          contentType={ReportRelatedContentType.Track}
          contentId={trackId}
          reportedUserId={firstArtistId}
        />
      </>
    );
  },
);

RelatedTrackCardFull.displayName = "RelatedTrackCardFull";

export default RelatedTrackCardFull;
