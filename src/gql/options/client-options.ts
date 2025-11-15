import { execute } from "../execute";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  CheckTrackInPlaylistQuery,
  PlaylistBriefQuery,
  PlaylistDetailQuery,
  PlaylistDetailTrackListQuery,
} from "@/modules/client/playlist/ui/views/playlist-detail-view";
import {
  RequestFilterInput,
  QueryInitializationRequestsArgs,
  QueryInitializationRequestDetailByIdArgs,
  QueryInitializationSearchRequestsArgs,
  QueryInitializationOwnRequestsArgs,
} from "../graphql";
import {
  ArtistDetailQuery,
  ArtistListQuery,
  ArtistPackageQuery,
  ArtistQuery,
  FollowerQuery,
  FollowingQuery,
  GetListenerProfileQuery,
  GetUserActiveSubscriptionQuery,
  ListenerQuery,
  OWN_REQUESTS_QUERY,
  PlaylistsHomeQuery,
  PlaylistsPersonalQuery,
  REQUEST_BY_ID_QUERY,
  REQUEST_HUB_QUERY,
  RequestHubCommentThreadRepliesQuery,
  RequestHubCommentThreadsQuery,
  SEARCH_REQUESTS_QUERY,
  TrackCommentRepliesQuery,
  TrackCommentsQuery,
  TrackDetailViewQuery,
  TrackListHomeQuery,
  USER_QUERY_FOR_REQUESTS,
} from "@/modules/shared/queries/client";

// PROFILE QUERIES
export const listenerProfileOptions = (userId: string, enabled: boolean = true) =>
  queryOptions({
    queryKey: ["listener-profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const result = await execute(GetListenerProfileQuery, {
        where: { userId: { eq: userId } },
      });
      return result.listeners?.items?.[0] || null;
    },
    retry: 0,
    enabled: !!userId && enabled,
  });

export const userActiveSubscriptionOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-active-subscription", userId],
    queryFn: async () => {
      if (!userId) return null;
      const result = await execute(GetUserActiveSubscriptionQuery, {
        where: {
          userId: { eq: userId },
          isActive: { eq: true },
        },
        take: 1,
        skip: 0,
      });
      return result.userSubscriptions?.items?.[0] || null;
    },
    retry: 0,
    enabled: !!userId,
  });

// TRACK QUERIES
export const trackListHomeOptions = queryOptions({
  queryKey: ["tracks-home"],
  queryFn: async () => await execute(TrackListHomeQuery, { take: 10 }),
});

export const trackDetailOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["track-detail", trackId],
    queryFn: async () => await execute(TrackDetailViewQuery, { trackId }),
    enabled: !!trackId,
  });

// PLAYLIST QUERIES
export const playlistsHomeOptions = queryOptions({
  queryKey: ["playlists-home"],
  queryFn: async () => await execute(PlaylistsHomeQuery, { take: 10 }),
});

export const playlistOptions = (userId: string, name?: string, take: number = 12) =>
  infiniteQueryOptions({
    queryKey: ["playlists", userId, name],
    queryFn: async ({ pageParam }) => {
      const skip = (pageParam - 1) * take;
      return await execute(PlaylistsPersonalQuery, {
        userId,
        name,
        take,
        skip,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.playlists?.pageInfo.hasNextPage ? allPages.length + 1 : undefined;
    },
    enabled: !!userId,
  });

export const playlistDetailOptions = (playlistId: string) =>
  queryOptions({
    queryKey: ["playlist-detail", playlistId],
    queryFn: async () => await execute(PlaylistDetailQuery, { playlistId }),
  });

export const playlistDetailTrackListOptions = (playlistId: string) =>
  queryOptions({
    queryKey: ["playlist-detail-tracklist", playlistId],
    queryFn: async () => await execute(PlaylistDetailTrackListQuery, { playlistId }),
  });

export const playlistBriefOptions = (userId: string) =>
  queryOptions({
    queryKey: ["playlist-brief", userId],
    queryFn: async () => await execute(PlaylistBriefQuery, { userId }),
  });

export const checkTrackInPlaylistOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["check-track-in-playlist", trackId],
    queryFn: async () => await execute(CheckTrackInPlaylistQuery, { trackId }),
  });

// TRACK COMMENTS QUERIES
export const trackCommentsOptions = (targetId: string) =>
  queryOptions({
    queryKey: ["track-comments", targetId],
    queryFn: async () => await execute(TrackCommentsQuery, { targetId }),
    enabled: !!targetId,
  });

export const trackCommentRepliesOptions = (rootCommentId: string) =>
  queryOptions({
    queryKey: ["track-comment-replies", rootCommentId],
    queryFn: async () => await execute(TrackCommentRepliesQuery, { rootCommentId }),
  });

// REQUEST HUB COMMENTS QUERIES
export const requestHubCommentsOptions = (targetId: string) =>
  queryOptions({
    queryKey: ["request-hub-comments", targetId],
    queryFn: async () => await execute(RequestHubCommentThreadsQuery, { targetId }),
    enabled: !!targetId,
  });

export const requestHubCommentRepliesOptions = (rootCommentId: string) =>
  queryOptions({
    queryKey: ["request-hub-comment-replies", rootCommentId],
    queryFn: async () => await execute(RequestHubCommentThreadRepliesQuery, { rootCommentId }),
  });

// USER QUERIES
export const listenerOptions = (userId: string, listenerId?: string) =>
  queryOptions({
    queryKey: ["listener", userId],
    queryFn: async () => await execute(ListenerQuery, { userId }),
    enabled: !!listenerId,
  });

export const artistOptions = ({ userId, artistId }: { userId: string; artistId?: string }) =>
  queryOptions({
    queryKey: ["artist", userId],
    queryFn: async () => await execute(ArtistQuery, { userId }),
    enabled: !!artistId,
  });

export const artistDetailOptions = (artistId: string) =>
  queryOptions({
    queryKey: ["artist-detail", artistId],
    queryFn: async () => await execute(ArtistDetailQuery, { artistId }),
    enabled: !!artistId,
  });

export const artistListOptions = (take: number = 12) =>
  infiniteQueryOptions({
    queryKey: ["artist-list"],
    queryFn: async ({ pageParam }) => {
      const skip = (pageParam - 1) * take;
      return await execute(ArtistListQuery, { take, skip });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.artists?.pageInfo.hasNextPage ? allPages.length + 1 : undefined;
    },
  });

// FOLLOW QUERIES
export const followerOptions = ({ artistId, userId }: { artistId?: string; userId?: string }) =>
  queryOptions({
    queryKey: ["follower", artistId],
    queryFn: async () => await execute(FollowerQuery, { artistId, userId }),
    enabled: !!artistId,
  });

export const followingOptions = ({ artistId, userId }: { artistId?: string; userId?: string }) =>
  queryOptions({
    queryKey: ["following", artistId],
    queryFn: async () => await execute(FollowingQuery, { artistId, userId }),
    enabled: !!artistId,
  });

// SERVICE PACKAGE QUERIES
export const servicePackageOptions = (artistId: string) =>
  queryOptions({
    queryKey: ["service-packages", artistId],
    queryFn: async () => await execute(ArtistPackageQuery, { artistId }),
  });

// Helper function to convert deadline string to Date
const convertRequestDeadlines = <T extends { deadline?: string | Date }>(items: T[] | null | undefined): T[] => {
  return (
    items?.map((item) => ({
      ...item,
      deadline: item.deadline ? (typeof item.deadline === "string" ? new Date(item.deadline) : item.deadline) : null,
    })) || []
  );
};

// REQUEST HUB QUERIES
export const requestHubOptions = (skip: number = 0, take: number = 20, where?: RequestFilterInput) =>
  queryOptions({
    queryKey: ["requests", skip, take, where],
    queryFn: async () => {
      const variables: QueryInitializationRequestsArgs = { skip, take, where };
      const result = await execute(REQUEST_HUB_QUERY, variables);
      const requests = result.requests || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
      return {
        ...requests,
        items: convertRequestDeadlines(requests.items),
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

export const requestByIdOptions = (requestId: string) =>
  queryOptions({
    queryKey: ["request", requestId],
    queryFn: async () => {
      const variables: QueryInitializationRequestDetailByIdArgs = { requestId };
      const result = await execute(REQUEST_BY_ID_QUERY, variables);
      const request = result.requestDetailById;
      if (!request) return null;
      return {
        ...request,
        deadline: request.deadline ? new Date(request.deadline) : null,
      };
    },
    enabled: !!requestId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const searchRequestsOptions = (
  searchTerm: string,
  skip: number = 0,
  take: number = 20,
  isIndividual: boolean = true,
) =>
  queryOptions({
    queryKey: ["search-requests", searchTerm, skip, take, isIndividual],
    queryFn: async () => {
      const variables: QueryInitializationSearchRequestsArgs = {
        searchTerm,
        skip,
        take,
        isIndividual,
      };
      const result = await execute(SEARCH_REQUESTS_QUERY, variables);
      const requests = result.searchRequests || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
      return {
        ...requests,
        items: convertRequestDeadlines(requests.items),
      };
    },
    enabled: !!searchTerm.trim(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

export const userForRequestsOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-for-requests", userId],
    queryFn: async () => {
      const result = await execute(USER_QUERY_FOR_REQUESTS, { userId });
      return result.users?.items?.[0] || null;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const myRequestsOptions = (skip: number = 0, take: number = 20, where?: RequestFilterInput) =>
  queryOptions({
    queryKey: ["my-requests", skip, take, where],
    queryFn: async () => {
      const variables: QueryInitializationOwnRequestsArgs = {
        skip,
        take,
        where,
      };
      const result = await execute(OWN_REQUESTS_QUERY, variables);
      const requests = result.ownRequests || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
      return {
        ...requests,
        items: convertRequestDeadlines(requests.items),
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
