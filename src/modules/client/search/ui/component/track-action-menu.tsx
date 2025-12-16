"use client";

import React, { useState } from "react";
import {
  MoreHorizontal,
  Plus,
  Heart,
  Search,
  Eye,
  CheckIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { SearchTrackItem } from "@/types/search";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { playlistBriefOptions, checkTrackInPlaylistOptions } from "@/gql/options/client-options";
import { addToPlaylistMutationOptions, removeFromPlaylistMutationOptions } from "@/gql/options/client-mutation-options";
import { useAuthStore } from "@/store";
import { toast } from "sonner";
import { useProcessTrackEngagementPopularity } from "@/gql/client-mutation-options/popularity-mutation-option";
import { PopularityActionType } from "@/gql/graphql";
import Image from "next/image";
import { useFavoriteSearch } from "../../hooks/use-favorite-search";
import { useAuthAction } from "@/hooks/use-auth-action";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TrackActionMenuProps {
  track: SearchTrackItem;
}

export const TrackActionMenu: React.FC<TrackActionMenuProps> = ({ track }) => {
  const [playlistSearch, setPlaylistSearch] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Auth action hooks
  const { showWarningDialog, setShowWarningDialog, warningAction, trackName, executeWithAuth } = useAuthAction();
  const { mutate: trackEngagementPopularity } = useProcessTrackEngagementPopularity();

  // Favorite hooks
  const { handleFavoriteTrack } = useFavoriteSearch();

  // Real playlist data from GraphQL
  const { data: playlistsData, isLoading: isLoadingPlaylists } = useQuery({
    ...playlistBriefOptions(user?.userId || ""),
    enabled: !!user?.userId,
  });

  const { data: trackInPlaylistsData } = useQuery({
    ...checkTrackInPlaylistOptions(track.id),
    enabled: !!user?.userId,
  });

  // Mutations for playlist operations
  const { mutate: addToPlaylist, isPending: isAddingToPlaylist } = useMutation({
    ...addToPlaylistMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist-detail"] });
      queryClient.invalidateQueries({ queryKey: ["playlist-detail-tracklist"] });
      queryClient.invalidateQueries({ queryKey: ["check-track-in-playlist", track.id] });
      toast.success("Track added to playlist successfully!");
      // Track popularity
      trackEngagementPopularity({
        trackId: track.id,
        actionType: PopularityActionType.AddToPlaylist,
      });
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
      queryClient.invalidateQueries({ queryKey: ["playlist-detail-tracklist"] });
      queryClient.invalidateQueries({ queryKey: ["check-track-in-playlist", track.id] });
      toast.success("Track removed from playlist successfully!");
      // Track popularity
      trackEngagementPopularity({
        trackId: track.id,
        actionType: PopularityActionType.RemoveFromPlaylist,
      });
    },
    onError: (error) => {
      console.error("Failed to remove track from playlist:", error);
      toast.error("Failed to remove track from playlist. Please try again.");
    },
  });

  // Get playlists and track status
  const playlists = playlistsData?.playlists?.items || [];
  const trackInPlaylistsIds = trackInPlaylistsData?.playlists?.items?.map((p) => p.id) || [];

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(playlistSearch.toLowerCase()),
  );

  const isPending = isAddingToPlaylist || isRemovingFromPlaylist;

  const isTrackInPlaylist = (playlistId: string) => {
    return trackInPlaylistsIds.includes(playlistId);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylist({
      playlistId,
      trackId: track.id,
    });
  };

  const handleRemoveFromPlaylist = (playlistId: string) => {
    removeFromPlaylist({
      playlistId,
      trackId: track.id,
    });
  };

  const handleFavoriteClick = () => {
    executeWithAuth(
      () => {
        handleFavoriteTrack({
          id: track.id,
          name: track.name,
          checkTrackInFavorite: track.checkTrackInFavorite,
        });
      },
      "favorite",
      track.name,
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100">
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[280px]">
          <DropdownMenuItem onClick={() => router.push(`/track/${track.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>View detail</span>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add to playlist</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-[300px] max-h-[400px] overflow-y-auto">
              <div className="px-3 pb-2">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Find a playlist"
                    value={playlistSearch}
                    onChange={(e) => setPlaylistSearch(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
              </div>

              {isLoadingPlaylists ? (
                <div className="px-4 py-2 text-sm text-gray-400">Loading playlists...</div>
              ) : filteredPlaylists.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-400">
                  {playlistSearch ? "No playlists found" : "No playlists available"}
                </div>
              ) : (
                filteredPlaylists.map((playlist) => {
                  const inPlaylist = isTrackInPlaylist(playlist.id);
                  return (
                    <DropdownMenuItem
                      key={playlist.id}
                      onClick={() => {
                        executeWithAuth(
                          () => {
                            if (inPlaylist) {
                              handleRemoveFromPlaylist(playlist.id);
                            } else {
                              handleAddToPlaylist(playlist.id);
                            }
                          },
                          "playlist",
                          track.name,
                        );
                      }}
                      disabled={isPending}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {playlist.coverImage ? (
                            <Image
                              src={playlist.coverImage}
                              alt={playlist.name}
                              width={16}
                              height={16}
                              className="h-4 w-4 rounded object-cover"
                            />
                          ) : (
                            <div className="h-4 w-4 rounded bg-gray-600"></div>
                          )}
                          <span className="truncate">{playlist.name}</span>
                          <span>                      
                          {!playlist.isPublic && (
                          <Badge variant="secondary" className="flex items-center gap-1 px-1.5 py-0.5 text-xs">
                            Private
                          </Badge>
                      )}</span >
                        </div>
                        {inPlaylist && <CheckIcon className="h-4 w-4 text-green-500" />}
                      </div>
                    </DropdownMenuItem>
                  );
                })
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem onClick={handleFavoriteClick}>
            <Heart className="mr-2 h-4 w-4" />
            <span>{track.checkTrackInFavorite ? "Remove from Liked Songs" : "Save to your Liked Songs"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <WarningAuthDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        action={warningAction}
        trackName={trackName}
      />
    </>
  );
};
