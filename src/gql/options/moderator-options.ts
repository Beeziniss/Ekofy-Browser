import { GetUserProfileQuery } from "@/modules/shared/queries/moderator/moderator-profile-queries";
import { PendingArtistRegistrationsDetailQuery } from "@/modules/shared/queries/moderator/artist-approval-queries";
import { PendingArtistRegistrationsQuery } from "@/modules/shared/queries/moderator/artist-approval-queries";
import {
  ModeratorApprovalHistoryDetailQuery,
  ApprovalHistoriesListQuery,
} from "@/modules/shared/queries/moderator/approval-histories-queries";
// import { PendingArtistPackagesQuery } from "@/modules/shared/queries/artist/artist-packages-queries";
import { execute } from "../execute";
import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import {
  UserRole,
  UserFilterInput,
  ModeratorApprovalHistoryDetailQuery as ModeratorApprovalHistoryDetailQueryType,
  ApprovalHistoryFilterInput,
  ApprovalType,
  HistoryActionType,
  PackageOrderFilterInput,
  PackageOrderSortInput,
  PackageOrderStatus,
  SortEnumType,
  MessageFilterInput,
  // PaginatedDataOfPendingArtistPackageResponseFilterInput,
} from "@/gql/graphql";
import {
  ModeratorGetListUser,
  ModeratorGetAnalytics,
} from "@/modules/shared/queries/moderator/user-management-queries";
import {
  MODERATOR_ARTIST_DETAIL_QUERY,
  MODERATOR_LISTENER_DETAIL_QUERY,
} from "@/modules/shared/queries/moderator/user-management-queries";
import {
  PENDING_TRACK_UPLOAD_REQUESTS_QUERY,
  PENDING_TRACK_UPLOAD_REQUEST_BY_ID_QUERY,
  ORIGINAL_FILE_TRACK_UPLOAD_REQUEST_QUERY,
  GetCategory,
} from "@/modules/shared/queries/moderator/track-approval-queries";
import { QUERY_USER_CREATED_BY } from "@/modules/shared/queries/moderator/track-approval-queries";
import { ApprovalPriorityStatus } from "@/types/approval-track";
import {
  PACKAGE_ORDERS_LIST_QUERY,
  PACKAGE_ORDER_DETAIL_QUERY,
  ORDER_CONVERSATION_MESSAGES_QUERY,
} from "@/modules/shared/queries/moderator/order-disputed-querties";

export const moderatorProfileOptions = (userId: string) =>
  queryOptions({
    queryKey: ["moderator-profile", userId],
    queryFn: async () => {
      const result = await execute(GetUserProfileQuery, {
        where: {
          id: { eq: userId },
        },
      });

      // Return first user from items array
      return result.users?.items?.[0] || null;
    },
  });

export const moderatorArtistsQueryOptions = (page: number = 1, pageSize: number = 10, searchTerm: string = "") =>
  queryOptions({
    queryKey: ["artists", page, pageSize, searchTerm],
    queryFn: async () => {
      // Build variables object with nested where filter for items
      const variables: {
        pageNumber: number;
        pageSize: number;
        where?: {
          items?: {
            some?: {
              stageNameUnsigned?: { contains: string };
            };
          };
        };
      } = {
        pageNumber: page,
        pageSize,
      };

      // Add nested stageNameUnsigned filter if searchTerm is provided
      if (searchTerm && searchTerm.trim() !== "") {
        variables.where = {
          items: {
            some: {
              stageNameUnsigned: { contains: searchTerm.trim() },
            },
          },
        };
      }

      const result = await execute(PendingArtistRegistrationsQuery, variables);

      return result;
    },
  });

export const moderatorArtistDetailsQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["artist-details", userId],
    queryFn: async () => {
      const result = await execute(PendingArtistRegistrationsDetailQuery, {
        artistRegistrationId: userId,
      });

      // Return first artist from items array
      return result.pendingArtistRegistrationById || null;
    },
  });

// User analytics query options for moderator (for stats cards - independent of search)
export const moderatorUserAnalyticsOptions = () =>
  queryOptions({
    queryKey: ["moderator-user-analytics"],
    queryFn: async () => {
      // Get all users for analytics without pagination or search filters
      const where: UserFilterInput = {
        role: {
          in: [UserRole.Listener, UserRole.Artist],
        },
      };

      const result = await execute(ModeratorGetAnalytics, {
        skip: 0,
        take: 50, // Large number to get all users for stats
        where,
      });

      return result;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes since stats don't change frequently
  });

// User management query options for moderator (for table - affected by search)
export const moderatorUsersQueryOptions = (page: number = 1, pageSize: number = 10, searchTerm: string = "") =>
  queryOptions({
    queryKey: ["moderator-users", page, pageSize, searchTerm],
    queryFn: async () => {
      const skip = (page - 1) * pageSize;

      // Build where filter with proper UserRole enum values
      const where: UserFilterInput = {
        // Filter for only Listener and Artist roles using 'in' operator with enum values
        role: {
          in: [UserRole.Listener, UserRole.Artist],
        },
      };
      // Add fullName search filter if provided (using 'contains' like track name search)
      if (searchTerm.trim()) {
        where.fullName = {
          contains: searchTerm,
        };
      }
      const result = await execute(ModeratorGetListUser, {
        skip,
        take: pageSize,
        where,
      });

      return result;
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
  });

// Artist detail query options for moderator
export const moderatorArtistDetailOptions = (artistId: string) =>
  queryOptions({
    queryKey: ["moderator-artist-detail", artistId],
    queryFn: async () => {
      const result = await execute(MODERATOR_ARTIST_DETAIL_QUERY, {
        id: artistId,
      });

      return result?.artists?.items?.[0] || null;
    },
  });

// Listener detail query options for moderator
export const moderatorListenerDetailOptions = (userId: string) =>
  queryOptions({
    queryKey: ["moderator-listener-detail", userId],
    queryFn: async () => {
      const result = await execute(MODERATOR_LISTENER_DETAIL_QUERY, {
        id: userId,
      });

      return result?.listeners?.items?.[0] || null;
    },
  });

// User detail query options for moderator - using same structure as admin
export const moderatorUserDetailOptions = (userId: string) =>
  queryOptions({
    queryKey: ["moderator-user-detail", userId],
    queryFn: async () => {
      // Get user detail using the existing query with single user filter
      const result = await execute(ModeratorGetListUser, {
        skip: 0,
        take: 1,
        where: {
          id: { eq: userId },
        },
      });
      // Return structured data like admin
      return {
        user: result.users?.items?.[0] || null,
        artists: result.artists?.items || [],
        listeners: result.listeners?.items || [],
      };
    },
  });

// Approval histories query options for moderator
export const moderatorApprovalHistoriesOptions = (
  page: number = 1, 
  pageSize: number = 10, 
  searchTerm: string = "",
  approvalType: string = "ALL",
  action: string = "ALL"
) =>
  queryOptions({
    queryKey: ["moderator-approval-histories", page, pageSize, searchTerm, approvalType, action],
    queryFn: async () => {
      const skip = (page - 1) * pageSize;
      const where: ApprovalHistoryFilterInput = {};
      
      // Filter by approval type if not "ALL"
      if (approvalType !== "ALL") {
        where.approvalType = { eq: approvalType as ApprovalType };
      }
      
      // Filter by action if not "ALL"
      if (action !== "ALL") {
        where.action = { eq: action as HistoryActionType };
      }
      
      // Add search filter if search term is provided
      if (searchTerm.trim()) {
        where.snapshot = {
          contains: searchTerm,
        };
      }
      
      const result = (await execute(ApprovalHistoriesListQuery, {
        skip,
        take: pageSize,
        where,
      })) as {
        approvalHistories: {
          totalCount: number;
          items: unknown[];
          pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
        };
      };

      return result;
    },
    placeholderData: (previousData) => previousData,
  });

// Approval history detail query options for moderator
export const moderatorApprovalHistoryDetailOptions = (historyId: string) =>
  queryOptions({
    queryKey: ["moderator-approval-history-detail", historyId],
    queryFn: async () => {
      const result = (await execute(ModeratorApprovalHistoryDetailQuery, {
        where: { id: { eq: historyId } },
      })) as ModeratorApprovalHistoryDetailQueryType;

      // Return first item from items array or null if not found
      return result?.approvalHistories?.items?.[0] || null;
    },
  });

// Track approval query options for moderator
export const moderatorPendingTracksOptions = (
  page: number = 1,
  pageSize: number = 10,
  searchTerm: string = "",
  priority: ApprovalPriorityStatus | "ALL" = "ALL"
) =>
  queryOptions({
    queryKey: ["moderator-pending-tracks", page, pageSize, searchTerm, priority],
    queryFn: async () => {
      const variables: {
        pageNumber: number;
        pageSize: number;
        priority?: ApprovalPriorityStatus;
        // Uncomment when GraphQL supports search
        // where?: {
        //   items?: {
        //     some?: {
        //       track?: {
        //         name?: { contains: string };
        //       };
        //     };
        //   };
        // };
      } = {
        pageNumber: page,
        pageSize,
      };

      // Add priority filter if not "ALL"
      if (priority !== "ALL") {
        variables.priority = priority;
      }

      // TODO: Uncomment when GraphQL supports search functionality
      // Add track name search filter if provided
      // if (searchTerm.trim()) {
      //   variables.where = {
      //     items: {
      //       some: {
      //         track: {
      //           name: { contains: searchTerm },
      //         },
      //       },
      //     },
      //   };
      // }

      const result = await execute(PENDING_TRACK_UPLOAD_REQUESTS_QUERY, variables);
      return result;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

// Track detail query options for moderator
export const moderatorTrackDetailOptions = (uploadId: string) =>
  queryOptions({
    queryKey: ["moderator-track-detail", uploadId],
    queryFn: async () => {
      const result = await execute(PENDING_TRACK_UPLOAD_REQUEST_BY_ID_QUERY, {
        uploadId: uploadId,
      });

      return result.pendingTrackUploadRequestById || null;
    },
    enabled: !!uploadId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// Original file track query options
export const moderatorTrackOriginalFileOptions = (uploadId: string) =>
  queryOptions({
    queryKey: ["moderator-track-original-file", uploadId],
    queryFn: async () => {
      // First get the track details to get the track ID
      const trackResult = await execute(PENDING_TRACK_UPLOAD_REQUEST_BY_ID_QUERY, { uploadId });
      const trackId = trackResult.pendingTrackUploadRequestById?.track?.id;

      if (!trackId) {
        throw new Error("Track ID not found");
      }

      const result = await execute(ORIGINAL_FILE_TRACK_UPLOAD_REQUEST_QUERY, { trackId });
      return result.originalFileTrackUploadRequest;
    },
    enabled: !!uploadId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

// export const moderatorPendingPackagesOptions = (page: number = 1, pageSize: number = 10, searchTerm: string = "") =>
//   queryOptions({
//     queryKey: ["moderator-pending-packages", page, pageSize, searchTerm],
//     queryFn: () => {
//       let where: PaginatedDataOfPendingArtistPackageResponseFilterInput | undefined = undefined;

//       // Add packageName filter if search term is provided
//       if (searchTerm.trim()) {
//         where = {
//           items: {
//             some: {
//               packageName: { contains: searchTerm },
//             },
//           },
//         };
//       }

//       return execute(PendingArtistPackagesQuery, {
//         pageNumber: page,
//         pageSize: pageSize,
//         where, // Apply search filter if provided
//         artistWhere: {}, // Get all artists
//       });
//     },
//     staleTime: 1 * 60 * 1000, // 1 minute
//   });

// User created by query options for moderator (for track detail)
export const moderatorUserCreatedByOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-created-by", userId],
    queryFn: async () => {
      const result = await execute(QUERY_USER_CREATED_BY, {
        where: {
          id: {
            eq: userId,
          },
        },
      });
      return result?.users?.items?.[0] || null;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// Categories query options for moderator
export const moderatorCategoriesOptions = (categoryIds: string[]) =>
  queryOptions({
    queryKey: ["moderator-categories", categoryIds],
    queryFn: async () => {
      if (!categoryIds || categoryIds.length === 0) {
        return { categories: { items: [] } };
      }

      const result = await execute(GetCategory, {
        where: {
          id: {
            in: categoryIds,
          },
        },
      });
      return result;
    },
    enabled: !!categoryIds && categoryIds.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
  });

// Package Orders query options for moderator (table view)
export const moderatorPackageOrdersOptions = (
  page: number = 1,
  pageSize: number = 10,
  where?: PackageOrderFilterInput,
  order?: PackageOrderSortInput[]
) =>
  queryOptions({
    queryKey: ["moderator-package-orders", page, pageSize, where, order],
    queryFn: async () => {
      const skip = (page - 1) * pageSize;
      
      const result = await execute(PACKAGE_ORDERS_LIST_QUERY, {
        take: pageSize,
        skip,
        where,
        order,
      });

      return result.packageOrders;
    },
    staleTime: 30 * 1000, // 30 seconds - orders can change frequently
  });

// Package Orders (Disputed) query options for moderator
export const moderatorDisputedPackageOrdersOptions = (
  page: number = 1,
  pageSize: number = 10,
  order?: PackageOrderSortInput[]
) =>
  queryOptions({
    queryKey: ["moderator-disputed-package-orders", page, pageSize, order],
    queryFn: async () => {
      const skip = (page - 1) * pageSize;
      
      const result = await execute(PACKAGE_ORDERS_LIST_QUERY, {
        take: pageSize,
        skip,
        where: {
          status: { eq: PackageOrderStatus.Disputed },
        },
        order : [ { createdAt: SortEnumType.Desc } ],
      });

      return result.packageOrders;
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true, // Refetch when component mounts to get fresh data
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });

// Package Order Detail query options for moderator
export const moderatorPackageOrderDetailOptions = (orderId: string) =>
  queryOptions({
    queryKey: ["moderator-package-order-detail", orderId],
    queryFn: async () => {
      const result = await execute(PACKAGE_ORDER_DETAIL_QUERY, {
        where: {
          id: { eq: orderId },
        },
      });

      return result.packageOrders?.items?.[0] || null;
    },
    enabled: !!orderId,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: false, // Prevent refetch on mount
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });

// Order Conversation Messages query options for moderator
// Using cursor-based infinite query for pagination like client conversation
export const moderatorOrderConversationMessagesOptions = (conversationId: string, pageSize: number = 50) =>
  infiniteQueryOptions({
    queryKey: ["moderator-order-conversation-messages", conversationId],
    queryFn: async ({ pageParam }) => {
      const where: MessageFilterInput = { conversationId: { eq: conversationId } };
      
      const result = await execute(ORDER_CONVERSATION_MESSAGES_QUERY, {
        where,
        first: pageSize, // Load first N messages
        after: pageParam as string | undefined, // Cursor for next page
      });

      return result;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      // Return next cursor if there are more pages
      return lastPage.messages?.pageInfo.hasNextPage
        ? lastPage.messages?.pageInfo.endCursor
        : undefined;
    },
    enabled: !!conversationId,
  });
