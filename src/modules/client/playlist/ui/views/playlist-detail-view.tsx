import { graphql } from "@/gql";
import PlaylistTrackList from "../sections/playlist-track-list";
import PlaylistInfoSection from "../sections/playlist-info-section";

export const PlaylistBriefQuery = graphql(`
  query PlaylistBrief($userId: String!) {
    playlists(where: { userId: { eq: $userId } }) {
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
        artist {
          id
          avatarImage
          stageName
        }
        listener {
          id
          avatarImage
          displayName
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
        name
        tracks {
          items {
            id
            name
            coverImage
            isExplicit
            mainArtistIds
            mainArtists {
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
