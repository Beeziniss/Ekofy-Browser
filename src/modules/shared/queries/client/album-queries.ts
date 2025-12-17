import { graphql } from "@/gql";

export const AlbumQuery = graphql(`
  query Albums($where: AlbumFilterInput, $skip: Int, $take: Int) {
    albums(where: $where, skip: $skip, take: $take, order: {createdAt: DESC}) {
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
`)