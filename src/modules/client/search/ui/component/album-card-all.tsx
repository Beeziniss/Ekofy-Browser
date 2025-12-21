import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, HeartIcon, LinkIcon, MusicIcon, PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { SearchAlbumItem } from "@/types/search";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { albumDetailOptions } from "@/gql/options/client-options";
import { useAudioStore, useAuthStore } from "@/store";
import { useSearchAuth } from "../../hooks/use-search-auth";
import { useFavoriteSearch } from "../../hooks/use-favorite-search";

interface AlbumCardAllProps {
  album: SearchAlbumItem;
}

export const AlbumCardAll = ({ album }: AlbumCardAllProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const { executeWithAuth } = useSearchAuth();
  const { handleFavoriteAlbum } = useFavoriteSearch();
  const { currentPlaylistId, isPlaying: globalIsPlaying, togglePlayPause, play, setPlaylist } = useAudioStore();
  const queryClient = useQueryClient();

  const isAlbumPlaying = currentPlaylistId === album.id && globalIsPlaying;
  const [isFavorited, setIsFavorited] = useState(album.checkAlbumInFavorite || false);
  const isOwnAlbum = user?.userId === album.createdBy;

  const handlePlayPauseClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    executeWithAuth(
      async () => {
        if (isAlbumPlaying) {
          togglePlayPause();
          return;
        }

        // Fetch album tracks using queryClient
        const tracksData = await queryClient.fetchQuery(albumDetailOptions(album.id));
        const tracks = tracksData?.albums?.items?.[0]?.tracks?.items || [];

        if (tracks.length === 0) {
          toast.error("Album has no tracks");
          return;
        }

        // Convert tracks to the format expected by the audio store
        const tracksForQueue = tracks
          .filter((track) => track != null)
          .map((track) => ({
            id: track.id,
            name: track.name || "Unknown Track",
            artist:
              track.mainArtists?.items
                ?.map((a) => a?.stageName)
                .filter(Boolean)
                .join(", ") || "Unknown Artist",
            coverImage: track.coverImage || "",
          }));

        setPlaylist(tracksForQueue, album.id);
        play();
      },
      "play",
      album.name,
    );
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    executeWithAuth(
      () => {
        setIsFavorited(!isFavorited);
        handleFavoriteAlbum({
          id: album.id,
          name: album.name,
          checkAlbumInFavorite: album.checkAlbumInFavorite,
        });
      },
      "favorite",
      album.name,
    );
  };

  const onCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/albums/${album.id}`);
    toast.success("Copied!");
  };

  return (
    <div className="flex w-full flex-col space-y-2.5">
      <Link
        href={`/albums/${album.id}`}
        className={`group relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-md transition-opacity after:absolute after:inset-0 after:rounded-md after:bg-black after:content-[''] hover:after:opacity-20 ${isMenuOpen ? "after:opacity-20" : "after:opacity-0"}`}
      >
        {album.coverImage ? (
          <Image
            src={album.coverImage}
            alt={album.name}
            className="h-full w-full rounded-md object-cover"
            width={300}
            height={300}
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MusicIcon className="text-main-white/50 size-7" />
          </div>
        )}

        <div className="absolute bottom-2 left-2 flex items-center gap-x-2">
          <Button
            onClick={handlePlayPauseClick}
            className="bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity"
          >
            {isAlbumPlaying ? (
              <PauseIcon className="size-7 fill-black text-black" />
            ) : (
              <PlayIcon className="size-7 fill-black text-black" />
            )}
          </Button>

          {!isOwnAlbum && (
            <Button
              onClick={handleFavoriteClick}
              className={`bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity group-hover:opacity-100 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
            >
              <HeartIcon
                className={`size-5`}
                style={{
                  color: isFavorited ? "var(--color-main-purple)" : "#2a2a2a",
                  fill: isFavorited ? "var(--color-main-purple)" : "none",
                }}
              />
            </Button>
          )}

          {!isOwnAlbum && (
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
        href={`/albums/${album.id}`}
        className={`hover:text-main-purple cursor-pointer text-sm hover:underline ${isAlbumPlaying ? "text-main-purple" : "text-main-white"}`}
      >
        {album.name}
      </Link>

      <p className="text-main-grey text-xs">{album.isVisible ? "Public" : "Private"}</p>
    </div>
  );
};

