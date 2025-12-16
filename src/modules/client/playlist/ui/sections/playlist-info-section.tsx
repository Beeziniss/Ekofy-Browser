"use client";

import { Button } from "@/components/ui/button";
import { playlistDetailOptions } from "@/gql/options/client-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { EllipsisIcon, LinkIcon, PenLineIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Suspense, useState, useEffect } from "react";
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
import { usePlaylistPlayback } from "../../hooks/use-playlist-playback";
import { PauseButtonMedium, PlayButtonMedium } from "@/assets/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

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
        <Button variant="ghost" size="iconLg" className="text-main-white mt-auto duration-0 hover:brightness-90">
          <PlayButtonMedium className="size-12" />
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

const PlaylistInfoSectionSuspense = ({ playlistId }: PlaylistInfoSectionProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { data } = useSuspenseQuery(playlistDetailOptions(playlistId));
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Use custom hook for playlist playback functionality
  const { isPlaylistCurrentlyPlaying, isPlaying, playlistTracks, handlePlayPause } = usePlaylistPlayback(playlistId);

  const playlistData = data?.playlists?.items?.[0];

  // Access control for private playlists
  useEffect(() => {
    if (!playlistData) return;

    // If the playlist is private
    if (!playlistData.isPublic) {
      // If user is not authenticated, redirect to landing page
      if (!isAuthenticated) {
        router.push("/landing");
        return;
      }

      // If user is authenticated but not the owner, redirect to unauthorized
      if (playlistData.userId !== user?.userId) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [playlistData, isAuthenticated, user, router]);

  // Handle play/pause click for playlist
  const handlePlayPauseClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await handlePlayPause();
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

    navigator.clipboard.writeText(`${window.location.origin}/playlists/${playlistData?.id}`);
    toast.success("Copied!");
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-end gap-x-8">
        <Image
          src={playlistData?.coverImage || "https://placehold.co/280"}
          alt={playlistData?.name || "Playlist Cover"}
          className="size-70 rounded-md object-cover"
          width={280}
          height={280}
          unoptimized
        />

        <div className="flex flex-1 flex-col gap-y-6">
          <h1 className="text-main-white line-clamp-1 text-6xl font-bold">
            {playlistData?.name || "Untitled Playlist"}
          </h1>

          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-3">
              <Avatar className="size-8">
                <AvatarImage
                  src={
                    playlistData?.artist?.[0]?.avatarImage ||
                    playlistData?.listener?.[0]?.avatarImage ||
                    "https://placehold.co/32"
                  }
                  alt="User avatar"
                />
                <AvatarFallback>
                  {
                    (playlistData?.artist?.[0]?.stageName ||
                      playlistData?.listener?.[0]?.displayName ||
                      playlistData?.user?.[0]?.fullName ||
                      "A")[0]
                  }
                </AvatarFallback>
              </Avatar>
              <span className="text-main-white text-base font-medium">
                {playlistData?.artist?.[0]?.stageName ||
                  playlistData?.listener?.[0]?.displayName ||
                  playlistData?.user?.[0]?.fullName ||
                  "Anonymous"}
              </span>
            </div>
            <div className="text-main-grey mt-2 text-base">{playlistData?.tracks?.totalCount || 0} tracks</div>
            <div className="text-main-grey text-base">
              {playlistData?.isPublic ? "Public" : "Private"} | Updated:{" "}
              {formatDistanceToNow(playlistData?.updatedAt || playlistData?.createdAt, { addSuffix: true })}
            </div>
            <div className="text-main-white mt-4 line-clamp-2 w-full text-base break-words">
              {playlistData?.description || "No description provided."}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        {playlistTracks && playlistTracks.length > 0 && (
          <Button
            variant="ghost"
            size="iconLg"
            onClick={handlePlayPauseClick}
            className="text-main-white mt-auto duration-0 hover:brightness-90"
          >
            {isPlaylistCurrentlyPlaying && isPlaying ? (
              <PauseButtonMedium className="size-12" />
            ) : (
              <PlayButtonMedium className="size-12" />
            )}
          </Button>
        )}

        <Button size={"iconLg"} variant={"ghost"} className="rounded-full" onClick={handleEditClick}>
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
              <span className="text-main-white text-sm">Delete this playlist</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Edit Playlist Modal */}
      {playlistData && (
        <PlaylistManagementModal
          mode="edit"
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          initialData={playlistForEdit}
          onSuccess={() => {
            // The modal handles query invalidation internally
          }}
        />
      )}

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
