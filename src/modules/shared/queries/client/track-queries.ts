import { graphql } from "@/gql";

export const TrackListHomeQuery = graphql(`
  query TrackListHome($take: Int!) {
    tracks(
      take: $take
      order: { createdAt: DESC }
      where: { and: [{ releaseInfo: { isRelease: { eq: true } } }, { restriction: { type: { eq: NONE } } }] }
    ) {
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
        streamCount
      }
    }
  }
`);

export const TrackDetailViewQuery = graphql(`
  query TrackDetail($trackId: String!) {
    tracks(where: { id: { eq: $trackId } }, take: 1, skip: 0) {
      items {
        id
        name
        coverImage
        favoriteCount
        streamCount
        description
        categoryIds
        categories {
          items {
            name
            id
          }
        }
        isExplicit
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
        releaseInfo {
          isRelease
        }
        createdBy
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
        streamCount
        checkTrackInFavorite
        createdAt
      }
    }
  }
`);

export const SuggestedTracksForPlaylistQuery = graphql(`
  query SuggestedTracksForPlaylist($take: Int!, $excludeTrackIds: [String!], $nameUnsigned: String!) {
    tracks(
      take: $take
      order: { createdAt: DESC }
      where: {
        and: [
          { releaseInfo: { isRelease: { eq: true } } }
          { restriction: { type: { eq: NONE } } }
          { id: { nin: $excludeTrackIds } }
        ]
        nameUnsigned: { contains: $nameUnsigned }
      }
    ) {
      totalCount
      items {
        id
        name
        coverImage
        mainArtistIds
        isExplicit
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

export const TopTracksQuery = graphql(`
  query TopTracks($userId: String!) {
    topTracks(take: 50, where: { userId: { eq: $userId } }) {
      items {
        id
        createdAt
        tracksInfo {
          trackId
          track {
            id
            name
            coverImage
            streamCount
            mainArtistIds
            isExplicit
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
    }
  }
`);
