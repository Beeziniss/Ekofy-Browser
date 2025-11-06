"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/stores/auth-store";
import { UserRole } from "@/types/role";
import {
  subscriptionsPremiumQueryOptions,
  subscriptionsProQueryOptions,
  listenerPremiumEntitlementsQueryOptions,
  artistProEntitlementsQueryOptions,
  availableCouponsQueryLISTENER10FOREVEROptions,
  availableCouponsQueryARTIST20FOREVEROptions,
} from "@/gql/options/subscription-clients-options";
import { SubscriptionPlansPublicView } from "@/modules/client/subscription/ui/views/subscription-plans-public-view";

export default function SubscriptionPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const userRole = user?.role;
  const isArtist = userRole === UserRole.ARTIST;

  useEffect(() => {
    // Prefetch data based on user role
    const prefetchData = async () => {
      try {
        if (isArtist) {
          // Prefetch Artist Pro data
          await Promise.all([
            queryClient.prefetchQuery(subscriptionsProQueryOptions(0, 1)),
            queryClient.prefetchQuery(artistProEntitlementsQueryOptions()),
            queryClient.prefetchQuery(availableCouponsQueryARTIST20FOREVEROptions()),
          ]);
        } else {
          // Prefetch Listener/Guest Premium data
          await Promise.all([
            queryClient.prefetchQuery(subscriptionsPremiumQueryOptions(0, 1)),
            queryClient.prefetchQuery(listenerPremiumEntitlementsQueryOptions()),
            queryClient.prefetchQuery(availableCouponsQueryLISTENER10FOREVEROptions()),
          ]);
        }
      } catch (error) {
        console.error("Failed to prefetch subscription data:", error);
      }
    };

    prefetchData();
  }, [queryClient, isArtist]);

  return <SubscriptionPlansPublicView />;
}
