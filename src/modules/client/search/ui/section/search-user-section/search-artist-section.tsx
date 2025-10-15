import React from 'react';
import { GenericActionMenu } from '../../component/generic-action-menu';

interface SearchArtistSectionProps {
  artists: any[];
  isLoading?: boolean;
}

export const SearchArtistSection: React.FC<SearchArtistSectionProps> = ({
  artists,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse p-4 flex flex-col items-center">
            <div className="w-36 aspect-square bg-gray-700 rounded-full mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-36 mx-auto"></div>
              <div className="h-3 bg-gray-700 rounded w-20 mx-auto"></div>
            </div>
          </div>
        ))}
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

      {artists.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No artists found</p>
        </div>
      )}
    </div>
  );
};