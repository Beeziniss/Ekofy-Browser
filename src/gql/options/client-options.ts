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
  ConversationFilterInput,
  MessageFilterInput,
  ArtistPackageFilterInput,
  ArtistPackageStatus,
  PackageOrderFilterInput,
  CategoryType,
  ConversationStatus,
  UserFilterInput,
  NotificationFilterInput,
} from "../graphql";
import {
  ArtistDetailQuery,
  ArtistListQuery,
  ArtistPackageQuery,
  ArtistQuery,
  FollowerInfiniteQuery,
  FollowerQuery,
  FollowingInfiniteQuery,
  FollowingQuery,
  GetListenerProfileQuery,
  GetUserActiveSubscriptionQuery,
  ListenerQuery,
  OWN_REQUESTS_QUERY,
  PlaylistsFavoriteQuery,
  PlaylistsHomeQuery,
  PlaylistsPersonalQuery,
  REQUEST_BY_ID_QUERY,
  REQUEST_HUB_QUERY,
  RequestHubCommentThreadRepliesQuery,
  RequestHubCommentThreadsQuery,
  SEARCH_REQUESTS_QUERY,
  SuggestedTracksForPlaylistQuery,
  TrackCommentRepliesQuery,
  TrackCommentsQuery,
  TrackDetailViewQuery,
  TrackFavoriteQuery,
  TrackListHomeQuery,
  USER_QUERY_FOR_REQUESTS,
  UserBasicInfoQuery,
} from "@/modules/shared/queries/client";
import { ConversationMessagesQuery, ConversationQuery } from "@/modules/shared/queries/client/conversation-queries";
import { OrderPackageQuery } from "@/modules/shared/queries/client/order-queries";
import { CategoriesChannelQuery } from "@/modules/shared/queries/client/category-queries";
import { NotificationQuery } from "@/modules/shared/queries/client/notification-queries";

// PROFILE QUERIES
export const userBasicInfoOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-basic-info", userId],
    queryFn: async () => {
      if (!userId) return null;
      const result = await execute(UserBasicInfoQuery, {
        userId,
      });
      return result.users?.items?.[0] || null;
    },
    retry: 0,
    enabled: !!userId,
  });

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
        skip: 0,
      });
      return result.userSubscriptions?.items?.[0] || null;
    },
    retry: 0,
    enabled: !!userId,
  });

export const userSubscriptionOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-subscription", userId],
    queryFn: async () => {
      if (!userId) return null;
      const result = await execute(GetUserActiveSubscriptionQuery, {
        where: {
          userId: { eq: userId },
        },
        skip: 0,
      });
      return result.userSubscriptions || null;
    },
    retry: 0,
    enabled: !!userId,
  });

// TRACK QUERIES
export const trackListHomeOptions = queryOptions({
  queryKey: ["tracks-home"],
  queryFn: async () => await execute(TrackListHomeQuery, { take: 12 }),
});

export const trackDetailOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["track-detail", trackId],
    queryFn: async () => await execute(TrackDetailViewQuery, { trackId }),
    enabled: !!trackId,
    retry: 0,
  });

export const trackFavoriteOptions = (take: number = 12, skip: number = 0, isAuthenticated: boolean) =>
  queryOptions({
    queryKey: ["track-favorite", take, skip],
    queryFn: async () => await execute(TrackFavoriteQuery, { take, skip }),
    enabled: isAuthenticated,
  });

export const suggestedTracksForPlaylistOptions = (playlistId: string, nameUnsigned: string = "", take: number = 12) =>
  queryOptions({
    queryKey: ["suggested-tracks-for-playlist", playlistId, nameUnsigned],
    queryFn: async () => {
      // First, fetch the current tracks in the playlist
      const playlistData = await execute(PlaylistDetailTrackListQuery, { playlistId });
      const existingTrackIds =
        playlistData.playlists?.items?.[0]?.tracks?.items?.map((track) => track?.id).filter(Boolean) || [];

      // Then fetch suggested tracks excluding the existing ones
      return await execute(SuggestedTracksForPlaylistQuery, {
        take,
        excludeTrackIds: existingTrackIds.length > 0 ? existingTrackIds : null,
        nameUnsigned,
      });
    },
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

export const playlistsFavoriteOptions = (take: number = 12, isAuthenticated: boolean) =>
  queryOptions({
    queryKey: ["playlists-favorite"],
    queryFn: async () => await execute(PlaylistsFavoriteQuery, { take }),
    enabled: isAuthenticated,
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

export const followerInfiniteOptions = (userId: string, take: number = 12, name?: string) =>
  infiniteQueryOptions({
    queryKey: ["follower-infinite", userId],
    queryFn: async ({ pageParam }) => {
      const where: UserFilterInput = {
        or: [{ fullName: { contains: name } }, { fullNameUnsigned: { contains: name } }],
      };

      const skip = (pageParam - 1) * take;
      return await execute(FollowerInfiniteQuery, { userId, where, take, skip });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.followers?.pageInfo.hasNextPage ? allPages.length + 1 : undefined;
    },
    enabled: !!userId,
  });

export const followingInfiniteOptions = (userId: string, take: number = 12, name?: string) =>
  infiniteQueryOptions({
    queryKey: ["following-infinite", userId],
    queryFn: async ({ pageParam }) => {
      const where: UserFilterInput = {
        or: [{ fullName: { contains: name } }, { fullNameUnsigned: { contains: name } }],
      };

      const skip = (pageParam - 1) * take;
      return await execute(FollowingInfiniteQuery, { userId, where, take, skip });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.followings?.pageInfo.hasNextPage ? allPages.length + 1 : undefined;
    },
    enabled: !!userId,
  });

// SERVICE PACKAGE QUERIES
export const servicePackageOptions = ({ artistId, serviceId }: { artistId?: string; serviceId?: string }) =>
  queryOptions({
    queryKey: ["service-packages", artistId],
    queryFn: async () => {
      const where: ArtistPackageFilterInput = {
        status: { eq: ArtistPackageStatus.Enabled },
      };

      if (artistId) {
        where.artistId = { eq: artistId };
      }

      if (serviceId) {
        where.id = { eq: serviceId };
      }

      return await execute(ArtistPackageQuery, { where });
    },
  });

// Helper function to convert deadline string to Date
// const convertRequestDeadlines = <T extends { deadline?: string | Date }>(items: T[] | null | undefined): T[] => {
//   return (
//     items?.map((item) => ({
//       ...item,
//       deadline: item.deadline ? (typeof item.deadline === "string" ? new Date(item.deadline) : item.deadline) : null,
//     })) || []
//   );
// };

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
        items: requests.items,
      };
    },
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
        duration: request.duration,
      };
    },
    enabled: !!requestId,
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
        items: requests.items,
      };
    },
    enabled: !!searchTerm.trim(),
  });

export const userForRequestsOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-for-requests", userId],
    queryFn: async () => {
      const result = await execute(USER_QUERY_FOR_REQUESTS, { userId });
      return result.users?.items?.[0] || null;
    },
    enabled: !!userId,
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
        items: requests.items,
      };
    },
  });

// CONVERSATION QUERIES
export const conversationListOptions = (userId: string, status?: ConversationStatus) =>
  queryOptions({
    queryKey: ["conversation-list", userId, status],
    queryFn: async () => {
      const where: ConversationFilterInput = {
        userIds: { some: { eq: userId } },
      };

      if (status) {
        where.status = { eq: status };
      }

      const result = await execute(ConversationQuery, { where });
      return result;
    },
    enabled: !!userId,
  });

export const conversationDetailOptions = (coversationId: string) =>
  queryOptions({
    queryKey: ["conversation-detail", coversationId],
    queryFn: async () => {
      const where: ConversationFilterInput = { id: { eq: coversationId } };
      const result = await execute(ConversationQuery, { where });
      return result;
    },
  });

export const conversationDetailByRequestOptions = (requestId: string) =>
  queryOptions({
    queryKey: ["conversation-detail-by-request", requestId],
    queryFn: async () => {
      const where: ConversationFilterInput = { requestId: { eq: requestId } };
      const result = await execute(ConversationQuery, { where });
      return result;
    },
  });

export const conversationMessagesOptions = (conversationId: string) =>
  queryOptions({
    queryKey: ["conversation-messages", conversationId],
    queryFn: async () => {
      const where: MessageFilterInput = { conversationId: { eq: conversationId } };
      const result = await execute(ConversationMessagesQuery, { where });

      return result;
    },
  });

// ORDER PACKAGE QUERIES
export const orderPackageOptions = ({
  skip = 0,
  take = 10,
  currentUserId,
  otherUserId,
  isArtist,
  conversationId,
}: {
  skip?: number;
  take?: number;
  currentUserId?: string;
  otherUserId?: string;
  isArtist?: boolean;
  conversationId?: string;
}) =>
  queryOptions({
    queryKey: ["order-packages", skip, take, currentUserId, otherUserId, isArtist, conversationId],
    queryFn: async () => {
      const where: PackageOrderFilterInput = {};

      if (isArtist) {
        where.providerId = { eq: currentUserId };

        if (otherUserId) where.clientId = { eq: otherUserId };
      } else {
        where.clientId = { eq: currentUserId };

        if (otherUserId) where.providerId = { eq: otherUserId };
      }

      if (conversationId) {
        where.conversationId = { eq: conversationId };
      }

      const result = await execute(OrderPackageQuery, { where, skip, take });
      return result;
    },
    enabled: !!(currentUserId && otherUserId),
  });

export const orderPackageDetailOptions = (orderId: string) =>
  queryOptions({
    queryKey: ["order-package-detail", orderId],
    queryFn: async () => {
      const where: PackageOrderFilterInput = { id: { eq: orderId } };
      const result = await execute(OrderPackageQuery, { where });
      return result?.packageOrders?.items?.[0] || null;
    },
    enabled: !!orderId,
  });

// CATEGORY QUERIES
export const categoriesChannelOptions = (type: CategoryType, take: number) =>
  queryOptions({
    queryKey: ["categories-channel", type, take],
    queryFn: async () => {
      const result = await execute(CategoriesChannelQuery, { type, take });
      return result;
    },
    enabled: !!type,
  });

// NOTIFICATION QUERIES
export const notificationOptions = ({ userId, first = 5, after }: { userId: string; first?: number; after?: string }) =>
  queryOptions({
    queryKey: ["notifications", userId, first, after],
    queryFn: async () => {
      const where: NotificationFilterInput = { targetId: { eq: userId } };
      const result = await execute(NotificationQuery, { where, first, after });
      return result;
    },
  });

export const notificationInfiniteOptions = (userId: string, first: number = 5) =>
  infiniteQueryOptions({
    queryKey: ["notifications-infinite", userId],
    queryFn: async ({ pageParam }) => {
      const where: NotificationFilterInput = { targetId: { eq: userId } };
      return await execute(NotificationQuery, {
        where,
        first,
        after: pageParam,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage.notifications?.pageInfo.hasNextPage ? lastPage.notifications?.pageInfo.endCursor : undefined;
    },
    enabled: !!userId,
  });
