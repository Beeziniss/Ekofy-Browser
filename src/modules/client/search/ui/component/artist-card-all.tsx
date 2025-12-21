import React from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import { SearchArtistItem } from "@/types/search";
import { useSearchAuth } from "../../hooks/use-search-auth";
import { useRouter } from "next/navigation";
import { useProcessArtistDiscoveryPopularity } from "@/gql/client-mutation-options/popularity-mutation-option";
import { PopularityActionType } from "@/gql/graphql";
import { useArtistFollow } from "@/hooks/use-artist-follow";

interface ArtistCardAllProps {
  artist: SearchArtistItem;
}

export const ArtistCardAll = ({ artist }: ArtistCardAllProps) => {
  const { executeWithAuth } = useSearchAuth();
  const router = useRouter();
  const { mutate: artistDiscoveryPopularity } = useProcessArtistDiscoveryPopularity();
  const { handleFollowToggle } = useArtistFollow({
    artistId: artist.id,
  });

  const handleArtistClick = () => {
    // Track search result click
    artistDiscoveryPopularity({
      artistId: artist.id,
      actionType: PopularityActionType.SearchResultClick,
    });
    // Navigate to artist detail page
    router.push(`/artists/${artist.id}/tracks`);
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    executeWithAuth(
      () => {
        // Get current follow status and artist user ID
        const isCurrentlyFollowing = artist.user?.[0]?.checkUserFollowing || false;
        const artistUserId = artist.userId;

        if (artistUserId) {
          handleFollowToggle(artistUserId, isCurrentlyFollowing, artist.stageName);
        }
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

        {/* Bottom center icon - only show on hover */}
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            onClick={handleFollowClick}
            className="size-12 rounded-full bg-white text-black shadow-lg hover:bg-gray-100"
          >
            <HeartIcon
              className={`h-6 w-6 ${artist.user?.[0]?.checkUserFollowing ? "fill-main-purple text-main-purple" : ""}`}
            />
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
