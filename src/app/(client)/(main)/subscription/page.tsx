import {
  subscriptionsProQueryOptions,
  subscriptionsPremiumQueryOptions,
  artistProEntitlementsQueryOptions,
  listenerPremiumEntitlementsQueryOptions,
  availableCouponsQueryARTIST20FOREVEROptions,
  availableCouponsQueryLISTENER10FOREVEROptions,
} from "@/gql/options/subscription-clients-options";
import { cookies } from "next/headers";
import { UserRole } from "@/types/role";
import { getQueryClient } from "@/providers/get-query-client";
import { SubscriptionPlansPublicView } from "@/modules/client/subscription/ui/views/subscription-plans-public-view";

const SubscriptionPage = async () => {
  const queryClient = getQueryClient();

  // Get user ID from cookies for server-side prefetching
  const cookieStore = await cookies();
  const authStorage = cookieStore.get("auth-storage")?.value;
  let userRole: UserRole = UserRole.LISTENER;

  if (authStorage) {
    try {
      const decodedValue = decodeURIComponent(authStorage);
      const authData = JSON.parse(decodedValue);
      userRole = authData.state?.user?.role || UserRole.LISTENER;
    } catch (error) {
      console.error("Failed to parse auth storage:", error);
    }
  }

  if (userRole === UserRole.ARTIST) {
    // Prefetch Artist Pro data
    await Promise.all([
      queryClient.prefetchQuery(subscriptionsProQueryOptions()),
      queryClient.prefetchQuery(artistProEntitlementsQueryOptions()),
      queryClient.prefetchQuery(availableCouponsQueryARTIST20FOREVEROptions()),
    ]);
  } else {
    // Prefetch Listener/Guest Premium data
    await Promise.all([
      queryClient.prefetchQuery(subscriptionsPremiumQueryOptions()),
      queryClient.prefetchQuery(listenerPremiumEntitlementsQueryOptions()),
      queryClient.prefetchQuery(availableCouponsQueryLISTENER10FOREVEROptions()),
    ]);
  }

  return <SubscriptionPlansPublicView />;
};

export default SubscriptionPage;
