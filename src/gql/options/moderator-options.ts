import { GetUserProfileQuery } from "@/modules/moderator/profile/ui/views/moderator-profile-view";
import { GetArtistDetailsQuery } from "@/modules/moderator/artist-approval/ui/views/artist-details-view";
import { GetArtistsListQuery } from "@/modules/moderator/artist-approval/ui/views/artist-approval-view";
import { execute } from "../execute";
import { queryOptions } from "@tanstack/react-query";

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
    const skip = (page - 1) * pageSize;
    const where = searchTerm 
      ? {
          stageName: {
            contains: searchTerm
          }
        }
      : {};
    
    const result = await execute(GetArtistsListQuery, { 
      skip,
      take: pageSize,
      where
    });
    
    return result;
  },
});

export const moderatorArtistDetailsQueryOptions = (userId: string) => queryOptions({
  queryKey: ["artist-details", userId],
  queryFn: async () => {
    const result = await execute(GetArtistDetailsQuery, { 
      skip: 0,
      take: 1,
      where: { 
        userId: { eq: userId } 
      } 
    });
    
    // Return first artist from items array
    return result.artists?.items?.[0] || null;
  },
});