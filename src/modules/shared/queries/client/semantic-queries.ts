import { graphql } from "@/gql";

export const TrackSemanticQuery = graphql(`
  query TrackSemantic($term: String!) {
    trackBySemanticSearch(term: $term) {
      id
      name
      coverImage
      categoryIds
      categories {
        totalCount
        items {
          name
        }
      }
      favoriteCount
      isExplicit
      createdAt
      mainArtistIds
      mainArtists {
        items {
          id
          stageName
          userId
        }
      }
      streamCount
      checkTrackInFavorite
    }
  }
`);
