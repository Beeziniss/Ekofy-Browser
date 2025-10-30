import { graphql } from "@/gql";

export const TrackCommentsQuery = graphql(`
  query TrackThreadComments($targetId: String!) {
    threadedComments(
      request: {
        targetId: $targetId
        commentType: TRACK
        page: 1
        pageSize: 10
        sortOrder: THREAD_ACTIVITY
      }
    ) {
      threads {
        rootComment {
          id
          content
          createdAt
          replyCount
          commenterId
          commenter {
            fullName
            email
            isVerified
            role
            userId
            listener {
              avatarImage
              displayName
              followerCount
              id
              isVerified
            }
            artist {
              avatarImage
              stageName
              followerCount
              id
              isVerified
              popularity
            }
          }
          commentType
          isDeleted
          isEdited
          depth
          targetId
          threadPath
          threadUpdatedAt
          totalRepliesCount
        }
        replies {
          id
          content
          createdAt
          replyCount
          commenterId
          commenter {
            fullName
            email
            isVerified
            role
            userId
            listener {
              avatarImage
              displayName
              followerCount
              id
              isVerified
            }
            artist {
              avatarImage
              stageName
              followerCount
              id
              isVerified
              popularity
            }
          }
          commentType
          isDeleted
          isEdited
          depth
          targetId
          threadPath
          threadUpdatedAt
          totalRepliesCount
        }
        totalReplies
      }
      totalThreads
    }
  }
`);

export const TrackCommentRepliesQuery = graphql(`
  query TrackCommentReplies($rootCommentId: String!) {
    commentReplies(
      request: {
        commentId: $rootCommentId
        page: 1
        pageSize: 10
        sortOrder: CHRONOLOGICAL
      }
    ) {
      replies {
        id
        content
        createdAt
        commenterId
        commentType
        commenter {
          fullName
          email
          isVerified
          role
          userId
          listener {
            avatarImage
            displayName
            followerCount
            id
            isVerified
          }
          artist {
            avatarImage
            stageName
            followerCount
            id
            isVerified
            popularity
          }
        }
        depth
        isDeleted
        isEdited
        replyCount
        targetId
        threadPath
        totalRepliesCount
        threadUpdatedAt
      }
    }
  }
`);
