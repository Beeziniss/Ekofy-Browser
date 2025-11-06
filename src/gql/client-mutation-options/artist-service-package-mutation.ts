import { useMutation, useQueryClient } from "@tanstack/react-query";
import { execute } from "../execute";
import {
  approveArtistPackageMutation,
  rejectArtistPackageMutation,
  createArtistPackageMutation,
  updateArtistPackageMutation,
  deleteArtistPackageMutation,
  changeArtistPackageStatusMutation,
} from "@/modules/artist/service-package/ui/view/service-package-service-view";
import { ArtistPackageStatus } from "@/gql/graphql";

// Approve Artist Package
export const useApproveArtistPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (packageId: string) => {
      const result = await execute(approveArtistPackageMutation, { id: packageId });
      return result;
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-packages"] });
      queryClient.invalidateQueries({ queryKey: ["pending-packages"] });
      queryClient.invalidateQueries({ queryKey: ["artist-packages"] });
    },
  });
};

// Reject Artist Package
export const useRejectArtistPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (packageId: string) => {
      const result = await execute(rejectArtistPackageMutation, { id: packageId });
      return result;
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-packages"] });
      queryClient.invalidateQueries({ queryKey: ["pending-packages"] });
      queryClient.invalidateQueries({ queryKey: ["artist-packages"] });
    },
  });
};

// Create Artist Package
export const useCreateArtistPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createRequest: {
      artistId: string;
      packageName: string;
      amount: number;
      estimateDeliveryDays: number;
      description: string;
      serviceDetails: Array<{ key: string; value: string }>;
    }) => {
      const result = await execute(createArtistPackageMutation, { createRequest });
      return result;
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["artist-packages"] });
      queryClient.invalidateQueries({ queryKey: ["pending-packages"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-packages"] });
    },
  });
};

// Update Artist Package
export const useUpdateArtistPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateRequest: { id: string; packageName: string; description?: string }) => {
      const result = await execute(updateArtistPackageMutation, { updateRequest });
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["package-detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["artist-packages"] });
      queryClient.invalidateQueries({ queryKey: ["pending-packages"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-packages"] });
    },
  });
};

// Delete Artist Package
export const useDeleteArtistPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (packageId: string) => {
      const result = await execute(deleteArtistPackageMutation, { artistPackageId: packageId });
      return result;
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["artist-packages"] });
      queryClient.invalidateQueries({ queryKey: ["pending-packages"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-packages"] });
    },
  });
};

// Change Artist Package Status
export const useChangeArtistPackageStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { packageId: string; status: ArtistPackageStatus }) => {
      const result = await execute(changeArtistPackageStatusMutation, {
        updateStatusRequest: {
          id: variables.packageId,
          status: variables.status,
        },
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["artist-packages"] });
      queryClient.invalidateQueries({ queryKey: ["pending-packages"] });
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-packages"] });
    },
  });
};
