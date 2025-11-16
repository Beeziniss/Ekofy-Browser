"use client";
import React, { useEffect } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/get-query-client";
import { artistPackagesOptions } from "@/gql/options/artist-options";
import ServicePackageServiceView from "@/modules/artist/service-package/ui/view/service-package-service-view";
import { useAuthStore } from "@/store";

export default function ServicePackagePage() {
  const queryClient = getQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.artistId) {
      // Prefetch artist packages
      queryClient.prefetchQuery(artistPackagesOptions(user.artistId));
    }
  }, [queryClient, user?.artistId]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServicePackageServiceView />
    </HydrationBoundary>
  );
}
