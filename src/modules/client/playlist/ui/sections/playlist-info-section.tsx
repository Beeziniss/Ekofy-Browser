"use client";

import { Button } from "@/components/ui/button";
import {
  playlistDetailOptions,
  playlistDetailTrackListOptions,
} from "@/gql/options/client-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  EllipsisIcon,
  LinkIcon,
  PenLineIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import { Suspense, useState } from "react";
import PlaylistManagementModal from "../components/playlist-management-modal";
import PlaylistDeleteModal from "../components/playlist-delete-modal";
import type { PlaylistData } from "../components/playlist-management-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudioStore, Track } from "@/store";

interface PlaylistInfoSectionProps {
  playlistId: string;
}

const PlaylistInfoSection = ({ playlistId }: PlaylistInfoSectionProps) => {
  return (
    <Suspense fallback={<PlaylistInfoSkeleton />}>
      <PlaylistInfoSectionSuspense playlistId={playlistId} />
    </Suspense>
  );
};

const PlaylistInfoSkeleton = () => {
  return (
    <div className="pointer-events-none w-full space-y-6">
      <div className="flex items-center gap-x-8">
        <Skeleton className="size-70 rounded-md" />

        <div className="flex flex-col gap-y-6">
          <Skeleton className="h-15 w-80 rounded-full" />

          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-3">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-2 h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <Button
          variant="ghost"
          size="iconLg"
          className="text-main-white mt-auto duration-0 hover:brightness-90"
        >
          <Image
            src={"/play-button-medium.svg"}
            alt="Ekofy Play Button"
            width={48}
            height={48}
          />
        </Button>

        <div className="flex size-12 items-center justify-center">
          <PenLineIcon className="text-main-white size-6" />
        </div>

        <div className="flex size-12 items-center justify-center">
          <EllipsisIcon className="text-main-white size-6" />
        </div>
      </div>
    </div>
  );
};

const PlaylistInfoSectionSuspense = ({
  playlistId,
}: PlaylistInfoSectionProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { data } = useSuspenseQuery(playlistDetailOptions(playlistId));
  const { data: trackListData } = useSuspenseQuery(
    playlistDetailTrackListOptions(playlistId),
  );

  const playlistData = data?.playlists?.items?.[0];
  const playlistTracks = trackListData?.playlists?.items?.[0]?.tracks?.items;

  const {
    currentTrack,
    isPlaying: globalIsPlaying,
    setCurrentTrack,
    togglePlayPause,
    play,
    setQueue,
  } = useAudioStore();

  // Check if any track from this playlist is currently playing
  const isPlaylistCurrentlyPlaying =
    playlistTracks?.some((track) => track?.id === currentTrack?.id) ?? false;

  // Convert playlist tracks to Track format for the store
  const convertToTrackFormat = (
    playlistTracks: Array<{
      id: string;
      name?: string | null;
      coverImage?: string | null;
      mainArtistsAsync?: {
        items?: Array<{
          stageName?: string | null;
        } | null> | null;
      } | null;
    } | null>,
  ): Track[] => {
    return playlistTracks
      .filter((track) => track != null)
      .map((track) => ({
        id: track.id,
        name: track.name || "Unknown Track",
        artist:
          track.mainArtistsAsync?.items
            ?.map((a) => a?.stageName)
            .filter(Boolean)
            .join(", ") || "Unknown Artist",
        coverImage: track.coverImage || "",
      }));
  };

  // Handle play/pause click for playlist
  const handlePlayPauseClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!playlistTracks || playlistTracks.length === 0) {
      toast.error("This playlist is empty");
      return;
    }

    // If a track from this playlist is currently playing, toggle play/pause
    if (isPlaylistCurrentlyPlaying) {
      togglePlayPause();
    } else {
      // Play the first track from the playlist and set the entire playlist as queue
      const tracksForQueue = convertToTrackFormat(playlistTracks);
      const firstTrack = tracksForQueue[0];

      if (firstTrack) {
        setCurrentTrack(firstTrack);
        setQueue(tracksForQueue);
        play();
      }
    }
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  // Prepare playlist data for the edit modal
  const playlistForEdit: PlaylistData | undefined = playlistData
    ? {
        id: playlistData.id,
        name: playlistData.name,
        description: playlistData.description || "",
        isPublic: playlistData.isPublic,
        coverImage: playlistData.coverImage || "https://placehold.co/280",
      }
    : undefined;

  const onCopy = (e: React.MouseEvent) => {
    e.stopPropagation();

    navigator.clipboard.writeText(
      `${window.location.origin}/playlists/${playlistData?.id}`,
    );
    toast.success("Copied!");
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-x-8">
        <Image
          src={playlistData?.coverImage || "https://placehold.co/280"}
          alt={playlistData?.name || "Playlist Cover"}
          className="size-70 rounded-md object-cover"
          width={280}
          height={280}
          unoptimized
        />

        <div className="flex flex-col gap-y-6">
          <h1 className="text-main-white text-6xl font-bold">
            {playlistData?.name || "Untitled Playlist"}
          </h1>

          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-3">
              <div className="bg-main-white flex size-8 items-center justify-center rounded-full">
                <UserIcon className="size-4 text-black" />
              </div>
              <span className="text-main-white text-base font-medium">
                {playlistData?.user[0]?.fullName || "Anonymous"}
              </span>
            </div>
            <div className="text-main-grey mt-2 text-base">
              {playlistData?.tracks?.totalCount || 0} tracks
            </div>
            <div className="text-main-grey text-base">
              {playlistData?.isPublic ? "Public" : "Private"} | Updated:{" "}
              {formatDistanceToNow(
                playlistData?.updatedAt || playlistData?.createdAt,
                { addSuffix: true },
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        <Button
          variant="ghost"
          size="iconLg"
          onClick={handlePlayPauseClick}
          className="text-main-white mt-auto duration-0 hover:brightness-90"
        >
          {isPlaylistCurrentlyPlaying && globalIsPlaying ? (
            <Image
              src={"/pause-button-medium.svg"}
              alt="Ekofy Pause Button"
              width={48}
              height={48}
            />
          ) : (
            <Image
              src={"/play-button-medium.svg"}
              alt="Ekofy Play Button"
              width={48}
              height={48}
            />
          )}
        </Button>

        <Button
          size={"iconLg"}
          variant={"ghost"}
          className="rounded-full"
          onClick={handleEditClick}
        >
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
            <DropdownMenuItem onClick={handleDeleteClick}>
              <Trash2Icon className="text-main-white mr-2 size-4" />
              <span className="text-main-white text-sm">
                Delete this playlist
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Edit Playlist Modal */}
      <PlaylistManagementModal
        mode="edit"
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        initialData={playlistForEdit}
        onSuccess={() => {
          // The modal handles query invalidation internally
        }}
      />

      {/* Delete Confirmation Modal */}
      {playlistData && (
        <PlaylistDeleteModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          playlistId={playlistData.id}
          playlistName={playlistData.name}
        />
      )}
    </div>
  );
};

export default PlaylistInfoSection;
