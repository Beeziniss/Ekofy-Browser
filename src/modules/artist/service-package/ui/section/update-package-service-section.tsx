"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import UpdatePackageService from "../component/update-package-service/update-package-service";
import { packageDetailOptions } from "@/gql/options/artist-options";
import { execute } from "@/gql/execute";
import { updateArtistPackageMutation } from "@/modules/artist/service-package/ui/view/service-package-service-view";

interface UpdatePackageFormData {
  id: string;
  packageName: string;
  description?: string;
}

interface UpdatePackageServiceSectionProps {
  packageId: string;
  onCancel: () => void;
  onSuccess: () => void;
  onDelete: () => void;
}

const UpdatePackageServiceSection = ({
  packageId,
  onCancel,
  onSuccess,
  onDelete,
}: UpdatePackageServiceSectionProps) => {
  const queryClient = useQueryClient();

  // Query for package detail using options
  const { data: packageData, isLoading } = useQuery(packageDetailOptions(packageId));

  // Note: Update mutation would be implemented here when available in GraphQL schema
  const updatePackageMutation = useMutation({
    mutationFn: (data: UpdatePackageFormData) =>
      execute(updateArtistPackageMutation, {
        updateRequest: {
          id: data.id,
          packageName: data.packageName,
          description: data.description,
        },
      }),
    onSuccess: () => {
      toast.success("Package updated successfully");
      queryClient.invalidateQueries({ queryKey: ["package-detail", packageId] });
      queryClient.invalidateQueries({ queryKey: ["artist-packages"] });
      queryClient.invalidateQueries({ queryKey: ["pending-packages"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-packages"] });
      onSuccess();
    },
    onError: (error) => {
      toast.error("Failed to update package");
      console.error("Update package error:", error);
    },
  });

  const handleSubmit = (data: UpdatePackageFormData) => {
    updatePackageMutation.mutate(data);
  };

  const handleDelete = () => {
    // This would trigger the delete confirmation modal
    onDelete();
  };

  const packageItem = packageData?.artistPackages?.items?.[0];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="py-8 text-center">
          <p className="text-gray-400">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!packageItem) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="py-8 text-center">
          <p className="text-gray-400">Package not found.</p>
        </div>
      </div>
    );
  }

  return (
    <UpdatePackageService
      package={packageItem}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onDelete={handleDelete}
      isLoading={updatePackageMutation.isPending}
    />
  );
};

export default UpdatePackageServiceSection;
