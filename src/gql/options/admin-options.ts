import { GetUserProfileQuery } from "@/modules/moderator/profile/ui/views/moderator-profile-view";
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