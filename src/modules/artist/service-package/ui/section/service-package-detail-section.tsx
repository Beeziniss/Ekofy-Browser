"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
// import { toast } from 'sonner';
import ServicePackageDetail from '../component/service-package-detail/service-package-detail';
// import { execute } from '@/gql/execute';
import { packageDetailOptions } from '@/gql/options/artist-options';
// import { changeArtistPackageStatusMutation } from '@/gql/client-mutation-options/service-package-mutation';
// import { ArtistPackageStatus } from '@/gql/graphql';

interface ServicePackageDetailSectionProps {
  packageId: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ServicePackageDetailSection = ({
  packageId,
  onBack,
}: ServicePackageDetailSectionProps) => {
  // const queryClient = useQueryClient();

  // Query for package detail using options
  const { data: packageData, isLoading } = useQuery(
    packageDetailOptions(packageId)
  );

  // Mutation for changing package status
  // const changeStatusMutation = useMutation({
  //   mutationFn: (status: ArtistPackageStatus) =>
  //     execute(changeArtistPackageStatusMutation, {
  //       updateStatusRequest: {
  //         id: packageId,
  //         status: status
  //       }
  //     }),
  //   onSuccess: () => {
  //     toast.success('Package status updated successfully');
  //     queryClient.invalidateQueries({ queryKey: ['package-detail', packageId] });
  //     queryClient.invalidateQueries({ queryKey: ['artist-packages'] });
  //   },
  //   onError: (error) => {
  //     toast.error('Failed to update package status');
  //     console.error('Status change error:', error);
  //   },
  // });

  // const handleStatusChange = (status: ArtistPackageStatus) => {
  //   changeStatusMutation.mutate(status);
  // };

  const packageItem = packageData?.artistPackages?.items?.[0];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-gray-400">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!packageItem) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-gray-400">Package not found.</p>
        </div>
      </div>
    );
  }

  return (
    <ServicePackageDetail
      package={packageItem}
      onBack={onBack}
    />
  );
};

export default ServicePackageDetailSection;
