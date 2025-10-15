"use client";

import { playlistDetailTrackListOptions } from "@/gql/options/client-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

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
  return <div>Loading...</div>;
};

const PlaylistTrackListSuspense = ({ playlistId }: PlaylistTrackListProps) => {
  const { data } = useSuspenseQuery(playlistDetailTrackListOptions(playlistId));
  return <div>{data.playlists?.items?.[0].tracks.length} tracks available</div>;
};

export default PlaylistTrackList;
