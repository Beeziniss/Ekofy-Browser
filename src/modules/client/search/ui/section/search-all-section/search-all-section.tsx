import React from 'react';
import Link from 'next/link';
import { TrackActionMenu } from '../../component/track-action-menu';
import { PlayPauseButton } from '../../component/play-pause-button';
import { usePlayPause } from '@/hooks/use-play-pause';
import {
  // Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import Image from 'next/image';
import { SearchTrackItem, SearchArtistItem, SearchPlaylistItem } from '@/types/search';

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
  isLoading
}) => {
  const { togglePlayPause, isPlaying } = usePlayPause();
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
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
      {/* Top Result */}
      {/* {(tracks.length > 0 || artists.length > 0) && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Top result</h2>
          <div className="bg-gray-800 rounded-lg p-6 w-fit">
            {tracks.length > 0 ? (
              <div className="flex items-center space-x-4">
                <img
                  src={tracks[0]?.coverImage || "/default-track.png"}
                  alt={tracks[0]?.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <h3 className="text-white font-semibold text-lg">{tracks[0]?.name}</h3>
                  <p className="text-gray-400">Song • {tracks[0]?.artist?.stageName}</p>
                </div>
              </div>
            ) : artists.length > 0 ? (
              <div className="flex items-center space-x-4">
                {artists[0]?.avatarImage ? (
                  <img
                    src={artists[0]?.avatarImage}
                    alt={artists[0]?.stageName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {artists[0]?.stageName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-white font-semibold text-lg">{artists[0]?.stageName}</h3>
                  <p className="text-gray-400">Artist</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )} */}

      {/* Songs */}
      {tracks.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Songs</h2>
            <Link 
              href={`/search?q=${encodeURIComponent(query)}&type=songs`}
              className="text-gray-400 hover:text-white text-sm font-medium"
            >
              Show all
            </Link>
          </div>
          <div className="relative w-full">
            <div className="relative w-full">
              <table className="w-full caption-bottom text-sm">
                <TableBody>
                  {tracks.slice(0, 4).map((track, index) => (
                    <TableRow 
                      key={track.id} 
                      className="group hover:bg-gray-800/50 border-b border-gray-800/50 relative"
                    >
                  <TableCell className="w-12 text-center">
                    <div className="flex items-center justify-center w-8 h-8">
                      <span className="group-hover:hidden text-gray-400 text-sm">
                        {index + 1}
                      </span>
                      <div className="hidden group-hover:block">
                        <PlayPauseButton
                          isPlaying={isPlaying(track.id)}
                          onClick={() => togglePlayPause(track.id, 'track', track.name)}
                          size="small"
                        />
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={track.coverImage || "/default-track.png"}
                        alt={track.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{track.name}</p>
                        <p className="text-gray-400 text-sm truncate">{track.mainArtistsAsync.items[0]?.stageName}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right relative">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-gray-400 text-sm">3:45</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                        <TrackActionMenu track={track} />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8">
        <h2 className="text-xl font-bold text-white">Songs</h2>
          <p className="text-gray-400 text-center py-2">No tracks found</p>
        </div>
      )}

      {/* Artists */}
      {artists.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Artists</h2>
            <Link 
              href={`/search?q=${encodeURIComponent(query)}&type=artists`}
              className="text-gray-400 hover:text-white text-sm font-medium"
            >
              Show all
            </Link>
          </div>
          <div className="flex space-x-4">
            {artists.slice(0, 5).map((artist) => (
              <div key={artist.id} className="flex flex-col items-center space-y-2 p-3 rounded hover:bg-gray-800 transition-colors group relative">
                <div className="relative">
                  {artist?.avatarImage ? (
                    <Image
                      src={artist?.avatarImage}
                      alt={artist?.stageName}
                      className="w-52 h-52 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-52 h-52 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {artist?.stageName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {/* Play/Pause button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full">
                    <PlayPauseButton
                      isPlaying={isPlaying(artist.id)}
                      onClick={() => togglePlayPause(artist.id, 'artist', artist.stageName)}
                      size="large"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium text-2xl">{artist.stageName}</p>
                  <p className="text-gray-400 text-xs">Artist</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h2 className="text-xl font-bold text-white">Artists</h2>
          <p className="text-gray-400 text-center py-2">No artists found</p>
        </div>
      )}

      {/* Playlists */}
      {playlists.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Playlists</h2>
            <Link 
              href={`/search?q=${encodeURIComponent(query)}&type=playlists`}
              className="text-gray-400 hover:text-white text-sm font-medium"
            >
              Show all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {playlists.slice(0, 5).map((playlist) => (
              <div key={playlist.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors group">
                <div className="relative mb-3">
                  <Image
                    src={playlist.coverImage || "/default-playlist.png"}
                    alt={playlist.name}
                    className="w-full aspect-square rounded-lg object-cover"
                  />
                  {/* Play/Pause button overlay */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayPauseButton
                      isPlaying={isPlaying(playlist.id)}
                      onClick={() => togglePlayPause(playlist.id, 'playlist', playlist.name)}
                      size="medium"
                    />
                  </div>
                </div>
                <h3 className="text-white font-medium text-sm truncate">{playlist.name}</h3>
                <p className="text-gray-400 text-xs truncate">By {playlist.user?.fullName}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h2 className="text-xl font-bold text-white">Playlists</h2>
          <p className="text-gray-400 text-center py-2">No playlists found</p>
          </div>
    )}
    </div>
  );
};