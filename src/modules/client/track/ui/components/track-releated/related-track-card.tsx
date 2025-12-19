"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Play, Pause, MoreHorizontal, Eye, LinkIcon } from "lucide-react";
import { useAudioStore, useAuthStore } from "@/store";
import { GraphQLTrack, convertGraphQLTracksToStore } from "@/utils/track-converter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteTrackMutationOptions } from "@/gql/options/client-mutation-options";
import { toast } from "sonner";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";
import { ReportDialog } from "@/modules/shared/ui/components/report-dialog";
import PlaylistAddModal from "@/modules/client/playlist/ui/components/playlist-add-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListPlus, Flag } from "lucide-react";
import { ReportRelatedContentType } from "@/gql/graphql";
import { TrackInfo } from "@/types";
import { useProcessTrackDiscoveryPopularity, useProcessTrackEngagementPopularity } from "@/gql/client-mutation-options/popularity-mutation-option";
import { PopularityActionType } from "@/gql/graphql";

interface RelatedTrackCardProps {
  track: TrackInfo;
  trackQueue?: GraphQLTrack[];
}

const RelatedTrackCard = React.memo(
  ({ track, trackQueue }: RelatedTrackCardProps) => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuthStore();
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [authDialogAction, setAuthDialogAction] = useState<"play" | "favorite">("play");
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const { mutate: trackEngagementPopularity } = useProcessTrackEngagementPopularity();
    const { mutate: trackDiscoveryPopularity } = useProcessTrackDiscoveryPopularity();

    const trackId = track.id || "";
    const trackName = track.name || "Unknown Track";
    const coverImage = track.coverImage;
    const checkTrackInFavorite = track.checkTrackInFavorite || false;
    const favoriteCount = track.favoriteCount || 0;
    const streamCount = track.streamCount || 0;

    // Extract artists
    const allArtists = React.useMemo(() => {
      const mainArtists = track.mainArtists?.items?.filter((a) => a) || [];
      const featuredArtists = track.featuredArtists?.items?.filter((a) => a) || [];
      return [...mainArtists, ...featuredArtists];
    }, [track.mainArtists?.items, track.featuredArtists?.items]);

    // Extract categories and tags
    const categories = track.categories?.items?.filter((c) => c && c.name) || [];

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
        queryClient.invalidateQueries({ queryKey: ["related-tracks"] });
        toast.success(checkTrackInFavorite ? "Removed from favorites" : "Added to favorites");
        trackEngagementPopularity({
          trackId,
          actionType: checkTrackInFavorite ? PopularityActionType.Unfavorite : PopularityActionType.Favorite,
        });
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

    const onCopy = (e: React.MouseEvent) => {
      e.stopPropagation();

      navigator.clipboard.writeText(window.location.href + `track/${trackId}`);
      toast.info("Copied!");
      // Track popularity for share action
      trackEngagementPopularity({
        trackId: trackId,
        actionType: PopularityActionType.Share,
      });
    };

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

    const handleTrackAddPopularity = () => {
      trackDiscoveryPopularity({
        trackId: trackId,
        actionType: PopularityActionType.Search,
      });
    };

    return (
      <>
        <div className="group relative flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-800/50">
          {/* Cover Image with Play Button Overlay */}
          <div className="relative h-16 w-16 flex-shrink-0">
            <Link href={`/track/${trackId}`}>
              <Image
                src={coverImage || "https://placehold.co/64x64"}
                alt={trackName || "Track"}
                width={64}
                height={64}
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
                <Pause className="h-6 w-6 fill-white text-white" />
              ) : (
                <Play className="h-6 w-6 fill-white text-white" />
              )}
            </button>
          </div>

          {/* Track Info */}
          <div className="flex min-w-0 flex-1 flex-col">
            <Link href={`/track/${trackId}`} className="line-clamp-1 text-sm font-medium hover:underline">
              {trackName}
            </Link>
            <div className="line-clamp-1 text-xs text-muted-foreground">
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
            {/* Categories and Tags */}
            {(categories.length > 0) && (
              <div className="mt-1 flex flex-wrap items-center gap-1">
                {categories
                  .filter((category): category is NonNullable<typeof category> => category !== null)
                  .map((category) => (
                    <span
                      key={category.id}
                      className="rounded-full bg-primary-500/10 px-1.5 py-0.5 text-[10px] font-medium text-primary-500"
                    >
                      {category.name}
                    </span>
                  ))}
              </div>
            )}

            {/* Stats */}
            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {favoriteCount?.toLocaleString() || 0}
              </span>
              <span className="flex items-center gap-1">
                <Play className="h-3 w-3" />
                {streamCount?.toLocaleString() || 0}
              </span>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-shrink-0 items-center gap-1">
            {/* Favorite Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleFavoriteClick}
              disabled={isFavoriting}
              className="h-8 w-8 text-gray-400 hover:text-main-purple"
            >
              <Heart className={`h-4 w-4 ${checkTrackInFavorite ? "fill-main-purple text-main-purple" : ""}`} />
            </Button>

            {/* More Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="opacity-0 transition-opacity group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleAddToPlaylist}>
                  <ListPlus className="mr-2 h-4 w-4" />
                  Add to playlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCopy}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/track/${trackId}`} onClick={handleTrackAddPopularity}>
                    <Eye className="mr-2 h-4 w-4" />
                    View details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="mr-2 h-4 w-4" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

RelatedTrackCard.displayName = "RelatedTrackCard";

export default RelatedTrackCard;
