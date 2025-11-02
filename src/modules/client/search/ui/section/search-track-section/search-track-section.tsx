import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { TrackActionMenu } from '../../component/track-action-menu';
import { PlayPauseButton } from '../../component/play-pause-button';
import { Button } from '@/components/ui/button';
import { usePlayPause } from '@/hooks/use-play-pause';
import {
  // Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from 'next/image';
import { SearchTrackItem } from '@/types/search';

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
  const { togglePlayPause, isPlaying } = usePlayPause();
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
                <TableRow 
                  key={track.id} 
                  className="group hover:bg-gray-800/50 border-b border-gray-800/50 relative"
                >
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center w-8 h-8">
                      <span className="group-hover:hidden text-gray-400 text-sm">
                        {index + 1}
                      </span>
                      <div className="hidden group-hover:block">
                        <PlayPauseButton
                          isPlaying={isPlaying(track.id)}
                          onClick={() => togglePlayPause(track.id, 'track', track.name)}
                          size="small"
                        />
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
                        <p className="text-white font-medium truncate">{track.name}</p>
                        <p className="text-gray-400 text-sm truncate">{track.mainArtists.items[0]?.stageName}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <p className="text-gray-400 text-sm truncate">
                      {track.name} {/* Album name could be added to GraphQL query */}
                    </p>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className="text-gray-400 text-sm">3:45</span>
                  </TableCell>
                  
                  <TableCell className="relative">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                      <TrackActionMenu 
                        track={track} 
                        isVisible={false}
                      />
                    </div>
                  </TableCell>
                </TableRow>
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