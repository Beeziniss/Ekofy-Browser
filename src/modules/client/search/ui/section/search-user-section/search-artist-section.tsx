import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { SearchArtistItem } from "@/types/search";
import { toast } from "sonner";
import { useAuthAction } from "@/hooks/use-auth-action";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";

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
  fetchNextPage,
}) => {
  // Auto-load more when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
        isFetchingNextPage
      ) {
        return;
      }

      if (hasNextPage && fetchNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (artists.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No artists found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="py-4 text-center">
          <p className="text-gray-400">Loading more artists...</p>
        </div>
      )}

      {/* Load more button */}
      {hasNextPage && !isFetchingNextPage && (
        <div className="py-4 text-center">
          <Button variant="outline" onClick={fetchNextPage} className="border-gray-600 text-white hover:bg-gray-700">
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
}

const ArtistCard = ({ artist }: ArtistCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  // Auth action hooks
  const { showWarningDialog, setShowWarningDialog, warningAction, trackName, executeWithAuth } = useAuthAction();

  const handleArtistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    executeWithAuth(
      () => {
        // Navigate to artist detail page
        window.location.href = `/artist/${artist.id}`;
      },
      "follow",
      artist.stageName,
    );
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

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    executeWithAuth(
      () => {
        // TODO: Play artist's top tracks
        console.log(`Play ${artist.stageName}'s music`);
        toast.success(`Playing ${artist.stageName}'s music`);
      },
      "play",
      artist.stageName,
    );
  };

  return (
    <>
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

          {/* Bottom left icons - only show on hover */}
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform items-center justify-center gap-x-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button
              onClick={handlePlayClick}
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

      <WarningAuthDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        action={warningAction}
        trackName={trackName}
      />
    </>
  );
};
