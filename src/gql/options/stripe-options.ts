import { queryOptions } from "@tanstack/react-query";
import { execute } from "@/gql/execute";
import { GetUserstripeAccountIdQuery } from "@/modules/shared/queries/client/user-queries";

// Query options for getting user's Stripe account ID
export const userStripeAccountOptions = (userId: string) => queryOptions({
  queryKey: ["user-stripe-account", userId],
  queryFn: async () => {
    const result = await execute(GetUserstripeAccountIdQuery, {
      userId,
    });
    
    return result?.users?.items?.[0] || null;
  },
  enabled: !!userId,
  staleTime: 5 * 60 * 1000, // 5 minutes - stripe account status doesn't change frequently
  retry: 1, // Only retry once for stripe account checks
});