import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisIcon,
  HeartIcon,
  LinkIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { usePlaylistPlayback } from "../../hooks/use-playlist-playback";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playlistFavoriteMutationOptions } from "@/gql/options/client-mutation-options";
import { useAuthStore } from "@/store";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";

interface PlaylistCardProps {
  playlist: {
    __typename?: "Playlist" | undefined;
    id: string;
    name: string;
    coverImage?: string | null | undefined;
    isPublic: boolean;
    userId: string;
    checkPlaylistInFavorite?: boolean;
  };
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPlayWarning, setShowPlayWarning] = useState(false);
  const [showFavoriteWarning, setShowFavoriteWarning] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // Use custom hook for playlist playback functionality
  const {
    isPlaylistCurrentlyPlaying,
    isPlaying,
    handlePlayPause,
    playlistTracks,
  } = usePlaylistPlayback(playlist.id);

  // Check if current user is the owner of the playlist
  const isOwnPlaylist = user?.userId === playlist.userId;

  // State for favorite status with optimistic updates
  const [isFavorited, setIsFavorited] = useState(
    playlist.checkPlaylistInFavorite || false,
  );

  // Favorite playlist mutation
  const { mutate: favoritePlaylist, isPending: isFavoriting } = useMutation({
    ...playlistFavoriteMutationOptions,
    onMutate: async () => {
      // Optimistic update
      setIsFavorited(!isFavorited);
    },
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["playlists-home"],
      });
      queryClient.invalidateQueries({
        queryKey: ["playlist-detail", playlist.id],
      });
      toast.success(
        isFavorited
          ? "Added to your favorites!"
          : "Removed from your favorites!",
      );
    },
    onError: () => {
      // Revert optimistic update on error
      setIsFavorited(isFavorited);
      toast.error("Failed to update favorite status. Please try again.");
    },
  });

  // Handle play/pause click for playlist
  const handlePlayPauseClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowPlayWarning(true);
      return;
    }
    
    await handlePlayPause();
  };

  // Handle favorite button click
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowFavoriteWarning(true);
      return;
    }

    if (isFavoriting) return; // Prevent multiple clicks

    favoritePlaylist({
      playlistId: playlist.id,
      isAdding: !isFavorited,
    });
  };

  const onCopy = (e: React.MouseEvent) => {
    e.stopPropagation();

    navigator.clipboard.writeText(
      `${window.location.origin}/playlists/${playlist.id}`,
    );
    toast.success("Copied!");
  };

  return (
    <div key={playlist.id} className="flex w-full flex-col space-y-2.5">
      <Link
        href={`/playlists/${playlist.id}`}
        className={`group relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-md transition-opacity after:absolute after:inset-0 after:rounded-md after:bg-black after:content-[''] hover:after:opacity-20 ${isMenuOpen ? "after:opacity-20" : "after:opacity-0"}`}
      >
        <Image
          src={playlist.coverImage || "https://placehold.co/280"}
          alt={playlist.name}
          className="h-full w-full rounded-md object-cover"
          width={300}
          height={300}
          unoptimized
        />

        <div className="absolute bottom-2 left-2 flex items-center gap-x-2">
          {playlistTracks && playlistTracks.length > 0 && (
            <Button
              onClick={handlePlayPauseClick}
              className={`bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity`}
            >
              {isPlaylistCurrentlyPlaying && isPlaying ? (
                <PauseIcon className="text-main-dark-bg fill-main-dark-bg size-6" />
              ) : (
                <PlayIcon className="text-main-dark-bg fill-main-dark-bg size-6" />
              )}
            </Button>
          )}

          {playlist.isPublic && !isOwnPlaylist && (
            <Button
              onClick={handleFavoriteClick}
              className={`bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity group-hover:opacity-100 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
            >
              <HeartIcon
                className={`size-5 ${
                  isFavorited
                    ? "text-main-purple fill-main-purple"
                    : "text-main-dark-bg"
                }`}
              />
            </Button>
          )}

          {playlist.isPublic && (
            <DropdownMenu onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity group-hover:opacity-100 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
                >
                  <EllipsisIcon className="text-main-dark-bg size-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-48">
                <DropdownMenuItem onClick={onCopy}>
                  <LinkIcon className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-sm">Copy link</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </Link>

      <Link
        href={`/playlists/${playlist.id}`}
        className={`hover:text-main-purple cursor-pointer text-sm hover:underline ${isPlaylistCurrentlyPlaying && isPlaying ? "text-main-purple" : "text-main-white"}`}
      >
        {playlist.name}
      </Link>

      <p className="text-main-grey text-xs">
        {playlist.isPublic ? "Public" : "Private"}
      </p>

      {/* Authentication Warning Dialogs */}
      <WarningAuthDialog
        open={showPlayWarning}
        onOpenChange={setShowPlayWarning}
        action="play"
      />

      <WarningAuthDialog
        open={showFavoriteWarning}
        onOpenChange={setShowFavoriteWarning}
        action="favorite"
      />
    </div>
  );
};

export default PlaylistCard;
