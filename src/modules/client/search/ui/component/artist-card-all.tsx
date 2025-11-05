import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { SearchArtistItem } from "@/types/search";
import { toast } from "sonner";
import { useSearchAuth } from '../../hooks/use-search-auth';

interface ArtistCardAllProps {
  artist: SearchArtistItem;
}

export const ArtistCardAll = ({ artist }: ArtistCardAllProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { executeWithAuth } = useSearchAuth();

  const handleArtistClick = () => {
    // TODO: Navigate to artist detail page when implemented
    console.log(`Navigate to artist: ${artist.stageName} (${artist.id})`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    executeWithAuth(() => {
      setIsFavorited(!isFavorited);
      toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
    }, "follow", artist.stageName);
  };

  return (
    <div 
      className="flex flex-col items-center space-y-3 p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group"
      onClick={handleArtistClick}
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
        
        {/* Bottom center icons - only show on hover */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              executeWithAuth(() => {
                // TODO: Play artist's top tracks
                console.log(`Play ${artist.stageName}'s music`);
              }, "play", artist.stageName);
            }}
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
          {artist.followerCount?.toLocaleString() || '0'} followers
        </p>
      </div>
    </div>
  );
};