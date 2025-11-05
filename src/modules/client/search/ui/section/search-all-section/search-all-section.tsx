import React from "react";
import Link from "next/link";
import { TableBody } from "@/components/ui/table";
import {
  SearchTrackItem,
  SearchArtistItem,
  SearchPlaylistItem,
} from "@/types/search";
import { AuthDialogProvider } from '../../context/auth-dialog-context';
import { TrackRowAll, ArtistCardAll, PlaylistCardAll } from '../../component';

interface SearchAllSectionProps {
  query: string;
  tracks: SearchTrackItem[];
  artists: SearchArtistItem[];
  playlists: SearchPlaylistItem[];
  isLoading?: boolean;
}

export const SearchAllSection: React.FC<SearchAllSectionProps> = ({
  query,
  tracks,
  artists,
  playlists,
  isLoading,
}) => {
  return (
    <AuthDialogProvider>
      <SearchAllSectionContent
        query={query}
        tracks={tracks}
        artists={artists}
        playlists={playlists}
        isLoading={isLoading}
      />
    </AuthDialogProvider>
  );
};

// Main content component
const SearchAllSectionContent: React.FC<SearchAllSectionProps> = ({
  query,
  tracks,
  artists,
  playlists,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-1/4 rounded bg-gray-700"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-700"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
            {/* Playlists */}
      {playlists.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Playlists</h2>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&type=playlists`}
              className="text-sm font-medium text-gray-400 hover:text-white"
            >
              Show all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {playlists.slice(0, 6).map((playlist) => (
              <PlaylistCardAll 
                key={playlist.id} 
                playlist={playlist}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h2 className="text-xl font-bold text-white">Playlists</h2>
          <p className="py-2 text-center text-gray-400">No playlists found</p>
        </div>
      )}

      {/* Artists */}
      {artists.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Artists</h2>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&type=artists`}
              className="text-sm font-medium text-gray-400 hover:text-white"
            >
              Show all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {artists.slice(0, 6).map((artist) => (
              <ArtistCardAll 
                key={artist.id} 
                artist={artist}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h2 className="text-xl font-bold text-white">Artists</h2>
          <p className="py-2 text-center text-gray-400">No artists found</p>
        </div>
      )}

      {/* Songs */}
      {tracks.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Songs</h2>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&type=songs`}
              className="text-sm font-medium text-gray-400 hover:text-white"
            >
              Show all
            </Link>
          </div>
          <div className="relative w-full">
            <div className="relative w-full">
              <table className="w-full caption-bottom text-sm">
                <TableBody>
                  {tracks.slice(0, 4).map((track, index) => (
                    <TrackRowAll 
                      key={track.id} 
                      track={track} 
                      index={index}
                    />
                  ))}
                </TableBody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h2 className="text-xl font-bold text-white">Songs</h2>
          <p className="py-2 text-center text-gray-400">No tracks found</p>
        </div>
      )}
    </div>
  );
};
