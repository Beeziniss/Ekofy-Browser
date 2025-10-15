import { graphql } from "@/gql";
import PlaylistInfoSection from "../sections/playlist-info-section";

export const PlaylistDetailQuery = graphql(`
  query PlaylistDetail($playlistId: String!) {
    playlists(where: { id: { eq: $playlistId } }) {
      items {
        id
        name
        coverImage
        description
        isPublic
        user {
          id
          fullName
        }
        userId
        tracks {
          id
        }
        createdAt
        updatedAt
      }
    }
  }
`);

interface PlaylistDetailViewProps {
  playlistId: string;
}

const PlaylistDetailView = ({ playlistId }: PlaylistDetailViewProps) => {
  return (
    <div className="w-full px-6 pt-6">
      <PlaylistInfoSection playlistId={playlistId} />
    </div>
  );
};

export default PlaylistDetailView;
