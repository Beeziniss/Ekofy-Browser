import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search, X } from 'lucide-react';
import ApprovalPackageList from '../component/approval-package-list';
import ApprovalConfirmDialog from '../component/approval-confirm-dialog';
import { PendingArtistPackageResponse } from '@/gql/graphql';
import { execute } from '@/gql/execute';
import { moderatorPendingPackagesOptions } from '@/gql/options/moderator-options';
import { 
  approveArtistPackageMutation,
  rejectArtistPackageMutation 
} from '@/modules/artist/service-package/ui/view/service-package-service-view';

const ApprovalServicePackageSection= () => {
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject';
    packageId: string;
    packageName: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const queryClient = useQueryClient();

  // Query for pending packages for all artists (moderator view) with search
  const { data: pendingData, isLoading: pendingLoading, error: pendingError } = useQuery({
    ...moderatorPendingPackagesOptions(searchTerm),
    refetchInterval: 30 * 1000, // Auto refresh every 30 seconds
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (packageId: string) => execute(approveArtistPackageMutation, { id: packageId }),
    onSuccess: () => {
      toast.success('Package approved successfully');
      queryClient.invalidateQueries({ queryKey: ['moderator-pending-packages'] });
    },
    onError: (error) => {
      toast.error('Failed to approve package');
      console.error('Approve error:', error);
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (packageId: string) => execute(rejectArtistPackageMutation, { id: packageId }),
    onSuccess: () => {
      toast.success('Package rejected successfully');
      queryClient.invalidateQueries({ queryKey: ['moderator-pending-packages'] });
    },
    onError: (error) => {
      toast.error('Failed to reject package');
      console.error('Reject error:', error);
    },
  });

  const handleApprove = (packageId: string) => {
    const pkg = pendingPackages.find((p: PendingArtistPackageResponse) => p.id === packageId);
    setConfirmAction({
      type: 'approve',
      packageId,
      packageName: pkg?.packageName || 'Package'
    });
  };

  const handleReject = (packageId: string) => {
    const pkg = pendingPackages.find((p: PendingArtistPackageResponse) => p.id === packageId);
    setConfirmAction({
      type: 'reject',
      packageId,
      packageName: pkg?.packageName || 'Package'
    });
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    
    if (confirmAction.type === 'approve') {
      approveMutation.mutate(confirmAction.packageId);
    } else {
      rejectMutation.mutate(confirmAction.packageId);
    }
    setConfirmAction(null);
  };

  const handleCancelAction = () => {
    setConfirmAction(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['moderator-pending-packages', searchTerm] });
    toast.info('Refreshing pending packages...');
  };

  const pendingPackages = useMemo(() => pendingData?.pendingArtistPackages || [], [pendingData]);
  const artists = useMemo(() => pendingData?.artists?.items || [], [pendingData]);
  const isLoading = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card className="border-gray-700 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-white">Service Package Approval</CardTitle>
              {pendingPackages.length > 0 && (
                <Badge variant="secondary" className="bg-yellow-600 text-yellow-100">
                  {pendingPackages.length} Pending
                </Badge>
              )}
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Review and approve or reject pending service packages from artists
          </p>
          
          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search packages by name..."
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
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="border-gray-600 text-gray-300 hover:text-white"
              title="Refresh packages"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {pendingError ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">Error loading pending packages: {pendingError.message}</p>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : pendingLoading ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 mb-4">
                <RefreshCw className="h-12 w-12 text-gray-400 animate-spin" />
              </div>
              <p className="text-gray-400">Loading pending packages...</p>
            </div>
          ) : (
            <ApprovalPackageList
              packages={pendingPackages}
              artists={artists}
              onApprove={handleApprove}
              onReject={handleReject}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ApprovalConfirmDialog
        isOpen={!!confirmAction}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        action={confirmAction?.type || 'approve'}
        packageName={confirmAction?.packageName}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ApprovalServicePackageSection;