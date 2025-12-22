"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
// import { toast } from 'sonner';
import ServicePackageDetail from "../component/service-package-detail/service-package-detail";
// import { execute } from '@/gql/execute';
import { packageDetailOptions } from "@/gql/options/artist-options";
import { useRouter } from "next/navigation";
// import { changeArtistPackageStatusMutation } from '@/gql/client-mutation-options/service-package-mutation';
// import { ArtistPackageStatus } from '@/gql/graphql';

interface ServicePackageDetailSectionProps {
  packageId: string;
}

const ServicePackageDetailSection = ({ packageId }: ServicePackageDetailSectionProps) => {
  // const queryClient = useQueryClient();
  const router = useRouter();
  // Query for package detail using options
  const { data: packageData, isLoading } = useQuery(packageDetailOptions(packageId));

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

  const handleBack = () => {
    router.push("/artist/studio/service-package");
  };

  const packageItem = packageData?.artistPackages?.items?.[0];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="py-8 text-center">
          <p className="text-gray-400">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!packageItem) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="py-8 text-center">
          <p className="text-gray-400">Package not found.</p>
        </div>
      </div>
    );
  }

  return <ServicePackageDetail package={packageItem} onBack={handleBack} />;
};

export default ServicePackageDetailSection;
