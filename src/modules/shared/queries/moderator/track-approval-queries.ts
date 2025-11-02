import { graphql } from "@/gql";

// Track approval GraphQL queries using proper graphql() function
export const PENDING_TRACK_UPLOAD_REQUESTS_QUERY = graphql(`
  query PendingTrackUploadRequestsList($pageNumber: Int!, $pageSize: Int!) {
      pendingTrackUploadRequests(pageNumber: $pageNumber, pageSize: $pageSize) {
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

// export const PENDING_TRACK_UPLOAD_REQUEST_DETAIL_QUERY = graphql(`
//   query PendingTrackUploadRequestsDetail($where: PaginatedDataOfCombinedUploadRequestFilterInput) {
//     pendingTrackUploadRequests(where: $where) {
//       items {
//         id
//         track {
//           id
//           name
//           description
//           type
//           mainArtistIds
//           featuredArtistIds
//           coverImage
//           isExplicit
//           tags
//           categoryIds
//           lyrics
//           previewVideo
//           createdBy
//           requestedAt
//           releaseInfo {
//             isReleased
//             releaseDate
//             releasedAt
//             releaseStatus
//           }
//           legalDocuments {
//             name
//             documentUrl
//             documentType
//             note
//           }
//         }
//         requestedAt
//         createdBy
//         mainArtists {
//           items {
//             id
//             userId
//             stageName
//             stageNameUnsigned
//             email
//             artistType
//             avatarImage
//           }
//         }
//         featuredArtists {
//           items {
//             id
//             userId
//             stageName
//             stageNameUnsigned
//             email
//             artistType
//             avatarImage
//           }
//         }
//         recordingUsers {
//           items {
//             id
//             email
//             fullName
//             gender
//             birthDate
//             phoneNumber
//             status
//           }
//         }
//         workUsers {
//           items {
//             id
//             email
//             fullName
//             gender
//             birthDate
//             phoneNumber
//             status
//           }
//         }
//         work {
//           id
//           description
//           workSplits {
//                     userId
//                     artistRole
//                     percentage
//                 }
//         }
//         recording {
//           id
//           description
//           recordingSplitRequests {
//                     userId
//                     artistRole
//                     percentage
//                 }
//         }
//       }
//     }
//   }
// `);

export const PENDING_TRACK_UPLOAD_REQUEST_BY_ID_QUERY = graphql(`
  query PendingTrackUploadRequestById($uploadId: String!) {
    pendingTrackUploadRequestById(uploadId: $uploadId) {
      id
        requestedAt
        createdBy
        track {
            id
            name
            description
            type
            mainArtistIds
            featuredArtistIds
            categoryIds
            tags
            coverImage
            previewVideo
            isExplicit
            lyrics
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
        work {
            id
            description
            workSplits {
                userId
                artistRole
                percentage
            }
        }
        recording {
            id
            description
            recordingSplitRequests {
                userId
                artistRole
                percentage
            }
        }
        workUsers {
            items {
                id
                email
                fullName
                gender
                birthDate
                phoneNumber
                status
            }
        }
        recordingUsers {
            items {
                id
                email
                fullName
                gender
                birthDate
                phoneNumber
                status
            }
        }
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
                artistType
            }
        }             
    }
}
`);

export const QUERY_USER_CREATED_BY = graphql(`
  query UserCreatedBy($where: UserFilterInput!) {
    users(where: $where) {
    items {
      id
      email
      fullName
      role
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