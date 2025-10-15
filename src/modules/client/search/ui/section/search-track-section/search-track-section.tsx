import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { TrackActionMenu } from '../../component/track-action-menu';
import { Button } from '@/components/ui/button';

interface SearchTrackSectionProps {
  tracks: any[];
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
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-gray-700 text-gray-400 text-sm">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-1"></div>
        <div className="col-span-6">Title</div>
        <div className="col-span-3">Album</div>
        <div className="col-span-1 text-center">
          <Clock className="w-4 h-4 mx-auto" />
        </div>
      </div>

      {/* Tracks List */}
      <div className="space-y-1">
        {tracks.map((track, index) => (
          <div 
            key={track.id} 
            className="grid grid-cols-12 gap-4 px-4 py-2 rounded hover:bg-gray-800 transition-colors group"
          >
            <div className="col-span-1 text-center text-gray-400 text-sm flex items-center justify-center">
              {index + 1}
            </div>
            
            <div className="col-span-1 flex items-center">
              <img
                src={track.coverImage || "/default-track.png"}
                alt={track.name}
                className="w-10 h-10 rounded object-cover"
              />
            </div>
            
            <div className="col-span-6 flex flex-col justify-center min-w-0">
              <p className="text-white font-medium truncate">{track.name}</p>
              <p className="text-gray-400 text-sm truncate">{track.artist[0].stageName}</p>
            </div>
            
            <div className="col-span-3 flex items-center min-w-0">
              <p className="text-gray-400 text-sm truncate">
                {track.name} {/* Album name could be added to GraphQL query */}
              </p>
            </div>
            
            <div className="col-span-1 flex items-center justify-between">
              <span className="text-gray-400 text-sm">3:45</span>
              <TrackActionMenu 
                track={track} 
                isVisible={false} // Will be controlled by group-hover
              />
            </div>
          </div>
        ))}
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