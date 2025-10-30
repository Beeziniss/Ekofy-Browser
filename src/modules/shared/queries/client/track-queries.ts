import { graphql } from "@/gql";

export const TrackListHomeQuery = graphql(`
  query TrackListHome($take: Int!) {
    tracks(take: $take) {
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
        mainArtistIds
        mainArtists {
          items {
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
