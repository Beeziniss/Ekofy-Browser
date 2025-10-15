import React from 'react';
import { GenericActionMenu } from '../../component/generic-action-menu';

interface SearchPlaylistSectionProps {
  playlists: any[];
  isLoading?: boolean;
}

export const SearchPlaylistSection: React.FC<SearchPlaylistSectionProps> = ({
  playlists,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="w-full aspect-square bg-gray-700 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {playlists.map((playlist) => (
          <div 
            key={playlist.id} 
            className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer group"
          >
            <div className="relative mb-4">
              <img
                src={playlist.coverImage || "/default-playlist.png"}
                alt={playlist.name}
                className="w-full aspect-square rounded-lg object-cover"
              />
              {/* Play button overlay */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                  <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
              {/* Action menu */}
              <div className="absolute top-2 right-2">
                <GenericActionMenu 
                  item={playlist} 
                  type="playlist"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-white font-semibold text-base truncate">
                {playlist.name}
              </h3>
              <p className="text-gray-400 text-sm truncate">
                By {playlist.user?.fullName || 'Unknown'}
              </p>
              {playlist.tracksInfo && (
                <p className="text-gray-500 text-xs">
                  {playlist.tracksInfo.length} {playlist.tracksInfo.length === 1 ? 'song' : 'songs'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {playlists.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No playlists found</p>
        </div>
      )}
    </div>
  );
};