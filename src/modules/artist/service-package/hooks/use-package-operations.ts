import { useState } from "react";
import { toast } from "sonner";
import { ArtistPackageStatus } from "@/gql/graphql";
import {
  useCreateArtistPackage,
  useUpdateArtistPackage,
  useDeleteArtistPackage,
  useChangeArtistPackageStatus,
} from "@/gql/client-mutation-options/artist-service-package-mutation";

export interface CreatePackageData {
  artistId: string;
  packageName: string;
  amount: number;
  estimateDeliveryDays: number;
  description: string;
  serviceDetails: Array<{ key: string; value: string }>;
  maxRevisions: number;
}

export interface UpdatePackageData {
  id: string;
  packageName: string;
  description?: string;
}

export const usePackageOperations = () => {
  const [isOperating, setIsOperating] = useState(false);
  
  const createMutation = useCreateArtistPackage();
  const updateMutation = useUpdateArtistPackage();
  const deleteMutation = useDeleteArtistPackage();
  const changeStatusMutation = useChangeArtistPackageStatus();

  const createPackage = async (
    data: CreatePackageData,
    options?: {
      onSuccess?: () => void;
      onError?: (error: unknown) => void;
    }
  ) => {
    setIsOperating(true);
    
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Package created successfully");
        options?.onSuccess?.();
        setIsOperating(false);
      },
      onError: (error) => {
        toast.error("Failed to create package");
        options?.onError?.(error);
        setIsOperating(false);
      },
    });
  };

  const updatePackage = async (
    data: UpdatePackageData,
    options?: {
      onSuccess?: () => void;
      onError?: (error: unknown) => void;
    }
  ) => {
    setIsOperating(true);
    
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Package updated successfully");
        options?.onSuccess?.();
        setIsOperating(false);
      },
      onError: (error) => {
        toast.error("Failed to update package");
        options?.onError?.(error);
        setIsOperating(false);
      },
    });
  };

  const deletePackage = async (
    packageId: string,
    options?: {
      onSuccess?: () => void;
      onError?: (error: unknown) => void;
    }
  ) => {
    setIsOperating(true);
    
    deleteMutation.mutate(packageId, {
      onSuccess: () => {
        toast.success("Package deleted successfully");
        options?.onSuccess?.();
        setIsOperating(false);
      },
      onError: (error) => {
        toast.error("Failed to delete package");
        options?.onError?.(error);
        setIsOperating(false);
      },
    });
  };

  const changePackageStatus = async (
    packageId: string,
    status: ArtistPackageStatus,
    options?: {
      onSuccess?: () => void;
      onError?: (error: unknown) => void;
    }
  ) => {
    setIsOperating(true);
    
    const statusText = status === ArtistPackageStatus.Enabled ? "enabled" : "disabled";
    
    changeStatusMutation.mutate(
      { packageId, status },
      {
        onSuccess: () => {
          toast.success(`Package ${statusText} successfully`);
          options?.onSuccess?.();
          setIsOperating(false);
        },
        onError: (error) => {
          toast.error(`Failed to ${statusText.slice(0, -1)} package`);
          options?.onError?.(error);
          setIsOperating(false);
        },
      }
    );
  };

  const isLoading = 
    createMutation.isPending || 
    updateMutation.isPending || 
    deleteMutation.isPending || 
    changeStatusMutation.isPending ||
    isOperating;

  return {
    // Operations
    createPackage,
    updatePackage,
    deletePackage,
    changePackageStatus,
    
    // States
    isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isChangingStatus: changeStatusMutation.isPending,
    
    // Mutation objects (if needed for advanced usage)
    mutations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
      changeStatus: changeStatusMutation,
    },
  };
};