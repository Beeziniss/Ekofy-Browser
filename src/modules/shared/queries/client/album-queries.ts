import { graphql } from "@/gql";

export const AlbumQuery = graphql(`
  query Albums($where: AlbumFilterInput, $skip: Int, $take: Int) {
    albums(where: $where, skip: $skip, take: $take, order: { createdAt: DESC }) {
      items {
        id
        name
        coverImage
        description
        isVisible
        checkAlbumInFavorite
      }
      pageInfo {
        hasNextPage
      }
      totalCount
    }
  }
`);

export const AlbumDetailQuery = graphql(`
  query AlbumDetail($where: AlbumFilterInput, $take: Int) {
    albums(where: $where, take: $take) {
      items {
        id
        name
        trackIds
        coverImage
        tracks {
          items {
            id
            coverImage
            name
            mainArtistIds
            mainArtists {
              items {
                id
                stageName
              }
            }
          }
        }
        description
        isVisible
        createdAt
        updatedAt
        artists {
          stageName
        }
        contributingArtists {
          artistId
        }
      }
      totalCount
    }
  }
`);