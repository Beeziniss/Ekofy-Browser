"use client";

import React, { useState, useEffect } from "react";
import CreatePackageService from "../component/create-package-service/create-package-service";
import { usePackageOperations } from "../../hooks/use-package-operations";
import { useAuthStore } from "@/store";

interface CreatePackageFormData {
  packageName: string;
  amount: number;
  estimateDeliveryDays: number;
  description: string;
  maxRevision: number;
  serviceDetails: Array<{
    key: string;
    value: string;
  }>;
}

interface CreatePackageServiceSectionProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const CreatePackageServiceSection: React.FC<CreatePackageServiceSectionProps> = ({ onCancel, onSuccess }) => {
  const [artistId, setArtistId] = useState<string>("");
  const { user } = useAuthStore();
  const { createPackage, isCreating } = usePackageOperations();
  
  useEffect(() => {
    const storedArtistId = user?.artistId;
    if (storedArtistId) {
      setArtistId(storedArtistId);
    }
  }, [user]);

  const handleSubmit = (data: CreatePackageFormData) => {
    createPackage(
      {
        artistId,
        packageName: data.packageName,
        amount: data.amount,
        estimateDeliveryDays: data.estimateDeliveryDays,
        description: data.description,
        serviceDetails: data.serviceDetails,
        maxRevision: data.maxRevision,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <CreatePackageService onSubmit={handleSubmit} onCancel={onCancel} isLoading={isCreating} />
  );
};

export default CreatePackageServiceSection;
