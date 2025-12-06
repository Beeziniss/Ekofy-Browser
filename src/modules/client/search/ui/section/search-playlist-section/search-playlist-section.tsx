import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, HeartIcon, LinkIcon, PauseIcon, PlayIcon } from "lucide-react";
import { SearchPlaylistItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { usePlaylistPlayback } from "@/modules/client/playlist/hooks/use-playlist-playback";
// import { useAuthStore } from "@/store";
import { useAuthAction } from "@/hooks/use-auth-action";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";
import { useFavoriteSearch } from "../../../hooks/use-favorite-search";

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
  fetchNextPage,
}) => {
  // Auto-load more when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
        isFetchingNextPage
      ) {
        return;
      }

      if (hasNextPage && fetchNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Filter only public playlists
  const publicPlaylists = playlists.filter((playlist) => playlist.isPublic === true);

  if (publicPlaylists.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No public playlists found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {publicPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="py-4 text-center">
          <p className="text-gray-400">Loading more playlists...</p>
        </div>
      )}

      {/* Load more button */}
      {hasNextPage && !isFetchingNextPage && (
        <div className="py-4 text-center">
          <Button variant="outline" onClick={fetchNextPage} className="border-gray-600 text-white hover:bg-gray-700">
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
  // const { user } = useAuthStore(); // Temporarily not used

  // Auth action hooks
  const { showWarningDialog, setShowWarningDialog, warningAction, trackName, executeWithAuth } = useAuthAction();

  // Favorite hooks
  const { handleFavoritePlaylist } = useFavoriteSearch();

  // Use custom hook for playlist playback functionality
  const { isPlaylistCurrentlyPlaying, isPlaying, handlePlayPause } = usePlaylistPlayback(playlist.id);

  // Check if current user is the owner of the playlist (for future use)
  // const isOwnPlaylist = user?.userId === playlist.user[0]?.id;

  // Handle play/pause click for playlist
  const handlePlayPauseClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    executeWithAuth(
      async () => {
        await handlePlayPause();
      },
      "play",
      playlist.name,
    );
  };

  // Handle favorite button click
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    executeWithAuth(
      () => {
        handleFavoritePlaylist({
          id: playlist.id,
          name: playlist.name,
          checkPlaylistInFavorite: playlist.checkPlaylistInFavorite,
        });
      },
      "favorite",
      playlist.name,
    );
  };

  const onCopy = (e: React.MouseEvent) => {
    e.stopPropagation();

    navigator.clipboard.writeText(`${window.location.origin}/playlists/${playlist.id}`);
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
          {/* Only show play button if playlist has tracks */}
          {playlist.tracksInfo.length > 0 && (
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
          )}

          {/* Show favorite button for public playlists (always show for testing) */}
          {playlist.isPublic && (
            <Button
              onClick={handleFavoriteClick}
              className={`bg-main-white hover:bg-main-white z-10 flex size-12 items-center justify-center rounded-full transition-opacity group-hover:opacity-100 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
            >
              <HeartIcon
                className={`size-5`}
                style={{
                  color: playlist.checkPlaylistInFavorite ? "var(--color-main-purple)" : "#2a2a2a",
                  fill: playlist.checkPlaylistInFavorite ? "var(--color-main-purple)" : "none",
                }}
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

      <p className="text-main-grey text-xs">By {playlist.user[0]?.fullName || "Unknown"}</p>

      <WarningAuthDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        action={warningAction}
        trackName={trackName}
      />
    </div>
  );
};
