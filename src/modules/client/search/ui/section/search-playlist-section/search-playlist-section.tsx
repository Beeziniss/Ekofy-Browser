import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisIcon,
  HeartIcon,
  LinkIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";
import { SearchPlaylistItem } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from "sonner";
import { usePlaylistPlayback } from "@/modules/client/playlist/hooks/use-playlist-playback";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playlistFavoriteMutationOptions } from "@/gql/options/client-mutation-options";
import { useAuthStore } from "@/store";

interface SearchPlaylistSectionProps {
  playlists: SearchPlaylistItem[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export const SearchPlaylistSection: React.FC<SearchPlaylistSectionProps> = ({
  playlists,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage
}) => {
  // Auto-load more when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetchingNextPage) {
        return;
      }
      
      if (hasNextPage && fetchNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Filter only public playlists
  const publicPlaylists = playlists.filter(playlist => playlist.isPublic === true);

  if (publicPlaylists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No public playlists found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
        {publicPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="text-center py-4">
          <p className="text-gray-400">Loading more playlists...</p>
        </div>
      )}

      {/* Load more button */}
      {hasNextPage && !isFetchingNextPage && (
        <div className="text-center py-4">
          <Button 
            variant="outline" 
            onClick={fetchNextPage}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            Load More Playlists
          </Button>
        </div>
      )}
    </div>
  );
};

// Individual Playlist Card Component
interface PlaylistCardProps {
  playlist: SearchPlaylistItem;
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Use custom hook for playlist playback functionality
  const {
    isPlaylistCurrentlyPlaying,
    isPlaying,
    handlePlayPause,
  } = usePlaylistPlayback(playlist.id);

  // Check if current user is the owner of the playlist
  const isOwnPlaylist = user?.userId === playlist.user[0]?.id;

  // State for favorite status with optimistic updates
  const [isFavorited, setIsFavorited] = useState(false);

  // Favorite playlist mutation
  const { mutate: favoritePlaylist, isPending: isFavoriting } = useMutation({
    ...playlistFavoriteMutationOptions,
    onMutate: async () => {
      // Optimistic update
      setIsFavorited(!isFavorited);
    },
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["playlists-home"],
      });
      queryClient.invalidateQueries({
        queryKey: ["playlist-detail", playlist.id],
      });
      toast.success(
        isFavorited
          ? "Added to your favorites!"
          : "Removed from your favorites!",
      );
    },
    onError: () => {
      // Revert optimistic update on error
      setIsFavorited(isFavorited);
      toast.error("Failed to update favorite status. Please try again.");
    },
  });

  // Handle play/pause click for playlist
  const handlePlayPauseClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handlePlayPause();
  };

  // Handle favorite button click
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavoriting) return; // Prevent multiple clicks

    favoritePlaylist({
      playlistId: playlist.id,
      isAdding: !isFavorited,
    });
  };

  const onCopy = (e: React.MouseEvent) => {
    e.stopPropagation();

    navigator.clipboard.writeText(
      `${window.location.origin}/playlists/${playlist.id}`,
    );
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
          {/* Always show play button for playlists that might have tracks */}
          <Button
            onClick={handlePlayPauseClick}
            className={`bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity`}
          >
            {isPlaylistCurrentlyPlaying && isPlaying ? (
              <PauseIcon className="text-main-dark-bg fill-main-dark-bg size-6" />
            ) : (
              <PlayIcon className="text-main-dark-bg fill-main-dark-bg size-6" />
            )}
          </Button>

          {playlist.isPublic && !isOwnPlaylist && (
            <Button
              onClick={handleFavoriteClick}
              className={`bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity group-hover:opacity-100 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
            >
              <HeartIcon
                className={`size-5 ${
                  isFavorited
                    ? "text-main-purple fill-main-purple"
                    : "text-main-dark-bg"
                }`}
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

      <p className="text-main-grey text-xs">
        By {playlist.user[0]?.fullName || 'Unknown'}
      </p>
    </div>
  );
};