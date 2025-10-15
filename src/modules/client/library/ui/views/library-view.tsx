import { graphql } from "@/gql";
import PlaylistSection from "../sections/playlist-section";

export const CreatePlaylistMutation = graphql(`
  mutation createPlaylist($createPlaylistRequest: CreatePlaylistRequestInput!) {
    createPlaylist(createPlaylistRequest: $createPlaylistRequest)
  }
`);

export const DeletePlaylistMutation = graphql(`
  mutation deletePlaylist($playlistId: String!) {
    deletePlaylist(playlistId: $playlistId)
  }
`);

export const PlaylistsQuery = graphql(`
  query Playlists {
    playlists {
      items {
        id
        name
        coverImage
        isPublic
      }
      totalCount
    }
  }
`);

const LibraryView = () => {
  return (
    <div className="w-full">
      <PlaylistSection />
    </div>
  );
};

export default LibraryView;
