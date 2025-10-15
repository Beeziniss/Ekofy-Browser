import React, { useEffect } from 'react';
import { GenericActionMenu } from '../../component/generic-action-menu';
import { Button } from '@/components/ui/button';

interface SearchArtistSectionProps {
  artists: any[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export const SearchArtistSection: React.FC<SearchArtistSectionProps> = ({
  artists,
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

  if (artists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No artists found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {artists.map((artist) => (
          <div 
            key={artist.id} 
            className="flex flex-col items-center space-y-3 p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group relative"
          >
            {/* Action menu */}
            <div className="absolute top-2 right-2 z-10">
              <GenericActionMenu 
                item={artist} 
                type="artist"
              />
            </div>
            
            <div className="relative">
              {artist.avatarImage ? (
                <img
                  src={artist.avatarImage}
                  alt={artist.stageName}
                  className="w-36 h-36 rounded-full object-cover"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-gray-700 flex items-center justify-center text-white text-2xl font-semibold">
                  {artist.stageName.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full">
                <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="text-">
              <h3 className="text-white font-semibold truncate w-full text-2xl">
                {artist.stageName}
              </h3>
              <p className="text-gray-400 text-xl">Artist</p>
                <p className="text-gray-500 text-xl mt-1">
                  {artist.followerCount.toLocaleString()} followers
                </p>
            </div>
          </div>
        ))}
      </div>

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="text-center py-4">
          <p className="text-gray-400">Loading more artists...</p>
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
            Load More Artists
          </Button>
        </div>
      )}
    </div>
  );
};