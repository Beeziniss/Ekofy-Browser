import { execute } from "@/gql/execute";
import { queryOptions } from "@tanstack/react-query";

import type { RequestFilterInput, QueryInitializationRequestsArgs, RequestSortInput } from "@/gql/graphql";
import { RequestQuery, RequestsQuery } from "@/modules/shared/queries/client/request-queries";

/**
 * Query options for fetching listener's request history
 */
export const requestsOptions = (skip: number = 0, take: number = 20, where?: RequestFilterInput, order?: RequestSortInput[]) =>
  queryOptions({
    queryKey: ["listener-requests", skip, take, where, order],
    queryFn: async () => {
      const variables: QueryInitializationRequestsArgs = {
        skip,
        take,
        where,
        order,
      };
      const result = await execute(RequestsQuery, variables);
      const requests = result.requests || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
      return requests;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

/**
 * Query options for fetching a single request by ID
 */
export const requestOptions = (id: string) =>
  queryOptions({
    queryKey: ["listener-request", id],
    queryFn: async () => {
      const variables: QueryInitializationRequestsArgs = {
        skip: 0,
        take: 1,
        where: {
          id: { eq: id },
        },
      };
      const result = await execute(RequestQuery, variables);
      const request = result.requests?.items?.[0];
      if (!request) return null;
      return request;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
