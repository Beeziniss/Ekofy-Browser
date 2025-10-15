import React, { useEffect } from 'react';
import { GenericActionMenu } from '../../component/generic-action-menu';
import { Button } from '@/components/ui/button';

interface SearchPlaylistSectionProps {
  playlists: any[];
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {publicPlaylists.map((playlist) => (
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