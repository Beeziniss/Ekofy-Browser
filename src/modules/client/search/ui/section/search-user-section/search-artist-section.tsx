import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { HeartIcon, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { SearchArtistItem } from '@/types/search';
import { toast } from "sonner";

interface SearchArtistSectionProps {
  artists: SearchArtistItem[];
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

  const handleArtistClick = (artistId: string, stageName: string) => {
    // TODO: Navigate to artist detail page when implemented
    console.log(`Navigate to artist: ${stageName} (${artistId})`);
    // For now, just log - this will be replaced with actual navigation
    // router.push(`/artist/${artistId}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} onArtistClick={handleArtistClick} />
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

// Individual Artist Card Component
interface ArtistCardProps {
  artist: SearchArtistItem;
  onArtistClick: (artistId: string, stageName: string) => void;
}

const ArtistCard = ({ artist, onArtistClick }: ArtistCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Play artist's top tracks
    console.log(`Play ${artist.stageName}'s music`);
    toast.success(`Playing ${artist.stageName}'s music`);
  };

  return (
    <div 
      className="flex flex-col items-center space-y-3 p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group"
      onClick={() => onArtistClick(artist.id, artist.stageName)}
    >
      <div className="relative w-full aspect-square">
        {artist.avatarImage ? (
          <Image
            src={artist.avatarImage}
            alt={artist.stageName}
            width={200}
            height={200}
            className="w-full h-full rounded-full object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-200"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-200">
            {artist.stageName.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* Bottom left icons - only show on hover */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            onClick={handlePlayClick}
            className="bg-white hover:bg-gray-100 text-black size-12 rounded-full shadow-lg"
          >
            <PlayIcon className="w-8 h-8 fill-current" />
          </Button>
          
          <Button
            onClick={handleFavoriteClick}
            className="bg-white hover:bg-gray-100 text-black size-12 rounded-full shadow-lg"
          >
            <HeartIcon
              className={`w-6 h-6 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center w-full">
        <h3 className="text-white font-semibold text-sm truncate w-full group-hover:text-purple-300 hover:underline transition-colors duration-200">
          {artist.stageName}
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          {artist.followerCount?.toLocaleString() || '0'} fans
        </p>
      </div>
    </div>
  );
};