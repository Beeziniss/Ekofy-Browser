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
  query Playlists($name: String, $take: Int, $skip: Int) {
    playlists(
      where: {
        or: { name: { contains: $name }, nameUnsigned: { contains: $name } }
      }
      order: { createdAt: DESC }
      take: $take
      skip: $skip
    ) {
      items {
        id
        name
        coverImage
        isPublic
      }
      totalCount
      pageInfo {
        hasNextPage
      }
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
