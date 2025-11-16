import PlaylistCard from "./playlist-card";
import { PlaylistsQuery } from "@/gql/graphql";
import { InfiniteData } from "@tanstack/react-query";

interface PlaylistListProps {
  data: InfiniteData<PlaylistsQuery, unknown>;
}

const PlaylistList = ({ data }: PlaylistListProps) => {
  return (
    <>
      {data?.pages
        .flatMap((page) => page.playlists?.items || [])
        .map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
    </>
  );
};

export default PlaylistList;
