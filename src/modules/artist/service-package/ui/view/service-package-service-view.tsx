"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PackageServiceLayout from '../layout/package-service-layout';
import ServicePackageListSection from '../section/service-package-list-section';
import CreatePackageServiceSection from '../section/create-package-service-section';
import UpdatePackageServiceSection from '../section/update-package-service-section';
import ServicePackageDetailSection from '../section/service-package-detail-section';
import DeleteConfirmModal from '../component/delete-package-service/delete-confirm-modal';
import type { 
  TypedDocumentString, 
  CreateArtistPackageRequestInput,
  UpdateStatusArtistPackageRequestInput,
  UpdateArtistPackageRequestInput,
  ArtistPackageFilterInput, 
  PaginatedDataOfPendingArtistPackageResponseFilterInput,
  PendingArtistPackageResponse,
  ArtistPackagesCollectionSegment,
  ArtistFilterInput
} from '@/gql/graphql';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';

// Query for listing artist packages
export const ServicePackageServiceViewQuery = `
  query ArtistPackages($skip: Int, $take: Int, $where: ArtistPackageFilterInput) {
    artistPackages(skip: $skip, take: $take, where: $where) {
      totalCount
      items {
        id
        packageName
        amount
        currency
        estimateDeliveryDays
        description
        serviceDetails {
          key
          value
        }
        updatedAt
        createdAt
        artistId
        status
        isDelete
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
` as unknown as TypedDocumentString<
  { artistPackages?: ArtistPackagesCollectionSegment | null },
  { skip?: number; take?: number; where?: ArtistPackageFilterInput }
>;

// Query for single package detail
export const ServicePackageDetailQuery = `
  query ArtistPackagesDetail($where: ArtistPackageFilterInput) {
    artistPackages(where: $where) {
      items {
        id
        packageName
        amount
        currency
        estimateDeliveryDays
        description
        serviceDetails {
          key
          value
        }
        status
        isDelete
        createdAt
        updatedAt
        artistId
      }
    }
  }
` as unknown as TypedDocumentString<
  { artistPackages?: ArtistPackagesCollectionSegment | null },
  { where?: ArtistPackageFilterInput }
>;

// Query for pending packages
export const PendingArtistPackagesQuery = `
  query PendingArtistPackages($pageNumber: Int!, $pageSize: Int!, $where: PaginatedDataOfPendingArtistPackageResponseFilterInput, $artistWhere: ArtistFilterInput) {
    pendingArtistPackages(pageNumber: $pageNumber, pageSize: $pageSize, where: $where) {
      totalCount
      items {
        id
        artistId
        packageName
        amount
        currency
        estimateDeliveryDays
        description
        status
        requestedAt
        timeToLive
        serviceDetails {
          key
          value
        }
      }
    }
    artists(where: $artistWhere) {
      items {
        stageName
        userId
        id
      }
    }
  }
` as unknown as TypedDocumentString<
  { 
    pendingArtistPackages?: {
      totalCount: number;
      items: Array<PendingArtistPackageResponse>;
    } | null,
    artists?: { items: Array<{ stageName: string; userId: string; id: string }> } | null
  },
  { pageNumber: number; pageSize: number; where?: PaginatedDataOfPendingArtistPackageResponseFilterInput; artistWhere?: ArtistFilterInput }
>;

// Mutation for creating artist package
export const createArtistPackageMutation = `
  mutation CreateArtistPackage($createRequest: CreateArtistPackageRequestInput!) {
    createArtistPackage(createRequest: $createRequest)
  }
` as unknown as TypedDocumentString<
  { createArtistPackage?: boolean | null },
  { createRequest: CreateArtistPackageRequestInput }
>;

// Mutation for changing package status
export const changeArtistPackageStatusMutation = `
  mutation ChangeArtistPackageStatus($updateStatusRequest: UpdateStatusArtistPackageRequestInput!) {
    changeArtistPackageStatus(updateStatusRequest: $updateStatusRequest)
  }
` as unknown as TypedDocumentString<
  { changeArtistPackageStatus?: boolean | null },
  { updateStatusRequest: UpdateStatusArtistPackageRequestInput }
>;

// Mutation for approving artist package
export const approveArtistPackageMutation = `
  mutation ApproveArtistPackage($id: String!) {
    approveArtistPackage(id: $id)
  }
` as unknown as TypedDocumentString<
  { approveArtistPackage?: boolean | null },
  { id: string }
>;

// Mutation for rejecting artist package
export const rejectArtistPackageMutation = `
  mutation RejectArtistPackage($id: String!) {
    rejectArtistPackage(id: $id)
  }
` as unknown as TypedDocumentString<
  { rejectArtistPackage?: boolean | null },
  { id: string }
>;

export const  updateArtistPackageMutation = `
  mutation UpdateArtistPackage($updateRequest: UpdateArtistPackageRequestInput!) {
    updateArtistPackage(updateRequest: $updateRequest)
  }
` as unknown as TypedDocumentString<
  { updateArtistPackage?: boolean | null },
  { updateRequest: UpdateArtistPackageRequestInput }
>;

export const deleteArtistPackageMutation = `
  mutation DeleteArtistPackage($artistPackageId: String!) {
    deleteArtistPackage(artistPackageId: $artistPackageId)
  }
` as unknown as TypedDocumentString<
  { deleteArtistPackage?: boolean | null },
  { artistPackageId: string }
>;

const ServicePackageServiceView = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleCreatePackage = () => {
    setViewMode('create');
  };

  const handleEditPackage = (packageId: string) => {
    setSelectedPackageId(packageId);
    setViewMode('edit');
  };

  const handleViewDetail = (packageId: string) => {
    // Navigate to detail page instead of changing local state
    router.push(`/artist/studio/service-package/${packageId}`);
  };

  const handleDeletePackage = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Delete logic will be handled in section
    setDeleteModalOpen(false);
    if (viewMode !== 'list') {
      setViewMode('list');
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPackageId('');
  };

  const handleSuccess = () => {
    setViewMode('list');
    setSelectedPackageId('');
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'create':
        return (
          <CreatePackageServiceSection
            onCancel={handleBackToList}
            onSuccess={handleSuccess}
          />
        );
      case 'edit':
        return (
          <UpdatePackageServiceSection
            packageId={selectedPackageId}
            onCancel={handleBackToList}
            onSuccess={handleSuccess}
            onDelete={handleDeletePackage}
          />
        );
      case 'detail':
        return (
          <ServicePackageDetailSection
            packageId={selectedPackageId}
            onBack={handleBackToList}
            onEdit={() => handleEditPackage(selectedPackageId)}
            onDelete={handleDeletePackage}
          />
        );
      case 'list':
      default:
        return (
          <ServicePackageListSection
            onCreatePackage={handleCreatePackage}
            onEditPackage={handleEditPackage}
            onViewDetail={handleViewDetail}
          />
        );
    }
  };

  return (
    <PackageServiceLayout>
      {renderCurrentView()}
      
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        action="delete"
      />
    </PackageServiceLayout>
  );
};

export default ServicePackageServiceView;
