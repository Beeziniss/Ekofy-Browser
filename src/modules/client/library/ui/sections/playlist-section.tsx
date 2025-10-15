"use client";

import PlaylistCard from "../../../playlist/ui/components/playlist-card";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import PlaylistCreate from "../../../playlist/ui/components/playlist-create";
import { playlistOptions } from "@/gql/options/client-options";

const PlaylistSection = () => {
  const { data } = useSuspenseInfiniteQuery(playlistOptions);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">
          {data?.pages[0].playlists?.totalCount} playlists
        </span>
      </div>

      <div className="flex flex-wrap gap-8">
        <PlaylistCreate />

        {data?.pages
          .flatMap((page) => page.playlists?.items || [])
          .map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
      </div>
    </div>
  );
};

export default PlaylistSection;
