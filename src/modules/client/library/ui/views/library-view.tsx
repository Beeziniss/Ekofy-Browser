"use client";

import { useAuthStore } from "@/store";
import PlaylistSection from "../sections/playlist-section";
import { playlistOptions } from "@/gql/options/client-options";
import { usePrefetchInfiniteQuery } from "@tanstack/react-query";

const LibraryView = () => {
  const { user } = useAuthStore();

  usePrefetchInfiniteQuery(playlistOptions(user!.userId, undefined, 12));

  return (
    <div className="w-full">
      <PlaylistSection userId={user!.userId} />
    </div>
  );
};

export default LibraryView;
