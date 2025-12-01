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

export const TrackUploadPendingRequestsQuery = graphql(`
  query TrackUploadPendingRequests($pageNumber: Int!, $pageSize: Int!, $userId: String) {
    pendingTrackUploadRequests(pageNumber: $pageNumber, pageSize: $pageSize, userId: $userId) {
      totalCount
      items {
        id
        track {
          id
          name
          description
          type
          mainArtistIds
          featuredArtistIds
          coverImage
          isExplicit
          tags
          categoryIds
          lyrics
          previewVideo
          createdBy
          requestedAt
          releaseInfo {
            isRelease
            releaseDate
            releasedAt
            releaseStatus
          }
          legalDocuments {
            name
            documentUrl
            documentType
            note
          }
        }
        requestedAt
        createdBy
        mainArtists {
          items {
            id
            userId
            stageName
            stageNameUnsigned
            email
            artistType
            avatarImage
          }
        }
        featuredArtists {
          items {
            id
            userId
            stageName
            stageNameUnsigned
            email
          }
        }
        recordingUsers {
          items {
            id
            email
            fullName
            gender
            birthDate
          }
        }
        workUsers {
          items {
            id
            email
            fullName
            gender
            birthDate
          }
        }
        work {
          id
          description
        }
        recording {
          id
          description
        }
      }
    }
  }
`);

export const TrackUploadPendingRequestDetailQuery = graphql(`
  query TrackUploadPendingRequestDetail($uploadId: String!) {
    pendingTrackUploadRequestById(uploadId: $uploadId) {
      id
      track {
        id
        name
        description
        type
        mainArtistIds
        featuredArtistIds
        coverImage
        isExplicit
        tags
        categoryIds
        lyrics
        previewVideo
        createdBy
        requestedAt
        releaseInfo {
          isRelease
          releaseDate
          releasedAt
          releaseStatus
        }
        legalDocuments {
          name
          documentUrl
          documentType
          note
        }
      }
      requestedAt
      createdBy
      mainArtists {
        items {
          id
          userId
          stageName
          stageNameUnsigned
          email
          artistType
          avatarImage
        }
      }
      featuredArtists {
        items {
          id
          userId
          stageName
          stageNameUnsigned
          email
        }
      }
      recordingUsers {
        items {
          id
          email
          fullName
          gender
          birthDate
        }
      }
      workUsers {
        items {
          id
          email
          fullName
          gender
          birthDate
        }
      }
      work {
        id
        description
      }
      recording {
        id
        description
      }
    }
  }
`);
