"use client";

import { graphql } from "@/gql";

// Track approval GraphQL queries using proper graphql() function
export const PENDING_TRACK_UPLOAD_REQUESTS_QUERY = graphql(`
  query PendingTrackUploadRequestsList($pageNumber: Int!, $pageSize: Int!, $where: PaginatedDataOfCombinedUploadRequestFilterInput) {
    pendingTrackUploadRequests(pageNumber: $pageNumber, pageSize: $pageSize, where: $where) {
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
            isReleased
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

export const PENDING_TRACK_UPLOAD_REQUEST_DETAIL_QUERY = graphql(`
  query PendingTrackUploadRequestsDetail($where: PaginatedDataOfCombinedUploadRequestFilterInput) {
    pendingTrackUploadRequests(where: $where) {
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
            isReleased
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

export const ORIGINAL_FILE_TRACK_UPLOAD_REQUEST_QUERY = graphql(`
  query OriginalFileTrackUploadRequest($trackId: String!) {
    originalFileTrackUploadRequest(trackId: $trackId)
  }
`);

// Mutations for track approval actions
export const RejectTrackUploadRequestMutation = graphql(`
  mutation RejectTrackUploadRequest($uploadId: String!, $reasonReject: String!) {
    rejectTrackUploadRequest(uploadId: $uploadId, reasonReject: $reasonReject)
  }
`);

export const ApproveTrackUploadRequestMutation = graphql(`
  mutation ApproveTrackUploadRequest($uploadId: String!) {
    approveTrackUploadRequest(uploadId: $uploadId)
  }
`);