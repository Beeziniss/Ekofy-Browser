import { graphql } from "@/gql";

export const TrackListHomeQuery = graphql(`
  query TrackListHome($take: Int!) {
    tracks(take: $take, order: { createdAt: DESC }) {
      totalCount
      items {
        id
        name
        coverImage
        mainArtistIds
        mainArtists {
          items {
            id
            stageName
          }
        }
        checkTrackInFavorite
      }
    }
  }
`);

export const TrackDetailViewQuery = graphql(`
  query TrackDetail($trackId: String!) {
    tracks(where: { id: { eq: $trackId } }) {
      items {
        id
        name
        coverImage
        favoriteCount
        streamCount
        categoryIds
        mainArtistIds
        mainArtists {
          items {
            id
            stageName
            followerCount
            avatarImage
            userId
            user {
              id
              checkUserFollowing
            }
          }
        }
        checkTrackInFavorite
      }
    }
  }
`);

export const TrackFavoriteQuery = graphql(`
  query TrackFavorite($take: Int!, $skip: Int!) {
    favoriteTracks(take: $take, skip: $skip, order: { createdAt: DESC }) {
      totalCount
      items {
        id
        name
        coverImage
        mainArtistIds
        mainArtists {
          items {
            id
            stageName
          }
        }
        checkTrackInFavorite
        createdAt
      }
    }
  }
`);

// export const TrackCategoriesQuery = graphql(`
//   query TrackCategories($trackId: String!) {
//     tracks(where: { id: { eq: $trackId } }) {
//       items {
//         id
//         categoryIds
//       }
//     }
//   }
// `);
