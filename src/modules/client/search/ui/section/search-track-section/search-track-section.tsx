import React, { useEffect } from 'react';
import { Clock, PauseIcon, PlayIcon } from 'lucide-react';
import { TrackActionMenu } from '../../component/track-action-menu';
import { Button } from '@/components/ui/button';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from 'next/image';
import { SearchTrackItem } from '@/types/search';
import { useTrackPlayback } from '@/hooks/use-track-playback';
import { useAudioStore } from '@/store';
import { formatDuration } from '@/utils/duration-utils';

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

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
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
              <TableRow className="hover:bg-transparent border-b border-gray-700">
                <TableHead className="w-12 text-center text-gray-400">#</TableHead>
                <TableHead className="text-gray-400">Title</TableHead>
                <TableHead className="text-gray-400">Album</TableHead>
                <TableHead className="w-20 text-center text-gray-400">
                  <Clock className="w-4 h-4 mx-auto" />
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.map((track, index) => (
                <TrackRow key={track.id} track={track} index={index} />
              ))}
            </TableBody>
          </table>
        </div>
      </div>

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="text-center py-4">
          <p className="text-gray-400">Loading more tracks...</p>
        </div>
      )}

      {/* Load more button (backup for auto-scroll) */}
      {hasNextPage && !isFetchingNextPage && (
        <div className="text-center py-4">
          <Button 
            variant="outline" 
            onClick={fetchNextPage}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
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
  // Use track playback hook for this specific track
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

  // Get audio store for duration
  const { duration } = useAudioStore();

  const handlePlayPauseClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handlePlayPause();
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
    <TableRow 
      className="group hover:bg-gray-800/50 border-b border-gray-800/50 relative"
    >
      <TableCell className="text-center">
        <div className="flex items-center justify-center w-8 h-8">
          <span className={`group-hover:hidden text-gray-400 text-sm ${isTrackCurrentlyPlaying && isPlaying ? "text-main-purple" : ""}`}>
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
            className="w-10 h-10 rounded object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <p className={`font-medium truncate ${isTrackCurrentlyPlaying && isPlaying ? "text-main-purple" : "text-white"}`}>
              {track.name}
            </p>
            <p className="text-gray-400 text-sm truncate">
              {track.mainArtists?.items?.[0]?.stageName || "Unknown Artist"}
            </p>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <p className="text-gray-400 text-sm truncate">
          {track.name} {/* Album name could be added to GraphQL query */}
        </p>
      </TableCell>
      
      <TableCell className="text-center">
        <span className="text-gray-400 text-sm">
          {getDuration()}
        </span>
      </TableCell>
      
      <TableCell className="relative">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
          <TrackActionMenu 
            track={track} 
            isVisible={true}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};