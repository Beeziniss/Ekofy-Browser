import { graphql } from "@/gql";
import PlaylistTrackList from "../sections/playlist-track-list";
import PlaylistInfoSection from "../sections/playlist-info-section";

export const AddToPlaylistMutation = graphql(`
  mutation AddToPlaylist($addToPlaylistRequest: AddToPlaylistRequestInput!) {
    addToPlaylist(addToPlaylistRequest: $addToPlaylistRequest)
  }
`);

export const UpdatePlaylistMutation = graphql(`
  mutation UpdatePlaylist($updatePlaylistRequest: UpdatePlaylistRequestInput!) {
    updatePlaylist(updatePlaylistRequest: $updatePlaylistRequest)
  }
`);

export const RemoveFromPlaylistMutation = graphql(`
  mutation RemoveFromPlaylist(
    $removeFromPlaylistRequest: RemoveFromPlaylistRequestInput!
  ) {
    removeFromPlaylist(removeFromPlaylistRequest: $removeFromPlaylistRequest)
  }
`);

export const PlaylistBriefQuery = graphql(`
  query PlaylistBrief {
    playlists {
      items {
        id
        name
        coverImage
        isPublic
      }
    }
  }
`);

export const CheckTrackInPlaylistQuery = graphql(`
  query CheckTrackInPlaylist($trackId: String!) {
    playlists(where: { tracksInfo: { some: { trackId: { eq: $trackId } } } }) {
      items {
        id
      }
    }
  }
`);

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
          items {
            id
          }
          totalCount
        }
        tracksInfo {
          trackId
        }
        createdAt
        updatedAt
      }
    }
  }
`);

export const PlaylistDetailTrackListQuery = graphql(`
  query PlaylistDetailTrackList($playlistId: String!) {
    playlists(where: { id: { eq: $playlistId } }) {
      items {
        id
        tracks {
          items {
            id
            name
            coverImage
            isExplicit
            mainArtistIds
            mainArtistsAsync {
              items {
                stageName
              }
            }
          }
        }
        tracksInfo {
          trackId
          addedTime
        }
      }
    }
  }
`);

interface PlaylistDetailViewProps {
  playlistId: string;
}

const PlaylistDetailView = ({ playlistId }: PlaylistDetailViewProps) => {
  return (
    <div className="w-full space-y-8 px-6 pt-6">
      <PlaylistInfoSection playlistId={playlistId} />

      <PlaylistTrackList playlistId={playlistId} />
    </div>
  );
};

export default PlaylistDetailView;
