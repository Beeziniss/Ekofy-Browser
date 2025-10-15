import React from 'react';
import { Clock } from 'lucide-react';
import { TrackActionMenu } from '../../component/track-action-menu';

interface SearchTrackSectionProps {
  tracks: any[];
  isLoading?: boolean;
}

export const SearchTrackSection: React.FC<SearchTrackSectionProps> = ({
  tracks,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-2">
              <div className="w-4 h-4 bg-gray-700 rounded"></div>
              <div className="h-12 w-12 bg-gray-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-4 w-12 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
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

      {tracks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No songs found</p>
        </div>
      )}
    </div>
  );
};