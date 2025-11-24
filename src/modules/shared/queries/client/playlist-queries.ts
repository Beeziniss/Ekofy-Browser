import { graphql } from "@/gql";

export const PlaylistsPersonalQuery = graphql(`
  query Playlists($userId: String!, $name: String, $take: Int, $skip: Int) {
    playlists(
      where: { or: [{ name: { contains: $name } }, { nameUnsigned: { contains: $name } }], userId: { eq: $userId } }
      order: { createdAt: DESC }
      take: $take
      skip: $skip
    ) {
      items {
        id
        name
        coverImage
        isPublic
        userId
        checkPlaylistInFavorite
      }
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  }
`);

export const PlaylistsHomeQuery = graphql(`
  query PlaylistsHome($take: Int, $skip: Int) {
    playlists(where: { isPublic: { eq: true } }, order: { createdAt: DESC }, take: $take, skip: $skip) {
      items {
        id
        name
        coverImage
        userId
        isPublic
        checkPlaylistInFavorite
      }
    }
  }
`);
