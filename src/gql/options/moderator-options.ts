import { GetUserProfileQuery } from "@/modules/moderator/profile/ui/views/moderator-profile-view";
import { 
  PendingArtistRegistrationsDetailQuery, 
  ApproveArtistRegistrationMutation, 
  RejectArtistRegistrationMutation 
} from "@/modules/moderator/artist-approval/ui/views/artist-details-view";
import { PendingArtistRegistrationsQuery } from "@/modules/moderator/artist-approval/ui/views/artist-approval-view";
import { execute } from "../execute";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRole, UserFilterInput } from "@/gql/graphql";
import { ModeratorGetListUser, ModeratorGetAnalytics } from "@/modules/moderator/user-management/ui/views/moderator-user-management-view";
import { MODERATOR_ARTIST_DETAIL_QUERY, MODERATOR_LISTENER_DETAIL_QUERY } from "@/modules/moderator/user-management/ui/views/moderator-user-detail-view";

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
    // Build variables object with where filter
    const variables: any = {
      pageNumber: page,
      pageSize,
      where: {} // Always pass where object, even if empty
    };
    
    // Add stageNameUnsigned filter to where object if searchTerm is not empty
    if (searchTerm && searchTerm.trim() !== "") {
      variables.where.stageNameUnsigned = { contains: searchTerm.trim() };
    }
    
    const result = await execute(PendingArtistRegistrationsQuery, variables);
    
    return result;
  },
});

export const moderatorArtistDetailsQueryOptions = (userId: string) => queryOptions({
  queryKey: ["artist-details", userId],
  queryFn: async () => {
    const result = await execute(PendingArtistRegistrationsDetailQuery, { 
      id: userId
    });
    
    // Return first artist from items array
    return result.pendingArtistRegistrations?.[0] || null;
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