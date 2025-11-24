import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { SearchArtistItem } from "@/types/search";
import { toast } from "sonner";
import { useSearchAuth } from "../../hooks/use-search-auth";
import { useRouter } from "next/navigation";

interface ArtistCardAllProps {
  artist: SearchArtistItem;
}

export const ArtistCardAll = ({ artist }: ArtistCardAllProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { executeWithAuth } = useSearchAuth();
  const router = useRouter();

  const handleArtistClick = () => {
    // Navigate to artist detail page
    router.push(`/artists/${artist.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    executeWithAuth(
      () => {
        setIsFavorited(!isFavorited);
        toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
      },
      "follow",
      artist.stageName,
    );
  };

  return (
    <div
      className="group flex cursor-pointer flex-col items-center space-y-3 rounded-xl p-3 transition-all duration-200 hover:bg-gray-800/50"
      onClick={handleArtistClick}
    >
      <div className="relative aspect-square w-full">
        {artist.avatarImage ? (
          <Image
            src={artist.avatarImage}
            alt={artist.stageName}
            width={200}
            height={200}
            className="h-full w-full rounded-full object-cover shadow-lg transition-shadow duration-200 group-hover:shadow-xl"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-5xl font-bold text-white shadow-lg transition-shadow duration-200 group-hover:shadow-xl">
            {artist.stageName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Bottom center icons - only show on hover */}
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform items-center justify-center gap-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              executeWithAuth(
                () => {
                  // TODO: Play artist's top tracks
                  console.log(`Play ${artist.stageName}'s music`);
                },
                "play",
                artist.stageName,
              );
            }}
            className="size-12 rounded-full bg-white text-black shadow-lg hover:bg-gray-100"
          >
            <PlayIcon className="h-8 w-8 fill-current" />
          </Button>

          <Button
            onClick={handleFavoriteClick}
            className="size-12 rounded-full bg-white text-black shadow-lg hover:bg-gray-100"
          >
            <HeartIcon className={`h-6 w-6 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col items-center text-center">
        <h3 className="w-full truncate text-sm font-semibold text-white transition-colors duration-200 group-hover:text-purple-300 hover:underline">
          {artist.stageName}
        </h3>
        <p className="mt-1 text-xs text-gray-500">{artist.followerCount?.toLocaleString() || "0"} followers</p>
      </div>
    </div>
  );
};
