import { graphql } from "@/gql";

export const TrackListWithFiltersQuery = graphql(`
  query TracksWithFilters($skip: Int!, $take: Int!, $where: TrackFilterInput, $order: [TrackSortInput!]) {
    tracks(skip: $skip, take: $take, where: $where, order: $order) {
      totalCount
      items {
        id
        name
        mainArtistIds
        streamCount
        favoriteCount
        coverImage
        isExplicit
        releaseInfo {
          releaseDate
          isRelease
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);
