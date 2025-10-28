"use client";

import { graphql } from "@/gql";
import TrackSection from "../sections/track-section";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  artistOptions,
  listenerOptions,
  trackDetailOptions,
} from "@/gql/options/client-options";
import TrackOwnerSection from "../sections/track-owner-section";
import TrackRelatedSection from "../sections/track-related-section";
import TrackCommentSection from "../sections/track-comment-section";
import TrackLikeSection from "../sections/track-like-section";
import { useAuthStore } from "@/store";

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
            userId
            stageName
            followerCount
            avatarImage
          }
        }
        checkTrackInFavorite
      }
    }
  }
`);

export const FavoriteTrackMutation = graphql(`
  mutation FavoriteTrack($trackId: String!, $isAdding: Boolean!) {
    updateFavoriteCount(trackId: $trackId, isAdding: $isAdding)
  }
`);

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

export const TrackCommentUpdateMutation = graphql(`
  mutation UpdateTrackComment($commentId: String!, $content: String!) {
    updateTrackComment(request: { commentId: $commentId, content: $content })
  }
`);

export const TrackCommentDeleteMutation = graphql(`
  mutation DeleteTrackComment($commentId: String!) {
    deleteTrackComment(request: { commentId: $commentId })
  }
`);

export const CreateTrackCommentMutation = graphql(`
  mutation CreateTrackComment(
    $targetId: String!
    $commentType: CommentType!
    $content: String!
    $parentCommentId: String
  ) {
    createTrackComment(
      request: {
        targetId: $targetId
        commentType: $commentType
        content: $content
        parentCommentId: $parentCommentId
      }
    )
  }
`);

interface TrackDetailViewProps {
  trackId: string;
}

const TrackDetailView = ({ trackId }: TrackDetailViewProps) => {
  const { user } = useAuthStore();
  const { data } = useSuspenseQuery(trackDetailOptions(trackId));

  const { data: artistData } = useQuery(
    artistOptions(user?.userId || "", user?.artistId || ""),
  );
  const { data: listenerData } = useQuery(
    listenerOptions(user?.userId || "", user?.listenerId || ""),
  );

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8">
        <TrackSection trackId={trackId} data={data} />

        <div className="grid w-full grid-cols-12 gap-8 px-8">
          <div className="col-span-9 space-y-8">
            <TrackOwnerSection data={data} artistData={artistData} />
            <TrackCommentSection
              trackId={trackId}
              listenerData={listenerData}
              artistData={artistData}
            />
          </div>
          <div className="col-span-3 space-y-8">
            <TrackRelatedSection />
            <TrackLikeSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetailView;
