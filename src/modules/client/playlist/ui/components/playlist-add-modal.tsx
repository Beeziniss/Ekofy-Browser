"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { playlistBriefOptions, checkTrackInPlaylistOptions } from "@/gql/options/client-options";
import { addToPlaylistMutationOptions, removeFromPlaylistMutationOptions } from "@/gql/options/client-mutation-options";
import { toast } from "sonner";
import { SearchIcon, PlusIcon, LockIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store";

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackId: string;
  trigger?: React.ReactNode;
}

const PlaylistAddModal = ({ open, onOpenChange, trackId, trigger }: PlaylistAddModalProps) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAuthStore();

  const { data: playlistsData, isLoading } = useQuery({
    ...playlistBriefOptions(user?.userId || ""),
    enabled: isAuthenticated && !!user?.userId,
  });
  const { data: trackInPlaylistsData } = useQuery({
    ...checkTrackInPlaylistOptions(trackId),
    enabled: isAuthenticated && !!user?.userId,
  });

  const { mutate: addToPlaylist, isPending: isAddingToPlaylist } = useMutation({
    ...addToPlaylistMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist-detail"] });
      queryClient.invalidateQueries({
        queryKey: ["playlist-detail-tracklist"],
      });
      queryClient.invalidateQueries({
        queryKey: ["check-track-in-playlist", trackId],
      });
      // Don't close modal after successful addition
      toast.success("Track added to playlist successfully!");
    },
    onError: (error) => {
      console.error("Failed to add track to playlist:", error);
      toast.error("Failed to add track to playlist. Please try again.");
    },
  });

  const { mutate: removeFromPlaylist, isPending: isRemovingFromPlaylist } = useMutation({
    ...removeFromPlaylistMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist-detail"] });
      queryClient.invalidateQueries({
        queryKey: ["playlist-detail-tracklist"],
      });
      queryClient.invalidateQueries({
        queryKey: ["check-track-in-playlist", trackId],
      });
      // Don't close modal after successful removal
      toast.success("Track removed from playlist successfully!");
    },
    onError: (error) => {
      console.error("Failed to remove track from playlist:", error);
      toast.error("Failed to remove track from playlist. Please try again.");
    },
  });

  const playlists = playlistsData?.playlists?.items || [];
  const trackInPlaylistsIds = trackInPlaylistsData?.playlists?.items?.map((p) => p.id) || [];

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isPending = isAddingToPlaylist || isRemovingFromPlaylist;

  const isTrackInPlaylist = (playlistId: string) => {
    return trackInPlaylistsIds.includes(playlistId);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylist({
      playlistId,
      trackId,
    });
  };

  const handleRemoveFromPlaylist = (playlistId: string) => {
    removeFromPlaylist({
      playlistId,
      trackId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent className="w-full sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add to playlist</DialogTitle>
          <DialogDescription className="text-main-grey">Choose a playlist to add this track to</DialogDescription>
        </DialogHeader>

        <Separator className="-mx-6 mb-4 bg-neutral-700 data-[orientation=horizontal]:w-[calc(100%+48px)]" />

        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Playlist List */}
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-gray-400">Loading playlists...</div>
          ) : filteredPlaylists.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-gray-400">
              {searchQuery ? "No playlists found" : "No playlists available"}
            </div>
          ) : (
            filteredPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-neutral-800"
              >
                <div className="flex items-center gap-3">
                  <div className="relative size-12 overflow-hidden rounded-md">
                    <Image
                      src={playlist.coverImage || "https://placehold.co/48"}
                      alt={playlist.name}
                      width={48}
                      height={48}
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{playlist.name}</span>
                    <div className="flex items-center gap-2">
                      {!playlist.isPublic && (
                        <Badge variant="secondary" className="flex items-center gap-1 px-1.5 py-0.5 text-xs">
                          <LockIcon className="size-3" />
                          Private
                        </Badge>
                      )}
                      {isTrackInPlaylist(playlist.id) && (
                        <Badge
                          variant="default"
                          className="bg-main-purple/20 text-main-purple flex items-center gap-1 px-1.5 py-0.5 text-xs"
                        >
                          <CheckIcon className="size-3" />
                          Added
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {isTrackInPlaylist(playlist.id) ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveFromPlaylist(playlist.id)}
                    disabled={isPending}
                    className="text-red-400 hover:bg-red-500/20 hover:text-red-500"
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    disabled={isPending}
                    className="hover:bg-main-purple/20 hover:text-main-purple"
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistAddModal;
