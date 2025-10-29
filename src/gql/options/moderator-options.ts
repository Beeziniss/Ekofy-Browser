import { GetUserProfileQuery } from "@/modules/moderator/profile/ui/views/moderator-profile-view";
import { 
  PendingArtistRegistrationsDetailQuery, 
} from "@/modules/moderator/artist-approval/ui/views/artist-details-view";
import { PendingArtistRegistrationsQuery } from "@/modules/moderator/artist-approval/ui/views/artist-approval-view";
import { ModeratorApprovalHistoryDetailQuery, ApprovalHistoriesListQuery } from "@/modules/moderator/approval-histories/ui/views/approval-histories-view";
import { PendingArtistPackagesQuery } from "@/modules/artist/service-package/ui/view/service-package-service-view";
import { execute } from "../execute";
import { queryOptions } from "@tanstack/react-query";
import { 
  UserRole, 
  UserFilterInput, 
  ModeratorApprovalHistoryDetailQuery as ModeratorApprovalHistoryDetailQueryType, 
  ApprovalHistoryFilterInput, 
  ApprovalType,
  PaginatedDataOfPendingArtistPackageResponseFilterInput,
} from "@/gql/graphql";
import { ModeratorGetListUser, ModeratorGetAnalytics } from "@/modules/moderator/user-management/ui/views/moderator-user-management-view";
import { MODERATOR_ARTIST_DETAIL_QUERY, MODERATOR_LISTENER_DETAIL_QUERY } from "@/modules/moderator/user-management/ui/views/moderator-user-detail-view";
import { 
  PENDING_TRACK_UPLOAD_REQUESTS_QUERY,
  PENDING_TRACK_UPLOAD_REQUEST_BY_ID_QUERY,
  ORIGINAL_FILE_TRACK_UPLOAD_REQUEST_QUERY
} from "@/modules/moderator/track-approval/ui/queries/track-approval-queries";

export const moderatorProfileOptions = (userId: string) => queryOptions({
  queryKey: ["moderator-profile", userId],
  queryFn: async () => {
    const result = await execute(GetUserProfileQuery, { 
      where: { 
        id: { eq: userId } 
      } 
    });
    
    // Return first user from items array
    return result.users?.items?.[0] || null;
  },
});

export const moderatorArtistsQueryOptions = (page: number = 1, pageSize: number = 10, searchTerm: string = "") => queryOptions({
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
            stageNameUnsigned: { contains: searchTerm.trim() }
          }
        }
      };
    }
    
    const result = await execute(PendingArtistRegistrationsQuery, variables) 
    
    return result;
  },
});

export const moderatorArtistDetailsQueryOptions = (userId: string) => queryOptions({
  queryKey: ["artist-details", userId],
  queryFn: async () => {
    const result = await execute(PendingArtistRegistrationsDetailQuery, { 
      artistRegistrationId: userId
    });
    
    // Return first artist from items array
    return result.pendingArtistRegistrationById || null;
  },
});

// User analytics query options for moderator (for stats cards - independent of search)
export const moderatorUserAnalyticsOptions = () => queryOptions({
  queryKey: ["moderator-user-analytics"],
  queryFn: async () => {
    // Get all users for analytics without pagination or search filters
    const where: UserFilterInput = {
      role: {
        in: [UserRole.Listener, UserRole.Artist]
      }
    };
    
    const result = await execute(ModeratorGetAnalytics, { 
      skip: 0,
      take: 50, // Large number to get all users for stats
      where
    });
    
    return result;
  },
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes since stats don't change frequently
});

// User management query options for moderator (for table - affected by search)
export const moderatorUsersQueryOptions = (page: number = 1, pageSize: number = 10, searchTerm: string = "") => queryOptions({
  queryKey: ["moderator-users", page, pageSize, searchTerm],
  queryFn: async () => {
    const skip = (page - 1) * pageSize;
    
    // Build where filter with proper UserRole enum values
    const where: UserFilterInput = {
      // Filter for only Listener and Artist roles using 'in' operator with enum values
      role: {
        in: [UserRole.Listener, UserRole.Artist]
      }
    };
    // Add fullName search filter if provided (using 'contains' like track name search)
    if (searchTerm.trim()) {
      where.fullName = {
        contains: searchTerm
      };
    }
    const result = await execute(ModeratorGetListUser, { 
      skip,
      take: pageSize,
      where
    });
    
    return result;
  },
  placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
});

// Artist detail query options for moderator
export const moderatorArtistDetailOptions = (artistId: string) => queryOptions({
  queryKey: ["moderator-artist-detail", artistId],
  queryFn: async () => {
    const result = await execute(MODERATOR_ARTIST_DETAIL_QUERY, { 
      id: artistId 
    });
    
    return result?.artists?.items?.[0] || null;
  },
});

// Listener detail query options for moderator
export const moderatorListenerDetailOptions = (userId: string) => queryOptions({
  queryKey: ["moderator-listener-detail", userId],
  queryFn: async () => {    
    const result = await execute(MODERATOR_LISTENER_DETAIL_QUERY, { 
      id: userId 
    });
    
    return result?.listeners?.items?.[0] || null;
  },
});

// User detail query options for moderator - using same structure as admin
export const moderatorUserDetailOptions = (userId: string) => queryOptions({
  queryKey: ["moderator-user-detail", userId],
  queryFn: async () => {    
    // Get user detail using the existing query with single user filter
    const result = await execute(ModeratorGetListUser, { 
      skip: 0,
      take: 1,
      where: { 
        id: { eq: userId } 
      } 
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
export const moderatorApprovalHistoriesOptions = (page: number = 1, pageSize: number = 10, searchTerm: string = "") => queryOptions({
  queryKey: ["moderator-approval-histories", page, pageSize, searchTerm],
  queryFn: async () => {
    const skip = (page - 1) * pageSize;
    // const where: Record<string, unknown> = {};
    // Add search filter if search term is provided
    const where: ApprovalHistoryFilterInput = {
      approvalType: { in: [ApprovalType.ArtistRegistration] }
    };
    if (searchTerm.trim()) {
      where.snapshot = {
        contains: searchTerm
      };
    }
    const result = await execute(ApprovalHistoriesListQuery, { 
      skip,
      take: pageSize,
      where
    }) as { approvalHistories: { totalCount: number; items: unknown[]; pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean } } };
    
    return result;
  },
  placeholderData: (previousData) => previousData,
});

// Approval history detail query options for moderator
export const moderatorApprovalHistoryDetailOptions = (historyId: string) => queryOptions({
  queryKey: ["moderator-approval-history-detail", historyId],
  queryFn: async () => {
    const result = await execute(ModeratorApprovalHistoryDetailQuery, { 
      where: { id: { eq: historyId } }
    }) as ModeratorApprovalHistoryDetailQueryType;
    
    // Return first item from items array or null if not found
    return result?.approvalHistories?.items?.[0] || null;
  },
});

// Track approval query options for moderator
export const moderatorPendingTracksOptions = (page: number = 1, pageSize: number = 10, searchTerm: string = "") => queryOptions({
  queryKey: ["moderator-pending-tracks", page, pageSize, searchTerm],
  queryFn: async () => {
    const variables: {
      pageNumber: number;
      pageSize: number;
      where?: {
        items?: {
          some?: {
            track?: {
              name?: { contains: string };
            };
          };
        };
      };
    } = {
      pageNumber: page,
      pageSize,
    };
    
    // Add track name search filter if provided
    if (searchTerm.trim()) {
      variables.where = {
        items: {
          some: {
            track: {
              name: { contains: searchTerm }
            }
          }
        }
      };
    }
    
    const result = await execute(PENDING_TRACK_UPLOAD_REQUESTS_QUERY, variables);
    return result;
  },
  staleTime: 2 * 60 * 1000, // 2 minutes
});

// Track detail query options for moderator
export const moderatorTrackDetailOptions = (uploadId: string) => queryOptions({
  queryKey: ["moderator-track-detail", uploadId],
  queryFn: async () => {
    const result = await execute(PENDING_TRACK_UPLOAD_REQUEST_BY_ID_QUERY, {
      uploadId: uploadId
    });
    
    return result.pendingTrackUploadRequestById || null;
  },
  enabled: !!uploadId,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Original file track query options
export const moderatorTrackOriginalFileOptions = (uploadId: string) => queryOptions({
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

export const moderatorPendingPackagesOptions = (page: number = 1, pageSize: number = 10, searchTerm: string = '') => queryOptions({
  queryKey: ["moderator-pending-packages", page, pageSize, searchTerm],
  queryFn: () => {
    let where: PaginatedDataOfPendingArtistPackageResponseFilterInput | undefined = undefined;
    
    // Add packageName filter if search term is provided
    if (searchTerm.trim()) {
      where = {
        items: {
          some: {
            packageName: { contains: searchTerm }
          }
        }
      };
    }
    
    return execute(PendingArtistPackagesQuery, {
      pageNumber: page,
      pageSize: pageSize,
      where, // Apply search filter if provided
      artistWhere: {} // Get all artists
    });
  },
  staleTime: 1 * 60 * 1000, // 1 minute
});