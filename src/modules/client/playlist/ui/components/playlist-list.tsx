import PlaylistCard from "./playlist-card";
import { PlaylistsQuery } from "@/gql/graphql";
import { InfiniteData } from "@tanstack/react-query";

interface PlaylistListProps {
  data: InfiniteData<PlaylistsQuery, unknown>;
  isPending: boolean;
}

const PlaylistList = ({ data, isPending }: PlaylistListProps) => {
  return (
    <>
      {isPending && <div>Loading...</div>}
      {!isPending &&
        data?.pages
          .flatMap((page) => page.playlists?.items || [])
          .map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
    </>
  );
};

export default PlaylistList;
