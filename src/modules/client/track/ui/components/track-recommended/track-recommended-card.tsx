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
import { useProcessTrackDiscoveryPopularity, useProcessTrackEngagementPopularity } from "@/gql/client-mutation-options/popularity-mutation-option";
import { PopularityActionType } from "@/gql/graphql";

type ArtistInfo = {
  id: string;
  stageName: string;
};

interface RecommendedTrackCardProps {
  trackId: string;
  coverImage?: string;
  trackName?: string;
  artists: (ArtistInfo | null)[];
  trackQueue?: GraphQLTrack[];
  checkTrackInFavorite?: boolean;
  favoriteCount?: number;
  streamCount?: number;
  categories?: Array<{ id: string; name?: string | null } | null>;
}

const RecommendedTrackCard = React.memo(
  ({
    trackId,
    coverImage,
    trackName,
    artists,
    trackQueue,
    checkTrackInFavorite,
    favoriteCount,
    streamCount,
    categories,
  }: RecommendedTrackCardProps) => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuthStore();
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [authDialogAction, setAuthDialogAction] = useState<"play" | "favorite">("play");
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const { mutate: trackEngagementPopularity } = useProcessTrackEngagementPopularity();
    const { mutate: trackDiscoveryPopularity } = useProcessTrackDiscoveryPopularity();

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
          artists
            ?.map((a) => a?.stageName)
            .filter(Boolean)
            .join(", ") || "Unknown Artist",
        coverImage: coverImage,
      }),
      [trackId, trackName, artists, coverImage],
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
          trackId,
          isAdding: !checkTrackInFavorite,
        });
      },
      [isAuthenticated, trackId, checkTrackInFavorite, favoriteTrack],
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

    const artistLinks = artists.filter(Boolean) as ArtistInfo[];

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
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <Link href={`/track/${trackId}`} className="group/link hover:text-white hover:underline">
              <h4 className="line-clamp-1 text-sm font-semibold text-white transition-colors group-hover/link:text-primary-500">
                {trackName || "Unknown Track"}
              </h4>
            </Link>
            <div className="flex items-center gap-1 text-xs text-gray-400">
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
            
            {/* Categories */}
            {categories && categories.length > 0 && (
              <div className="mt-1 flex flex-wrap items-center gap-1">
                {categories.slice(0, 3).map((category, idx) => {
                  if (!category?.name) return null;
                  return (
                    <span
                      key={category.id || idx}
                      className="rounded-full bg-primary-500/10 px-1.5 py-0.5 text-[10px] font-medium text-primary-500"
                    >
                      {category.name}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Stats */}
            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
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

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-main-purple"
              onClick={handleFavoriteClick}
              disabled={isFavoriting}
            >
              <Heart
                className={`h-4 w-4 ${checkTrackInFavorite ? "fill-main-purple text-main-purple" : ""}`}
              />
            </Button>

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleAddToPlaylist}>
                  <ListPlus className="mr-2 h-4 w-4" />
                  <span>Add to playlist</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCopy}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  <span>Copy track link</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                  <Link href={`/track/${trackId}`} onClick={handleTrackAddPopularity}>View track details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="mr-2 h-4 w-4" />
                  <span>Report</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

RecommendedTrackCard.displayName = "RecommendedTrackCard";

export default RecommendedTrackCard;
