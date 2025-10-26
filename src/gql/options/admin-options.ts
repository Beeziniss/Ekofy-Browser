import { GetUserProfileQuery } from "@/modules/admin/profile/ui/views/admin-profile-view";
import { AdminGetListUser, AdminGetStatistics } from "@/modules/admin/user-management/ui/views/admin-user-managenent";
import { execute } from "../execute";
import { queryOptions } from "@tanstack/react-query";

export const adminProfileOptions = (userId: string) => queryOptions({
  queryKey: ["admin-profile", userId],
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

export const adminUsersQueryOptions = (page: number = 1, pageSize: number = 10, searchTerm: string = "") => queryOptions({
  queryKey: ["admin-users", page, pageSize, searchTerm],
  queryFn: async () => {
    const skip = (page - 1) * pageSize;
    const where = searchTerm 
      ? {
          fullName: {
            contains: searchTerm
          }
        }
      : {};
    
    const result = await execute(AdminGetListUser, { 
      skip,
      take: pageSize,
      where
    });
    
    return result;
  },
});

export const adminUsersStatsOptions = () => queryOptions({
  queryKey: ["admin-users-stats"],
  queryFn: async () => {
    const result = await execute(AdminGetStatistics, { 
      where: {}
    });
    
    return result;
  },
});

export const adminArtistDetailOptions = (userId: string) => queryOptions({
  queryKey: ["admin-artist-detail", userId],
  queryFn: async () => {
    const { GET_ARTISTS } = await import("@/modules/admin/user-management/ui/views/admin-user-detail-view");
    const result = await execute(GET_ARTISTS, { 
      where: { 
        userId: { eq: userId } 
      } 
    });
    
    return result.artists?.items?.[0] || null;
  },
});

export const adminListenerDetailOptions = (userId: string) => queryOptions({
  queryKey: ["admin-listener-detail", userId],
  queryFn: async () => {
    const { AdminListenerDetail } = await import("@/modules/admin/user-management/ui/views/admin-user-detail-view");
    const result = await execute(AdminListenerDetail, { 
      where: { 
        userId: { eq: userId } 
      } 
    });
    
    return result.listeners?.items?.[0] || null;
  },
});

export const adminUserDetailOptions = (userId: string) => queryOptions({
  queryKey: ["admin-user-detail", userId],
  queryFn: async () => {
    const result = await execute(GetUserProfileQuery, { 
      where: { 
        id: { eq: userId } 
      } 
    });
    
    return result.users?.items?.[0] || null;
  },
});