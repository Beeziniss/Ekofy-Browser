import { queryOptions } from "@tanstack/react-query";
import { execute } from "@/gql/execute";
import { 
  LISTENER_REQUESTS_QUERY, 
  LISTENER_REQUEST_BY_ID_QUERY 
} from "@/modules/shared/queries/client/listener-request-queries";
import type { 
  RequestFilterInput,
  QueryInitializationRequestsArgs
} from "@/gql/graphql";

/**
 * Helper function to convert request deadlines from string to Date
 */
const convertRequestDeadlines = <T extends { deadline?: string | null }>(requests: T[]) => {
  return requests.map((request) => ({
    ...request,
    deadline: request.deadline ? new Date(request.deadline) : null,
  }));
};

/**
 * Query options for fetching listener's request history
 */
export const listenerRequestsOptions = (
  skip: number = 0, 
  take: number = 20, 
  where?: RequestFilterInput
) =>
  queryOptions({
    queryKey: ["listener-requests", skip, take, where],
    queryFn: async () => {
      const variables: QueryInitializationRequestsArgs = {
        skip,
        take,
        where,
      };
      const result = await execute(LISTENER_REQUESTS_QUERY, variables);
      const requests = result.requests || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
      return {
        ...requests,
        items: convertRequestDeadlines(requests.items || []),
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

/**
 * Query options for fetching a single request by ID
 */
export const listenerRequestByIdOptions = (id: string) =>
  queryOptions({
    queryKey: ["listener-request", id],
    queryFn: async () => {
      const variables: QueryInitializationRequestsArgs = {
        skip: 0,
        take: 1,
        where: {
          id: { eq: id }
        }
      };
      const result = await execute(LISTENER_REQUEST_BY_ID_QUERY, variables);
      const request = result.requests?.items?.[0];
      if (!request) return null;
      return {
        ...request,
        deadline: request.deadline ? new Date(request.deadline) : null,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
