import { graphql } from "@/gql";

export const CreateAlbumMutation = graphql(`
    mutation CreateAlbum($data: CreateAlbumRequestInput!) {
      createAlbum(createAlbumRequest: $data)
    }
`)

export const DeleteAlbumMutation = graphql(`
    mutation DeleteAlbum($albumId: String!) {
      deleteAlbum(albumId: $albumId)
    }
`)

export const RemoveTrackFromAlbumMutation = graphql(`
    mutation RemoveTrackFromAlbum($data: RemoveTrackFromAlbumRequestInput!) {
      removeTrackFromAlbum(removeTrackFromAlbumRequest: $data)
    }
`)

export const AddTracksToAlbumMutation = graphql(`
    mutation AddTracksToAlbum($data: AddTrackToAlbumRequestInput!) {
      addTrackToAlbum(addTrackToAlbumRequest: $data)
    }
`)