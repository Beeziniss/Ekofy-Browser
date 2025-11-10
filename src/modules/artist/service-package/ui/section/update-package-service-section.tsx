"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import UpdatePackageService from "../component/update-package-service/update-package-service";
import { packageDetailOptions } from "@/gql/options/artist-options";
import { usePackageOperations } from "../../hooks/use-package-operations";

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
  const { updatePackage, isUpdating } = usePackageOperations();

  // Query for package detail using options
  const { data: packageData, isLoading } = useQuery(packageDetailOptions(packageId));

  const handleSubmit = (data: UpdatePackageFormData) => {
    updatePackage(
      {
        id: data.id,
        packageName: data.packageName,
        description: data.description,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
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
      isLoading={isUpdating}
    />
  );
};

export default UpdatePackageServiceSection;
