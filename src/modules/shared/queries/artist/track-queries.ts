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
        categoryIds
        checkTrackInFavorite
        createdAt
        featuredArtistIds
        legalDocuments {
          documentType
          documentUrl
          name
          note
        }
        popularity
        restriction {
          action
          expired
          reason
          type
          reportId
          restrictedAt
        }
        syncedLyrics {
          text
          time
        }
        tags
        type
        nameUnsigned
        releaseInfo {
          releaseDate
          isRelease
        }
        mainArtists {
          items {
            stageName
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);
