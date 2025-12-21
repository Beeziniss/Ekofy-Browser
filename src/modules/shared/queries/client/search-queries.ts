import { graphql } from "@/gql";

// GraphQL Queries - using raw strings until schema is updated
export const SEARCH_ARTISTS = graphql(`
    query SearchArtists($skip: Int, $take: Int, $stageName: String!) {
      searchArtists(skip: $skip, take: $take, stageName: $stageName, where: {isVisible: { eq: true }}) {
        totalCount
        items {
          id
          userId
          stageName
          stageNameUnsigned
          email
          artistType
          avatarImage
          followerCount
          user {
            id
            fullName
            role
            checkUserFollowing
          }
        }
      }
    }
  `);
  
  export const SEARCH_LISTENERS = graphql(`
    query SearchListeners($skip: Int, $take: Int, $displayName: String!) {
      searchListeners(skip: $skip, take: $take, displayName: $displayName) {
        totalCount
        items {
          id
          userId
          displayName
          displayNameUnsigned
          email
          avatarImage
          followerCount
          followingCount
          user {
            fullName
            role
          }
        }
      }
    }
  `);
  
  export const SEARCH_TRACKS = graphql(`
    query SearchTracks($skip: Int, $take: Int, $name: String!) {
      searchTracks(
        skip: $skip
        take: $take
        name: $name
        where: { and: [{ releaseInfo: { isRelease: { eq: true } } }, { restriction: { type: { eq: NONE } } }] }
        order: { createdAt: DESC }
        ) {
        totalCount
        items {
          id
          name
          description
          nameUnsigned
          type
          categoryIds
          mainArtistIds
          createdAt
          mainArtists {
            items {
              id
              userId
              stageName
              artistType
            }
          }
          coverImage
          restriction {
            type
          }
          checkTrackInFavorite
        }
      }
    }
  `);
  
  export const SEARCH_PLAYLISTS = graphql(`
    query SearchPlaylists($skip: Int, $take: Int, $name: String!) {
      searchPlaylists(skip: $skip, take: $take, name: $name, where: { isPublic: { eq: true } }) {
        totalCount
        items {
          id
          userId
          name
          nameUnsigned
          tracksInfo {
            trackId
            addedTime
          }
          coverImage
          isPublic
          user {
            id
            fullName
          }
          checkPlaylistInFavorite
        }
      }
    }
  `);

export const SEARCH_ALBUMS = graphql(`
  query SearchAlbums($skip: Int, $take: Int, $name: String!) {
    searchAlbums(skip: $skip, take: $take, name: $name, where: { isVisible: { eq: true } }, order: { createdAt: DESC }) {
      items {
        id
        name
        nameUnsigned
        coverImage
        description
        isVisible
        createdAt
        checkAlbumInFavorite
        createdBy
      }
      pageInfo {
        hasNextPage
      }
      totalCount
    }
  }
`);