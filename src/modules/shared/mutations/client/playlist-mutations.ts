import { graphql } from "@/gql";

// CRUD mutations for playlists
export const PlaylistFavoriteMutation = graphql(`
  mutation PlaylistFavorite($playlistId: String!, $isAdding: Boolean!) {
    addToFavorite(playlistId: $playlistId, isAdding: $isAdding)
  }
`);

export const CreatePlaylistMutation = graphql(`
  mutation createPlaylist($createPlaylistRequest: CreatePlaylistRequestInput!) {
    createPlaylist(createPlaylistRequest: $createPlaylistRequest)
  }
`);

export const UpdatePlaylistMutation = graphql(`
  mutation UpdatePlaylist($updatePlaylistRequest: UpdatePlaylistRequestInput!) {
    updatePlaylist(updatePlaylistRequest: $updatePlaylistRequest)
  }
`);

export const DeletePlaylistMutation = graphql(`
  mutation deletePlaylist($playlistId: String!) {
    deletePlaylist(playlistId: $playlistId)
  }
`);

// Mutations for adding and removing tracks from playlists
export const AddToPlaylistMutation = graphql(`
  mutation AddToPlaylist($addToPlaylistRequest: AddToPlaylistRequestInput!) {
    addToPlaylist(addToPlaylistRequest: $addToPlaylistRequest)
  }
`);

export const RemoveFromPlaylistMutation = graphql(`
  mutation RemoveFromPlaylist(
    $removeFromPlaylistRequest: RemoveFromPlaylistRequestInput!
  ) {
    removeFromPlaylist(removeFromPlaylistRequest: $removeFromPlaylistRequest)
  }
`);
