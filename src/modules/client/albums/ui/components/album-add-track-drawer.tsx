"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { Music2Icon, SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { addTracksToAlbumMutationOptions } from "@/gql/options/client-mutation-options";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { execute } from "@/gql/execute";
import { AlbumDetailQuery } from "@/modules/shared/queries/client/album-queries";
import { TrackListWithFiltersQuery } from "@/modules/shared/queries/artist/track-queries";
import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { TrackFilterInput, SortEnumType, RestrictionType } from "@/gql/graphql";

interface AlbumAddTrackDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumId: string;
  albumName: string;
}

interface SuggestedTrack {
  id: string;
  name: string;
  coverImage: string | null;
  isExplicit: boolean;
  artist: string;
  checkTrackInFavorite: boolean;
}

// Query option for suggested tracks for albums - filtered by artist
const suggestedTracksForAlbumOptions = (albumId: string, artistId: string, nameUnsigned: string = "", take: number = 12) =>
  queryOptions({
    queryKey: ["suggested-tracks-for-album", albumId, artistId, nameUnsigned],
    queryFn: async () => {
      // First, fetch the current tracks in the album
      const albumData = await execute(AlbumDetailQuery, {
        where: { id: { eq: albumId } },
        take: 1,
      });
      const existingTrackIds = albumData.albums?.items?.[0]?.trackIds || [];

      // Build the where filter with artist and exclusions
      const whereFilter: TrackFilterInput = {
        and: [
          { releaseInfo: { isRelease: { eq: true } } },
          { restriction: { type: { eq: RestrictionType.None } } },
        ],
        nameUnsigned: { contains: nameUnsigned },
      };

      // Add exclusion filter if there are existing tracks
      if (existingTrackIds.length > 0) {
        whereFilter.and?.push({ id: { nin: existingTrackIds } });
      }

      // Add artist filter if artistId is provided
      if (artistId) {
        whereFilter.or = [
          { mainArtistIds: { some: { eq: artistId } } },
          { featuredArtistIds: { some: { eq: artistId } } },
        ];
      }

      // Fetch tracks filtered by artist using TrackListWithFiltersQuery
      return await execute(TrackListWithFiltersQuery, {
        skip: 0,
        take,
        where: whereFilter,
        order: [{ createdAt: SortEnumType.Desc }],
      });
    },
  });

const AlbumAddTrackDrawer = ({ open, onOpenChange, albumId, albumName }: AlbumAddTrackDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent>
        <DrawerHeader className="border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <DrawerTitle className="text-main-white text-xl">Suggested Tracks</DrawerTitle>
              <DrawerDescription className="text-gray-400">
                Browse and add tracks to &quot;{albumName}&quot;
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <XIcon className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <Suspense fallback={<DrawerContentSkeleton />}>
            <DrawerContentInner albumId={albumId} albumName={albumName} onOpenChange={onOpenChange} />
          </Suspense>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

interface DrawerContentInnerProps {
  albumId: string;
  albumName: string;
  onOpenChange: (open: boolean) => void;
}

const DrawerContentInner = ({ albumId }: DrawerContentInnerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const artistId = user?.artistId || "";

  const { data } = useSuspenseQuery(suggestedTracksForAlbumOptions(albumId, artistId, debouncedSearchQuery));

  const tracks = data?.tracks?.items || [];

  const { mutate: addTrack, isPending } = useMutation({
    ...addTracksToAlbumMutationOptions,
    onSuccess: () => {
      toast.success("Track added to album");
      queryClient.invalidateQueries({ queryKey: ["album-detail", albumId] });
      queryClient.invalidateQueries({ queryKey: ["suggested-tracks-for-album", albumId] });
    },
    onError: () => {
      toast.error("Failed to add track to album");
    },
  });

  const handleAddTrack = (trackId: string) => {
    addTrack({
      albumId,
      trackId,
    });
  };

  const suggestedTracks: SuggestedTrack[] = tracks.map((track) => ({
    id: track.id,
    name: track.name,
    coverImage: track.coverImage,
    isExplicit: track.isExplicit,
    artist: track.mainArtists?.items?.[0]?.stageName || "Unknown Artist",
    checkTrackInFavorite: track.checkTrackInFavorite,
  }));

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-gray-700 bg-gray-800 pl-10 text-white placeholder-gray-400"
        />
      </div>

      {/* Track Grid */}
      {suggestedTracks.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {suggestedTracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 rounded-lg border border-transparent  p-3 transition-colors hover:border-main-purple/50"
            >
              <div className="relative size-16 flex-shrink-0">
                {track.coverImage ? (
                  <Image
                    src={track.coverImage}
                    alt={track.name}
                    fill
                    className="rounded-md object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="primary_gradient flex size-full items-center justify-center rounded-md">
                    <Music2Icon className="h-6 w-6 text-white/50" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-main-white truncate text-sm font-medium">{track.name}</p>
                  {track.isExplicit && (
                    <span className="rounded bg-gray-600 px-1.5 py-0.5 text-xs text-white">E</span>
                  )}
                </div>
                <p className="truncate text-xs text-gray-400">{track.artist}</p>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="text-main-purple hover:text-main-purple/80 flex-shrink-0"
                onClick={() => handleAddTrack(track.id)}
                disabled={isPending}
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Music2Icon className="mb-3 h-12 w-12 text-gray-600" />
          <p className="text-main-white mb-1 text-lg font-medium">
            {searchQuery ? "No tracks found" : "No suggested tracks available"}
          </p>
          <p className="text-sm text-gray-400">
            {searchQuery ? "Try a different search term" : "All available tracks are already in this album"}
          </p>
        </div>
      )}
    </div>
  );
};

const DrawerContentSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 p-3">
            <Skeleton className="size-16 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumAddTrackDrawer;

