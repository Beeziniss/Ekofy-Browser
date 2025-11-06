import React, { useEffect } from "react";
import { Clock, PauseIcon, PlayIcon } from "lucide-react";
import { TrackActionMenu } from "../../component/track-action-menu";
import { Button } from "@/components/ui/button";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { SearchTrackItem } from "@/types/search";
import { useTrackPlayback } from "@/hooks/use-track-playback";
import { useAudioStore } from "@/store";
import { formatDuration } from "@/utils/duration-utils";
import { AuthDialogProvider } from "../../context/auth-dialog-context";
import { useSearchAuth } from "../../../hooks/use-search-auth";

interface SearchTrackSectionProps {
  tracks: SearchTrackItem[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export const SearchTrackSection: React.FC<SearchTrackSectionProps> = ({
  tracks,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  return (
    <AuthDialogProvider>
      <SearchTrackSectionContent
        tracks={tracks}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </AuthDialogProvider>
  );
};

// Main content component
const SearchTrackSectionContent: React.FC<SearchTrackSectionProps> = ({
  tracks,
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

  if (tracks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No tracks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        {/* Custom table wrapper to allow dropdown overflow */}
        <div className="relative w-full">
          <table className="w-full caption-bottom text-sm">
            <TableHeader>
              <TableRow className="border-b border-gray-700 hover:bg-transparent">
                <TableHead className="w-12 text-center text-gray-400">#</TableHead>
                <TableHead className="text-gray-400">Title</TableHead>
                <TableHead className="text-gray-400">Album</TableHead>
                <TableHead className="w-20 text-center text-gray-400">
                  <Clock className="mx-auto h-4 w-4" />
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.map((track, index) => (
                <TrackRowWithAuth key={track.id} track={track} index={index} />
              ))}
            </TableBody>
          </table>
        </div>
      </div>

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="py-4 text-center">
          <p className="text-gray-400">Loading more tracks...</p>
        </div>
      )}

      {/* Load more button (backup for auto-scroll) */}
      {hasNextPage && !isFetchingNextPage && (
        <div className="py-4 text-center">
          <Button variant="outline" onClick={fetchNextPage} className="border-gray-600 text-white hover:bg-gray-700">
            Load More Tracks
          </Button>
        </div>
      )}
    </div>
  );
};

// Individual Track Row Component
interface TrackRowProps {
  track: SearchTrackItem;
  index: number;
}

const TrackRow = ({ track, index }: TrackRowProps) => {
  // Auth action hooks using context
  const { executeWithAuth } = useSearchAuth();

  // Use track playback hook for this specific track
  const { isTrackCurrentlyPlaying, isPlaying, handlePlayPause } = useTrackPlayback(track.id, {
    id: track.id,
    name: track.name,
    coverImage: track.coverImage,
    mainArtists: track.mainArtists,
  });

  // Get audio store for duration
  const { duration } = useAudioStore();

  const handlePlayPauseClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    executeWithAuth(
      async () => {
        await handlePlayPause();
      },
      "play",
      track.name,
    );
  };

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

  // Get duration to display
  const getDuration = () => {
    // If this track is currently playing and we have duration from audio store
    if (isTrackCurrentlyPlaying && duration > 0) {
      return formatDuration(duration);
    }
    // Default fallback duration (could be replaced with real duration from API in future)
    return formatCreatedAt(track.createdAt);
  };

  return (
    <TableRow className="group relative border-b border-gray-800/50 hover:bg-gray-800/50">
      <TableCell className="text-center">
        <div className="flex h-8 w-8 items-center justify-center">
          <span
            className={`text-sm text-gray-400 group-hover:hidden ${isTrackCurrentlyPlaying && isPlaying ? "text-main-purple" : ""}`}
          >
            {isTrackCurrentlyPlaying && isPlaying ? "♪" : index + 1}
          </span>
          <div className="hidden group-hover:block">
            <Button
              onClick={handlePlayPauseClick}
              className="h-8 w-8 rounded-full bg-transparent p-0 hover:bg-gray-700"
            >
              {isTrackCurrentlyPlaying && isPlaying ? (
                <PauseIcon className="h-4 w-4 text-white" />
              ) : (
                <PlayIcon className="h-4 w-4 text-white" />
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
            <p
              className={`truncate font-medium ${isTrackCurrentlyPlaying && isPlaying ? "text-main-purple" : "text-white"}`}
            >
              {track.name}
            </p>
            <p className="truncate text-sm text-gray-400">
              {track.mainArtists?.items?.[0]?.stageName || "Unknown Artist"}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <p className="truncate text-sm text-gray-400">
          {track.name} {/* Album name could be added to GraphQL query */}
        </p>
      </TableCell>

      <TableCell className="text-center">
        <span className="text-sm text-gray-400">{getDuration()}</span>
      </TableCell>

      <TableCell className="relative">
        <div className="relative z-10 opacity-0 transition-opacity group-hover:opacity-100">
          <TrackActionMenu track={track} isVisible={true} />
        </div>
      </TableCell>
    </TableRow>
  );
};

// Add WarningAuthDialog component outside of TrackRow
const TrackRowWithAuth = ({ track, index }: TrackRowProps) => {
  return <TrackRow track={track} index={index} />;
};
