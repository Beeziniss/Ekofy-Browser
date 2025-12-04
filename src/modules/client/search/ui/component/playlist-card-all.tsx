import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, HeartIcon, LinkIcon, PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { SearchPlaylistItem } from "@/types/search";
import { usePlaylistPlayback } from "@/modules/client/playlist/hooks/use-playlist-playback";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playlistFavoriteMutationOptions } from "@/gql/options/client-mutation-options";
import { useAuthStore } from "@/store";
import { useSearchAuth } from "../../hooks/use-search-auth";

interface PlaylistCardAllProps {
  playlist: SearchPlaylistItem;
}

export const PlaylistCardAll = ({ playlist }: PlaylistCardAllProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { executeWithAuth } = useSearchAuth();

  const { isPlaylistCurrentlyPlaying, isPlaying, handlePlayPause } = usePlaylistPlayback(playlist.id);

  const isOwnPlaylist = user?.userId === playlist.user[0]?.id;
  const [isFavorited, setIsFavorited] = useState(playlist.checkPlaylistInFavorite || false);

  const { mutate: favoritePlaylist, isPending: isFavoriting } = useMutation({
    ...playlistFavoriteMutationOptions,
    onMutate: async () => {
      setIsFavorited(!isFavorited);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playlists-home"],
      });
      toast.success(isFavorited ? "Added to your favorites!" : "Removed from your favorites!");
    },
    onError: () => {
      setIsFavorited(isFavorited);
      toast.error("Failed to update favorite status. Please try again.");
    },
  });

  const handlePlayPauseClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    executeWithAuth(
      async () => {
        await handlePlayPause();
      },
      "play",
      playlist.name,
    );
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavoriting) return;

    executeWithAuth(
      () => {
        favoritePlaylist({
          playlistId: playlist.id,
          isAdding: !isFavorited,
        });
      },
      "favorite",
      playlist.name,
    );
  };

  const onCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/playlists/${playlist.id}`);
    toast.success("Copied!");
  };

  return (
    <div className="flex w-full flex-col space-y-2.5">
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
          {/* Only show play button if playlist has tracks */}
          {playlist.tracksInfo.length > 0 && (
            <Button
              onClick={handlePlayPauseClick}
              className="bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity"
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
                className={`size-5`}
                style={{
                  color: playlist.checkPlaylistInFavorite ? "var(--color-main-purple)" : "#2a2a2a",
                  fill: playlist.checkPlaylistInFavorite ? "var(--color-main-purple)" : "none",
                }}
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

      <p className="text-main-grey text-xs">By {playlist.user[0]?.fullName || "Unknown"}</p>
    </div>
  );
};
