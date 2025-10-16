import { GetUserProfileQuery } from "@/modules/moderator/profile/ui/views/moderator-profile-view";
import { 
  PendingArtistRegistrationsDetailQuery, 
  ApproveArtistRegistrationMutation, 
  RejectArtistRegistrationMutation 
} from "@/modules/moderator/artist-approval/ui/views/artist-details-view";
import { PendingArtistRegistrationsQuery } from "@/modules/moderator/artist-approval/ui/views/artist-approval-view";
import { execute } from "../execute";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";

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