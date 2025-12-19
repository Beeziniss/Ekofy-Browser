"use client";

import { useQuery } from "@tanstack/react-query";
import { albumDetailOptions } from "@/gql/options/client-options";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon, PenLineIcon, EllipsisIcon, LinkIcon, Trash2Icon } from "lucide-react";
import AlbumTrackTable, { AlbumTrack } from "../components/album-track-table";
import { useAudioStore } from "@/store";
import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import AlbumDeleteModal from "@/modules/client/albums/ui/components/album-delete-modal";

interface AlbumDetailViewProps {
  albumId: string;
}

const AlbumDetailView = ({ albumId }: AlbumDetailViewProps) => {
  const { data, isLoading, error } = useQuery(albumDetailOptions(albumId));
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { currentPlaylistId, isPlaying: globalIsPlaying, togglePlayPause, play, setPlaylist } = useAudioStore();

  const album = data?.albums?.items?.[0];
  const artists = album?.artists || [];
  const artistNames = artists.map((artist) => artist.stageName).join(", ");

  // Memoize tracks to prevent dependency changes on every render
  const tracks = useMemo(() => album?.tracks?.items || [], [album?.tracks?.items]);

  // Convert tracks to the format expected by AlbumTrackTable
  const albumTracks: AlbumTrack[] = useMemo(
    () =>
      tracks.map((track) => ({
        id: track.id,
        name: track.name,
        coverImage: track.coverImage,
        mainArtistIds: track.mainArtistIds,
        mainArtists: track.mainArtists
          ? {
              items: track.mainArtists.items?.map((artist) => ({
                id: artist.id,
                stageName: artist.stageName,
              })),
            }
          : undefined,
      })),
    [tracks],
  );

  // Check if this album is currently playing
  const isAlbumPlaying = currentPlaylistId === albumId && globalIsPlaying;

  const handlePlayPause = () => {
    if (currentPlaylistId === albumId) {
      // If this album is already active, toggle play/pause
      togglePlayPause();
    } else {
      // Set up the album to play
      const tracksForQueue = albumTracks.map((track) => ({
        id: track.id,
        name: track.name || "Unknown Track",
        artist: track.mainArtists?.items?.[0]?.stageName || "Unknown Artist",
        coverImage: track.coverImage,
      }));

      setPlaylist(tracksForQueue, albumId);
      play();
    }
  };

  const onCopy = (e: React.MouseEvent) => {
    e.stopPropagation();

    navigator.clipboard.writeText(`${window.location.origin}/albums/${album?.id}`);
    toast.success("Copied!");
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-main-white text-lg">Loading album...</div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-main-white text-lg">Album not found</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 px-6 py-6">
      {/* Album Header */}
      <div className={"w-full space-y-6"}>
        <div className="flex gap-6">
          <div className="relative aspect-square size-70 flex-shrink-0">
            {album.coverImage ? (
              <Image
                src={album.coverImage}
                alt={album.name || "Album cover"}
                className="size-70 rounded-lg object-cover"
                width={280}
                height={280}
              />
            ) : (
              <div className="primary_gradient flex h-full w-full items-center justify-center rounded-lg">
                <span className="text-main-white/50 text-6xl">🎵</span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-end gap-4">
            <div className="space-y-2">
              <h1 className="text-main-white line-clamp-1 text-6xl font-bold">{album.name}</h1>
              {artistNames && <p className="text-main-white/80 text-lg">{artistNames}</p>}
            </div>

            <div className="flex items-center gap-4">
              <p className="text-main-white/60 text-base">
                {album.isVisible ? "Public" : "Private"} |{"  "}
                {album.createdAt && (
                  <>Updated: {formatDistanceToNow(album.updatedAt || album.createdAt, { addSuffix: true })}</>
                )}
              </p>
              <p className="text-main-white/60 text-sm">
                {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
              </p>
            </div>

            {album.description && (
              <p className="text-main-white mt-4 line-clamp-2 w-full text-base break-words">{album.description}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            className="bg-main-purple hover:bg-main-purple/90 size-12 rounded-full"
            onClick={handlePlayPause}
            disabled={tracks.length === 0}
          >
            {isAlbumPlaying ? (
              <PauseIcon className="size-7 fill-white text-white" />
            ) : (
              <PlayIcon className="size-7 fill-white text-white" />
            )}
          </Button>

          <Button size={"iconLg"} variant={"ghost"} className="rounded-full" onClick={() => {}}>
            <PenLineIcon className="text-main-white size-6" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"iconLg"} variant={"ghost"} className="rounded-full">
                <EllipsisIcon className="text-main-white size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" side="right">
              <DropdownMenuItem onClick={onCopy}>
                <LinkIcon className="text-main-white mr-2 size-4" />
                <span className="text-main-white text-sm">Copy link</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteModalOpen(true)}>
                <Trash2Icon className="text-main-white mr-2 size-4" />
                <span className="text-main-white text-sm">Delete this album</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Track Table */}
      <AlbumTrackTable tracks={albumTracks} albumId={albumId} albumName={album.name} />

      {/* Delete Modal */}
      <AlbumDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        albumId={albumId}
        albumName={album.name}
      />
    </div>
  );
};

export default AlbumDetailView;
