"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import ServicePackageList from '../component/service-package-list/service-package-list';
import PendingPackageList from '../component/service-package-list/pending-package-list';
import DeleteConfirmModal from '../component/delete-package-service/delete-confirm-modal';
import { execute } from '@/gql/execute';
import { artistPackagesOptions, pendingPackagesOptions } from '@/gql/options/artist-options';
import { changeArtistPackageStatusMutation, deleteArtistPackageMutation } from '@/modules/artist/service-package/ui/view/service-package-service-view';
import { ArtistPackageStatus } from '@/gql/graphql';
import { useAuthStore } from '@/store';
interface ServicePackageListSectionProps {
  onCreatePackage: () => void;
  onEditPackage: (packageId: string) => void;
  onViewDetail: (packageId: string) => void;
}

const ServicePackageListSection: React.FC<ServicePackageListSectionProps> = ({
  onCreatePackage,
  onEditPackage,
  onViewDetail,
}) => {
  const [currentView, setCurrentView] = useState<'packages' | 'pending'>('packages');
  const [artistId, setArtistId] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.artistId) {
      setArtistId(user.artistId);
    } else {
      console.warn('⚠️ Artist ID not found in auth store');
    }
  }, [user]);

  // Query for artist packages using options with search
  const { data: packagesData, isLoading: packagesLoading, error: packagesError } = useQuery({
    ...artistPackagesOptions(artistId, searchTerm),
    enabled: !!artistId,
  });

  // Query for pending packages using options with search
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    ...pendingPackagesOptions(artistId, searchTerm),
    enabled: !!artistId && currentView === 'pending',
  });

  // Mutation for changing package status
  const changeStatusMutation = useMutation({
    mutationFn: (variables: { packageId: string; status: ArtistPackageStatus }) =>
      execute(changeArtistPackageStatusMutation, {
        updateStatusRequest: {
          id: variables.packageId,
          status: variables.status
        }
      }),
    onSuccess: () => {
      toast.success('Package status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['artist-packages'] });
    },
    onError: (error) => {
      toast.error('Failed to update package status');
      console.error('Status change error:', error);
    },
  });

  // Mutation for deleting package
  const deletePackageMutation = useMutation({
    mutationFn: (packageId: string) =>
      execute(deleteArtistPackageMutation, {
        artistPackageId: packageId
      }),
    onSuccess: () => {
      toast.success('Package deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['artist-packages'] });
      setDeleteModalOpen(false);
      setPackageToDelete('');
    },
    onError: (error) => {
      toast.error('Failed to delete package');
      console.error('Delete error:', error);
    },
  });

  const handleStatusChange = (packageId: string, status: ArtistPackageStatus) => {
    changeStatusMutation.mutate({ packageId, status });
  };

  const handleDeletePackage = (packageId: string) => {
    setPackageToDelete(packageId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (packageToDelete) {
      deletePackageMutation.mutate(packageToDelete);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setPackageToDelete('');
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleViewChange = (view: 'packages' | 'pending') => {
    setCurrentView(view);
    setSearchTerm(''); // Clear search when switching views
  };

  const handleCancelPendingPackage = (packageId: string) => {
    // This would typically call a cancel pending package mutation
    console.log('Cancel pending package:', packageId);
    toast.info('Cancel pending package functionality to be implemented');
  };

  const packages = useMemo(() => packagesData?.artistPackages?.items || [], [packagesData]);
  const pendingPackages = useMemo(() => pendingData?.pendingArtistPackages || [], [pendingData]);
  const artists = useMemo(() => pendingData?.artists?.items || [], [pendingData]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card className=" border-gray-700 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Artist Service Packages</CardTitle>
            <div className="flex items-center space-x-4">
              {currentView === 'packages' ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleViewChange('pending')}
                    className="border-gray-600 text-gray-300 hover:text-white"
                  >
                    Pending list
                  </Button>
                  <Button
                    onClick={onCreatePackage}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    + Add Package
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => handleViewChange('packages')}
                  className="border-gray-600 text-gray-300 hover:text-white"
                >
                  Package list
                </Button>
              )}
            </div>
          </div>
          {(currentView === 'packages' || currentView === 'pending') && (
            <div className="flex items-center space-x-4 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={currentView === 'packages' ? "Search packages by name..." : "Search pending packages by name..."}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="text-sm text-gray-400">
                  Searching for: &ldquo;{searchTerm}&rdquo;
                </div>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {!artistId ? (
            <div className="text-center py-8">
              <p className="text-red-400">Artist ID not found. Please log in again.</p>
            </div>
          ) : currentView === 'packages' ? (
            packagesLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Loading packages...</p>
              </div>
            ) : packagesError ? (
              <div className="text-center py-8">
                <p className="text-red-400">Error loading packages: {packagesError.message}</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <ServicePackageList
                packages={packages}
                onEdit={onEditPackage}
                onDelete={handleDeletePackage}
                onViewDetail={onViewDetail}
                onStatusChange={handleStatusChange}
              />
            )
          ) : (
            pendingLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Loading pending packages...</p>
              </div>
            ) : (
              <PendingPackageList
                packages={pendingPackages}
                artists={artists}
                onCancel={handleCancelPendingPackage}
              />
            )
          )}
        </CardContent>
      </Card>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        action="delete"
      />
    </div>
  );
};

export default ServicePackageListSection;
