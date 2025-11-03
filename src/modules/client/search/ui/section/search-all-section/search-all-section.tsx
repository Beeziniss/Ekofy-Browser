import React, { useState } from "react";
import Link from "next/link";
import { TrackActionMenu } from "../../component/track-action-menu";
import { Button } from "@/components/ui/button";
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
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import {
  SearchTrackItem,
  SearchArtistItem,
  SearchPlaylistItem,
} from "@/types/search";
import { useTrackPlayback } from "@/hooks/use-track-playback";
import { usePlaylistPlayback } from "@/modules/client/playlist/hooks/use-playlist-playback";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playlistFavoriteMutationOptions } from "@/gql/options/client-mutation-options";
import { useAuthStore, useAudioStore } from "@/store";
import { formatDuration } from "@/utils/duration-utils";

interface SearchAllSectionProps {
  query: string;
  tracks: SearchTrackItem[];
  artists: SearchArtistItem[];
  playlists: SearchPlaylistItem[];
  isLoading?: boolean;
}

export const SearchAllSection: React.FC<SearchAllSectionProps> = ({
  query,
  tracks,
  artists,
  playlists,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-1/4 rounded bg-gray-700"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-700"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
            {/* Playlists */}
      {playlists.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Playlists</h2>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&type=playlists`}
              className="text-sm font-medium text-gray-400 hover:text-white"
            >
              Show all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {playlists.slice(0, 6).map((playlist) => (
              <PlaylistCardAll key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h2 className="text-xl font-bold text-white">Playlists</h2>
          <p className="py-2 text-center text-gray-400">No playlists found</p>
        </div>
      )}

      {/* Artists */}
      {artists.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Artists</h2>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&type=artists`}
              className="text-sm font-medium text-gray-400 hover:text-white"
            >
              Show all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {artists.slice(0, 6).map((artist) => (
              <ArtistCardAll key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h2 className="text-xl font-bold text-white">Artists</h2>
          <p className="py-2 text-center text-gray-400">No artists found</p>
        </div>
      )}

      {/* Songs */}
      {tracks.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Songs</h2>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&type=songs`}
              className="text-sm font-medium text-gray-400 hover:text-white"
            >
              Show all
            </Link>
          </div>
          <div className="relative w-full">
            <div className="relative w-full">
              <table className="w-full caption-bottom text-sm">
                <TableBody>
                  {tracks.slice(0, 4).map((track, index) => (
                    <TrackRowAll key={track.id} track={track} index={index} />
                  ))}
                </TableBody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h2 className="text-xl font-bold text-white">Songs</h2>
          <p className="py-2 text-center text-gray-400">No tracks found</p>
        </div>
      )}
    </div>
  );
};

// Track Row Component for All section
interface TrackRowAllProps {
  track: SearchTrackItem;
  index: number;
}

const TrackRowAll = ({ track, index }: TrackRowAllProps) => {
  const { duration } = useAudioStore();
  
  const {
    isTrackCurrentlyPlaying,
    isPlaying,
    handlePlayPause,
  } = useTrackPlayback(track.id, {
    id: track.id,
    name: track.name,
    coverImage: track.coverImage,
    mainArtists: track.mainArtists,
  });

  const formatCreatedAt = (createdAt: string) => {
    /* const date = new Date(addedTime);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`; */

    return new Date(createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePlayPauseClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handlePlayPause();
  };

  // Use real duration if track is currently playing, otherwise fallback
  const displayDuration = isTrackCurrentlyPlaying && duration > 0
    ? formatDuration(duration)
    : formatCreatedAt(track.createdAt);

  return (
    <TableRow className="group relative border-b border-gray-800/50 hover:bg-gray-800/50">
      <TableCell className="w-12 text-center">
        <div className="flex h-8 w-8 items-center justify-center">
          <span className={`text-sm text-gray-400 group-hover:hidden ${isTrackCurrentlyPlaying && isPlaying ? "text-main-purple" : ""}`}>
            {isTrackCurrentlyPlaying && isPlaying ? "♪" : index + 1}
          </span>
          <div className="hidden group-hover:block">
            <Button
              onClick={handlePlayPauseClick}
              className="bg-transparent hover:bg-gray-700 p-0 w-8 h-8 rounded-full"
            >
              {isTrackCurrentlyPlaying && isPlaying ? (
                <PauseIcon className="text-white w-4 h-4" />
              ) : (
                <PlayIcon className="text-white w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center space-x-3">
          <Image
            src={track.coverImage || "/default-track.png"}
            alt={track.name}
            width={40}
            height={40}
            className="h-10 w-10 flex-shrink-0 rounded object-cover"
          />
          <div className="min-w-0">
            <p className={`truncate font-medium ${isTrackCurrentlyPlaying && isPlaying ? "text-main-purple" : "text-white"}`}>
              {track.name}
            </p>
            <p className="truncate text-sm text-gray-400">
              {track.mainArtists?.items?.[0]?.stageName || "Unknown Artist"}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="relative text-right">
        <div className="flex items-center justify-end space-x-2">
          <span className="text-sm text-gray-400">{displayDuration}</span>
          <div className="relative z-10 opacity-0 transition-opacity group-hover:opacity-100">
            <TrackActionMenu track={track} isVisible={false} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

// Artist Card Component for All section
interface ArtistCardAllProps {
  artist: SearchArtistItem;
}

const ArtistCardAll = ({ artist }: ArtistCardAllProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleArtistClick = () => {
    // TODO: Navigate to artist detail page when implemented
    console.log(`Navigate to artist: ${artist.stageName} (${artist.id})`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <div 
      className="flex flex-col items-center space-y-3 p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group"
      onClick={handleArtistClick}
    >
      <div className="relative w-full aspect-square">
        {artist.avatarImage ? (
          <Image
            src={artist.avatarImage}
            alt={artist.stageName}
            width={200}
            height={200}
            className="w-full h-full rounded-full object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-200"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-200">
            {artist.stageName.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* Bottom center icons - only show on hover */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Play artist's top tracks
              console.log(`Play ${artist.stageName}'s music`);
            }}
            className="bg-white hover:bg-gray-100 text-black size-12 rounded-full shadow-lg"
          >
            <PlayIcon className="w-8 h-8 fill-current" />
          </Button>
          
          <Button
            onClick={handleFavoriteClick}
            className="bg-white hover:bg-gray-100 text-black size-12 rounded-full shadow-lg"
          >
            <HeartIcon
              className={`w-6 h-6 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center w-full">
        <h3 className="text-white font-semibold text-sm truncate w-full group-hover:text-purple-300 hover:underline transition-colors duration-200">
          {artist.stageName}
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          {artist.followerCount?.toLocaleString() || '0'} fans
        </p>
      </div>
    </div>
  );
};

// Playlist Card Component for All section  
interface PlaylistCardAllProps {
  playlist: SearchPlaylistItem;
}

const PlaylistCardAll = ({ playlist }: PlaylistCardAllProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    isPlaylistCurrentlyPlaying,
    isPlaying,
    handlePlayPause,
  } = usePlaylistPlayback(playlist.id);

  const isOwnPlaylist = user?.userId === playlist.user[0]?.id;
  const [isFavorited, setIsFavorited] = useState(false);

  const { mutate: favoritePlaylist, isPending: isFavoriting } = useMutation({
    ...playlistFavoriteMutationOptions,
    onMutate: async () => {
      setIsFavorited(!isFavorited);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playlists-home"],
      });
      toast.success(
        isFavorited ? "Added to your favorites!" : "Removed from your favorites!",
      );
    },
    onError: () => {
      setIsFavorited(isFavorited);
      toast.error("Failed to update favorite status. Please try again.");
    },
  });

  const handlePlayPauseClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handlePlayPause();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavoriting) return;

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
          <Button
            onClick={handlePlayPauseClick}
            className="bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity"
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
