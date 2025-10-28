"use client";

import { playlistDetailTrackListOptions } from "@/gql/options/client-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import PlaylistTrackTable, {
  PlaylistTrack,
} from "../components/playlist-track-table";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PlaylistTrackListProps {
  playlistId: string;
}

const PlaylistTrackList = ({ playlistId }: PlaylistTrackListProps) => {
  return (
    <Suspense fallback={<PlaylistTrackListSkeleton />}>
      <PlaylistTrackListSuspense playlistId={playlistId} />
    </Suspense>
  );
};

const PlaylistTrackListSkeleton = () => {
  return (
    <div className="pointer-events-none w-full space-y-4">
      <div className="relative w-80">
        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search tracks..."
          className="border-gray-700 bg-gray-800 pl-10 text-white placeholder-gray-400"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-main-white flex-1">TRACK</TableHead>
            <TableHead className="text-main-white w-[15%]">ARTIST</TableHead>
            <TableHead className="text-main-white w-25">ADDED</TableHead>
            <TableHead className="text-main-white w-14"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <tr className="hover:bg-muted/50 flex cursor-pointer items-center gap-x-3 px-2 py-3 transition-colors">
            <td className="bg-main-grey-dark-bg flex size-12 items-center justify-center">
              <PlusIcon className="text-main-white size-6" />
            </td>
            <td className="text-main-white flex-1">Add new track</td>
          </tr>
        </TableBody>
      </Table>
    </div>
  );
};

const PlaylistTrackListSuspense = ({ playlistId }: PlaylistTrackListProps) => {
  const { data } = useSuspenseQuery(playlistDetailTrackListOptions(playlistId));
  const playlist = data.playlists?.items?.[0];

  if (!playlist) {
    return <div className="text-gray-400">Playlist not found.</div>;
  }

  const tracks: PlaylistTrack[] =
    playlist.tracks?.items
      ?.filter((track): track is NonNullable<typeof track> => track !== null)
      .map((track) => {
        // Find the corresponding tracksInfo for this track
        const trackInfo = playlist.tracksInfo.find(
          (info) => info.trackId === track.id,
        );

        return {
          id: track.id,
          name: track.name,
          coverImage: track.coverImage || "",
          isExplicit: track.isExplicit,
          artist:
            track.mainArtists?.items
              ?.map((a) => a?.stageName)
              .filter(Boolean)
              .join(", ") || "Unknown Artist",
          addedTime: trackInfo?.addedTime || new Date().toISOString(),
        };
      }) || [];

  return <PlaylistTrackTable tracks={tracks} playlistId={playlistId} />;
};

export default PlaylistTrackList;
