"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import ServicePackageDetailSection from '@/modules/artist/service-package/ui/section/service-package-detail-section';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/providers/get-query-client';
import { packageDetailOptions } from '@/gql/options/artist-options';

export default function ServicePackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.packageId as string;
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(packageDetailOptions(packageId));
  const handleBack = () => {
    router.push('/artist/studio/service-package');
  };

  const handleEdit = () => {
    // Navigate to edit mode - this could be implemented as a query parameter
    // or navigate to a separate edit page
    router.push(`/artist/studio/service-package?edit=${packageId}`);
  };

  const handleDelete = () => {
    // Handle delete confirmation
    // This would typically show a confirmation modal
  };

  return (

    <div className="min-h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
      <ServicePackageDetailSection
        packageId={packageId}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      </HydrationBoundary>
    </div>
  );
}