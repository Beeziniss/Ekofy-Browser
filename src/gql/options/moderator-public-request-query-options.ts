import { queryOptions } from "@tanstack/react-query";
import { execute } from "../execute";
import { RequestStatus, RequestFilterInput } from "../graphql";
import { REQUEST_PUBLIC_QUERY, REQUEST_PUBLIC_BY_ID_QUERY } from "@/modules/shared/queries/moderator/public-request-queries";

export const moderatorPublicRequestsQueryOptions = (
  skip: number = 0,
  take: number = 10,
  status?: RequestStatus | null,
  searchQuery?: string | null
) => {
  const where: RequestFilterInput = {};

  // Filter by status - only show OPEN and BLOCKED
  if (status) {
    where.status = { eq: status };
  } else {
    // Default: only show OPEN and BLOCKED requests
    where.status = { in: [RequestStatus.Open, RequestStatus.Blocked] };
  }

  // Search by title or summary
  if (searchQuery && searchQuery.trim()) {
    where.or = [
      { titleUnsigned: { contains: searchQuery.trim() } },
      { summaryUnsigned: { contains: searchQuery.trim() } },
    ];
  }

  return queryOptions({
    queryKey: ["moderator-public-requests", skip, take, status, searchQuery],
    queryFn: async () => {
      const result = await execute(REQUEST_PUBLIC_QUERY, { skip, take, where });
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const moderatorPublicRequestByIdQueryOptions = (requestId: string) =>
  queryOptions({
    queryKey: ["moderator-public-request-by-id", requestId],
    queryFn: async () => {
      const result = await execute(REQUEST_PUBLIC_BY_ID_QUERY, { requestId });
      return result;
    },
    enabled: !!requestId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
