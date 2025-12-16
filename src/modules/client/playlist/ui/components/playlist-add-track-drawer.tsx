"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { suggestedTracksForPlaylistOptions } from "@/gql/options/client-options";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { Music2Icon, SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { addToPlaylistMutationOptions } from "@/gql/options/client-mutation-options";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";

interface PlaylistAddTrackDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistId: string;
  playlistName: string;
}

interface SuggestedTrack {
  id: string;
  name: string;
  coverImage: string | null;
  isExplicit: boolean;
  artist: string;
  checkTrackInFavorite: boolean;
}

const PlaylistAddTrackDrawer = ({ open, onOpenChange, playlistId, playlistName }: PlaylistAddTrackDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent>
        <DrawerHeader className="border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <DrawerTitle className="text-main-white text-xl">Suggested Tracks</DrawerTitle>
              <DrawerDescription className="text-gray-400">
                Browse and add tracks to &quot;{playlistName}&quot;
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <XIcon className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <Suspense fallback={<DrawerContentSkeleton />}>
          <DrawerContentSuspense playlistId={playlistId} />
        </Suspense>
      </DrawerContent>
    </Drawer>
  );
};

const DrawerContentSkeleton = () => {
  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-y-auto p-4">
      <div className="relative">
        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search tracks..."
          className="border-gray-700 bg-gray-800 pl-10 text-white placeholder-gray-400"
          disabled
        />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-main-dark-bg flex items-center gap-3 rounded-lg p-3">
            <div className="primary_gradient size-12 shrink-0 animate-pulse rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

const DrawerContentSuspense = ({ playlistId }: { playlistId: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDebounced] = useDebounce(searchQuery, 300);
  const { data } = useSuspenseQuery(suggestedTracksForPlaylistOptions(playlistId, searchQueryDebounced));
  const queryClient = useQueryClient();

  const { mutate: addToPlaylist, isPending } = useMutation({
    ...addToPlaylistMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist-detail"] });
      queryClient.invalidateQueries({ queryKey: ["playlist-detail-tracklist"] });
      queryClient.invalidateQueries({ queryKey: ["suggested-tracks-for-playlist"] });
      toast.success("Track added to playlist successfully!");
    },
    onError: (error) => {
      console.error("Failed to add track to playlist:", error);
      toast.error("Failed to add track to playlist. Please try again.");
    },
  });

  const tracks: SuggestedTrack[] =
    data.tracks?.items
      ?.filter((track): track is NonNullable<typeof track> => track !== null)
      .map((track) => ({
        id: track.id,
        name: track.name,
        coverImage: track.coverImage || null,
        isExplicit: track.isExplicit,
        artist:
          track.mainArtists?.items
            ?.map((a) => a?.stageName)
            .filter(Boolean)
            .join(", ") || "Unknown Artist",
        checkTrackInFavorite: track.checkTrackInFavorite,
      })) || [];

  const handleAddTrack = (trackId: string) => {
    addToPlaylist({ playlistId, trackId });
  };

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-y-auto p-4">
      {/* Search Box */}
      <div className="relative">
        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-gray-700 bg-gray-800 pl-10 text-white placeholder-gray-400"
        />
      </div>

      {/* Track List */}
      <div className="space-y-2">
        {tracks.length > 0 ? (
          tracks.map((track) => <TrackItem key={track.id} track={track} onAdd={handleAddTrack} isPending={isPending} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-400">No tracks found</p>
            <p className="text-sm text-gray-500">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface TrackItemProps {
  track: SuggestedTrack;
  onAdd: (trackId: string) => void;
  isPending: boolean;
}

const TrackItem = ({ track, onAdd, isPending }: TrackItemProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = () => {
    setIsAdding(true);
    onAdd(track.id);
    // Reset after a delay to allow for visual feedback
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="group flex items-center gap-3 rounded-lg p-3 transition-colors">
      {/* Track Cover */}
      <div className="relative size-12 shrink-0">
        {track.coverImage ? (
          <Image
            src={track.coverImage}
            alt={track.name}
            width={48}
            height={48}
            className="size-12 rounded-md object-cover"
          />
        ) : (
          <div className="primary_gradient size-12 rounded-md" />
        )}
      </div>

      {/* Track Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-main-white line-clamp-1 text-sm font-medium">{track.name}</p>
          {track.isExplicit && (
            <span className="rounded bg-gray-700 px-1.5 py-0.5 text-xs font-semibold text-gray-300">E</span>
          )}
        </div>
        <p className="line-clamp-1 text-xs text-gray-400">{track.artist}</p>
      </div>

      {/* Add Button */}
      <Button size="sm" onClick={handleClick} disabled={isPending || isAdding} variant={"ekofy"}>
        <Music2Icon />
        {isAdding ? "Adding..." : "Add"}
      </Button>
    </div>
  );
};

export default PlaylistAddTrackDrawer;
