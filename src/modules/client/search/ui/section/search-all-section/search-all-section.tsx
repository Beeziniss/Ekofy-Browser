import React from "react";
import Link from "next/link";
import { TrackActionMenu } from "../../component/track-action-menu";
import { PlayPauseButton } from "../../component/play-pause-button";
import { usePlayPause } from "@/hooks/use-play-pause";
import {
  // Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import {
  SearchTrackItem,
  SearchArtistItem,
  SearchPlaylistItem,
} from "@/types/search";

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
  const { togglePlayPause, isPlaying } = usePlayPause();
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
                    <TableRow
                      key={track.id}
                      className="group relative border-b border-gray-800/50 hover:bg-gray-800/50"
                    >
                      <TableCell className="w-12 text-center">
                        <div className="flex h-8 w-8 items-center justify-center">
                          <span className="text-sm text-gray-400 group-hover:hidden">
                            {index + 1}
                          </span>
                          <div className="hidden group-hover:block">
                            <PlayPauseButton
                              isPlaying={isPlaying(track.id)}
                              onClick={() =>
                                togglePlayPause(track.id, "track", track.name)
                              }
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
                            className="h-10 w-10 flex-shrink-0 rounded object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {track.name}
                            </p>
                            <p className="truncate text-sm text-gray-400">
                              {track.mainArtists.items[0]?.stageName}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="relative text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-sm text-gray-400">3:45</span>
                          <div className="relative z-10 opacity-0 transition-opacity group-hover:opacity-100">
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
          <p className="py-2 text-center text-gray-400">No tracks found</p>
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
          <div className="flex space-x-4">
            {artists.slice(0, 5).map((artist) => (
              <div
                key={artist.id}
                className="group relative flex flex-col items-center space-y-2 rounded p-3 transition-colors hover:bg-gray-800"
              >
                <div className="relative">
                  {artist?.avatarImage ? (
                    <Image
                      src={artist?.avatarImage}
                      alt={artist?.stageName}
                      className="h-52 w-52 rounded-full object-cover"
                      width={208}
                      height={208}
                    />
                  ) : (
                    <div className="flex h-52 w-52 items-center justify-center rounded-full bg-gray-700">
                      <span className="text-lg font-bold text-white">
                        {artist?.stageName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {/* Play/Pause button overlay */}
                  <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full bg-black opacity-0 transition-opacity group-hover:opacity-100">
                    <PlayPauseButton
                      isPlaying={isPlaying(artist.id)}
                      onClick={() =>
                        togglePlayPause(artist.id, "artist", artist.stageName)
                      }
                      size="large"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-medium text-white">
                    {artist.stageName}
                  </p>
                  <p className="text-xs text-gray-400">Artist</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h2 className="text-xl font-bold text-white">Artists</h2>
          <p className="py-2 text-center text-gray-400">No artists found</p>
        </div>
      )}

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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {playlists.slice(0, 5).map((playlist) => (
              <div
                key={playlist.id}
                className="group rounded-lg bg-gray-800 p-4 transition-colors hover:bg-gray-700"
              >
                <div className="relative mb-3">
                  <Image
                    src={playlist.coverImage || "/default-playlist.png"}
                    alt={playlist.name}
                    className="aspect-square w-full rounded-lg object-cover"
                    width={280}
                    height={280}
                    unoptimized
                  />
                  {/* Play/Pause button overlay */}
                  <div className="absolute right-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <PlayPauseButton
                      isPlaying={isPlaying(playlist.id)}
                      onClick={() =>
                        togglePlayPause(playlist.id, "playlist", playlist.name)
                      }
                      size="medium"
                    />
                  </div>
                </div>
                <h3 className="truncate text-sm font-medium text-white">
                  {playlist.name}
                </h3>
                <p className="truncate text-xs text-gray-400">
                  By {playlist.user?.fullName}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h2 className="text-xl font-bold text-white">Playlists</h2>
          <p className="py-2 text-center text-gray-400">No playlists found</p>
        </div>
      )}
    </div>
  );
};
