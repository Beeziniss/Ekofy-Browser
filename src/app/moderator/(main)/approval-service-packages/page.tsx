"use client";

import React, { useEffect } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import ApprovalServicePackageView from '@/modules/moderator/approval-service-package/ui/view/approval-service-package-view';
import { getQueryClient } from '@/providers/get-query-client';
import { moderatorPendingPackagesOptions } from '@/gql/options/moderator-options';

const ApprovalServicePackagePage = () => {
  const queryClient = getQueryClient();

  useEffect(() => {
    // Prefetch pending packages for moderator using query options
    queryClient.prefetchQuery(moderatorPendingPackagesOptions());
  }, [queryClient]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApprovalServicePackageView />
    </HydrationBoundary>
  );
};

export default ApprovalServicePackagePage;
