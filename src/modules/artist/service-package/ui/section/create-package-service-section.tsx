"use client";

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CreatePackageService from '../component/create-package-service/create-package-service';
import { execute } from '@/gql/execute';
import { createArtistPackageMutation } from '@/modules/artist/service-package/ui/view/service-package-service-view';
import { useAuthStore } from '@/store';

interface CreatePackageFormData {
  packageName: string;
  amount: number;
  estimateDeliveryDays: number;
  description: string;
  serviceDetails: Array<{
    key: string;
    value: string;
  }>;
}

interface CreatePackageServiceSectionProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const CreatePackageServiceSection: React.FC<CreatePackageServiceSectionProps> = ({
  onCancel,
  onSuccess,
}) => {
  const [artistId, setArtistId] = useState<string>('');
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  useEffect(() => {
    const storedArtistId = user?.artistId;
    if (storedArtistId) {
      setArtistId(storedArtistId);
    }
  }, [user]);

  const createPackageMutation = useMutation({
    mutationFn: (data: CreatePackageFormData) =>
      execute(createArtistPackageMutation, {
        createRequest: {
          artistId,
          packageName: data.packageName,
          amount: data.amount,
          estimateDeliveryDays: data.estimateDeliveryDays,
          description: data.description,
          serviceDetails: data.serviceDetails,
        },
      }),
    onSuccess: () => {
      toast.success('Package created successfully');
      queryClient.invalidateQueries({ queryKey: ['artist-packages'] });
      onSuccess();
    },
    onError: (error) => {
      toast.error('Failed to create package');
      console.error('Create package error:', error);
    },
  });

  const handleSubmit = (data: CreatePackageFormData) => {
    createPackageMutation.mutate(data);
  };

  return (
    <CreatePackageService
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={createPackageMutation.isPending}
    />
  );
};

export default CreatePackageServiceSection;
