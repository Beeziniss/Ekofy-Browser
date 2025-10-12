import { GetUserProfileQuery } from "@/modules/moderator/profile/ui/views/moderator-profile-view";
import { AdminGetListUser } from "@/modules/admin/user-management/ui/views/admin-user-managenent";
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

export const adminUserDetailOptions = (userId: string) => queryOptions({
  queryKey: ["admin-user-detail", userId],
  queryFn: async () => {
    const result = await execute(AdminGetListUser, { 
      skip: 0,
      take: 1,
      where: { 
        id: { eq: userId } 
      } 
    });
    
    return {
      user: result.users?.items?.[0] || null,
      artists: result.artists?.items || [],
      listeners: result.listeners?.items || [],
    };
  },
});