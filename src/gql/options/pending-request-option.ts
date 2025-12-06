import { execute } from "../execute";
import { queryOptions } from "@tanstack/react-query";
import { GET_PENDING_ARTIST_REQUEST, GET_PENDING_ARTIST_REQUEST_DETAILS } from "@/modules/shared/queries/artist/pending-artist-request-queries";
import { RequestFilterInput, RequestStatus } from "../graphql";
import { useAuthStore } from "@/store";

// Interface for pending requests options
interface PendingRequestsParams {
  skip?: number;
  take?: number;
  where?: RequestFilterInput;
  search?: string;
  status?: RequestStatus;
}

// Get pending requests list
export const pendingRequestsOptions = (
  paramsOrSkip?: PendingRequestsParams | number,
  take: number = 20,
  where?: RequestFilterInput
) => {
  let skip: number;
  let actualTake: number;
  let actualWhere: RequestFilterInput | undefined;

  // Handle different call signatures
  if (typeof paramsOrSkip === 'object' && paramsOrSkip !== null) {
    // Object parameter
    const params = paramsOrSkip;
    skip = params.skip || 0;
    actualTake = params.take || 20;
    actualWhere = params.where;

    // Handle search and status filters
    if (params.search || params.status) {
      actualWhere = {
        ...actualWhere,
        ...(params.search && {
          title: { contains: params.search },
        }),
        ...(params.status && { status: { eq: params.status } }),
      };
    }
  } else {
    // Traditional parameters
    skip = paramsOrSkip || 0;
    actualTake = take;
    actualWhere = where;
  }

  return queryOptions({
    queryKey: ["pending-requests", skip, actualTake, actualWhere],
    queryFn: async () => {
      // Get artistId from auth store
      const authState = useAuthStore.getState();
      const artistId = authState.user?.artistId;
      
      // Always add artistId filter to only show requests for current artist
      const finalWhere: RequestFilterInput = {
        ...actualWhere,
        ...(artistId && { artistId: { eq: artistId } }),
      };
      
      const result = await execute(GET_PENDING_ARTIST_REQUEST, { 
        skip, 
        take: actualTake, 
        where: finalWhere 
      });
      return result;
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
  });
};

// Get pending request detail by ID
export const pendingRequestDetailOptions = (requestId: string) =>
  queryOptions({
    queryKey: ["pending-request-detail", requestId],
    queryFn: async () => {
      const result = await execute(GET_PENDING_ARTIST_REQUEST_DETAILS,
         { where: { id: { eq: requestId } } });
      return result;
    },
    enabled: !!requestId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// Get pending requests by status
export const pendingRequestsByStatusOptions = (status: RequestStatus, skip: number = 0, take: number = 20) =>
  queryOptions({
    queryKey: ["pending-requests-by-status", status, skip, take],
    queryFn: async () => {
      // Get artistId from auth store
      const authState = useAuthStore.getState();
      const artistId = authState.user?.artistId;
      
      const result = await execute(GET_PENDING_ARTIST_REQUEST, {
        skip,
        take,
        where: { 
          status: { eq: status },
          ...(artistId && { artistId: { eq: artistId } }),
        },
      });
      return result;
    },
    staleTime: 2 * 60 * 1000,
  });
