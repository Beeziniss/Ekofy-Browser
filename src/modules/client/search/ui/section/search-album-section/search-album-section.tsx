import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SearchAlbumItem } from "@/types/search";
import { AlbumCardAll } from "../../component";
import { AuthDialogProvider } from "../../context/auth-dialog-context";

interface SearchAlbumSectionProps {
  albums: SearchAlbumItem[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export const SearchAlbumSection: React.FC<SearchAlbumSectionProps> = ({
  albums,
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

  // Filter only visible albums
  const visibleAlbums = albums.filter((album) => album.isVisible === true);

  if (visibleAlbums.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No albums found</p>
      </div>
    );
  }

  return (
    <AuthDialogProvider>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {visibleAlbums.map((album) => (
            <AlbumCardAll key={album.id} album={album} />
          ))}
        </div>

        {/* Loading more indicator */}
        {isFetchingNextPage && (
          <div className="py-4 text-center">
            <p className="text-gray-400">Loading more albums...</p>
          </div>
        )}

        {/* Load more button */}
        {hasNextPage && !isFetchingNextPage && (
          <div className="py-4 text-center">
            <Button variant="outline" onClick={fetchNextPage} className="border-gray-600 text-white hover:bg-gray-700">
              Load More Albums
            </Button>
          </div>
        )}
      </div>
    </AuthDialogProvider>
  );
};

