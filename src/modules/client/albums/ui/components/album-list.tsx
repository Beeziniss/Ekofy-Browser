"use client";

import { InfiniteData } from "@tanstack/react-query";
import { AlbumsQuery } from "@/gql/graphql";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon, MusicIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { albumDetailOptions } from "@/gql/options/client-options";
import { useAudioStore } from "@/store";
import { toast } from "sonner";
import { useState } from "react";

interface AlbumListProps {
  data: InfiniteData<AlbumsQuery>;
}

const AlbumList = ({ data }: AlbumListProps) => {
  const albums = data.pages.flatMap((page) => page.albums?.items ?? []);
  const { currentPlaylistId, isPlaying: globalIsPlaying, togglePlayPause, play, setPlaylist } = useAudioStore();
  const queryClient = useQueryClient();
  const [loadingAlbumId, setLoadingAlbumId] = useState<string | null>(null);

  if (albums.length === 0) {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">No albums found</p>
      </div>
    );
  }

  const handlePlayPauseClick = async (e: React.MouseEvent, albumId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const isAlbumPlaying = currentPlaylistId === albumId && globalIsPlaying;

    if (isAlbumPlaying) {
      togglePlayPause();
      return;
    }

    setLoadingAlbumId(albumId);
    try {
      // Fetch album tracks using queryClient
      const tracksData = await queryClient.fetchQuery(albumDetailOptions(albumId));
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

      setPlaylist(tracksForQueue, albumId);
      play();
    } catch (error) {
      console.error("Failed to load album tracks:", error);
      toast.error("Failed to load album tracks");
    } finally {
      setLoadingAlbumId(null);
    }
  };

  return (
    <>
      {albums.map((album) => {
        const isAlbumPlaying = currentPlaylistId === album.id && globalIsPlaying;
        const isLoading = loadingAlbumId === album.id;

        return (
          <div key={album.id} className="flex w-full flex-col space-y-2.5">
            <Link
              key={album?.id}
              href={`/albums/${album.id}`}
              className="group relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-md transition-opacity after:absolute after:inset-0 after:rounded-md after:bg-black after:opacity-0 after:content-[''] hover:after:opacity-20"
            >
              {album?.coverImage ? (
                <Image
                  src={album.coverImage}
                  alt={album.name || "Album cover"}
                  className="aspect-square h-full w-full rounded-md object-cover"
                  width={300}
                  height={300}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <MusicIcon className="text-main-white/50 size-7" />
                </div>
              )}

              <div className="absolute bottom-2 left-2 z-10">
                <Button
                  onClick={(e) => handlePlayPauseClick(e, album.id)}
                  disabled={isLoading}
                  className="bg-main-white hover:bg-main-white flex size-12 items-center justify-center rounded-full transition-opacity"
                >
                  {isLoading ? (
                    <div className="border-main-dark-bg h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                  ) : isAlbumPlaying ? (
                    <PauseIcon className="size-7 fill-black text-black" />
                  ) : (
                    <PlayIcon className="size-7 fill-black text-black" />
                  )}
                </Button>
              </div>
            </Link>

            <div className="flex flex-col gap-y-1">
              <Link
                href={`/albums/${album.id}`}
                className={`truncate text-sm font-medium hover:underline ${isAlbumPlaying ? "text-main-purple" : "text-main-white hover:text-main-purple"}`}
              >
                {album?.name}
              </Link>
              {album?.description && (
                <p className="text-main-white/60 truncate text-xs">{album.isVisible ? "Public" : "Private"}</p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default AlbumList;
