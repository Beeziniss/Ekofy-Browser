import { execute } from '@/gql/execute';
import { ROYALTY_POLICIES_QUERY } from "@/modules/shared/queries/admin/royalty-policies-queries";
import { RoyaltyPolicyFilterInput } from '../graphql';

export const royaltyPoliciesOptions = (skip: number, take: number, where?: RoyaltyPolicyFilterInput) => ({
  queryKey: ["royalty-policies", skip, take, where],
  queryFn: async () => {
    const result = await execute(ROYALTY_POLICIES_QUERY, { skip, take, where });
    return result.royaltyPolicies || {
      items: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      totalCount: 0,
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});