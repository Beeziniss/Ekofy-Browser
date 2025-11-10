import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { RefreshCw, Search, X } from "lucide-react";
import ApprovalPackageList from "../component/approval-package-list";
import ApprovalConfirmDialog from "../component/approval-confirm-dialog";
import { PendingArtistPackageResponse } from "@/gql/graphql";
import { moderatorPendingPackagesOptions } from "@/gql/options/moderator-options";
import { useApproveArtistPackage, useRejectArtistPackage } from "@/gql/client-mutation-options/moderator-mutation";

const ApprovalServicePackageSection = () => {
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject";
    packageId: string;
    packageName: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const queryClient = useQueryClient();

  // Query for pending packages for all artists (moderator view) with search and pagination
  const {
    data: pendingData,
    isLoading: pendingLoading,
    error: pendingError,
  } = useQuery({
    ...moderatorPendingPackagesOptions(currentPage, pageSize, searchTerm),
    refetchInterval: 30 * 1000, // Auto refresh every 30 seconds
  });

  // Use custom hooks for approve and reject mutations with built-in invalidateQueries
  const approveMutation = useApproveArtistPackage();
  const rejectMutation = useRejectArtistPackage();

  const handleApprove = (packageId: string) => {
    const pkg = pendingPackages.find((p: PendingArtistPackageResponse) => p.id === packageId);
    setConfirmAction({
      type: "approve",
      packageId,
      packageName: pkg?.packageName || "Package",
    });
  };

  const handleReject = (packageId: string) => {
    const pkg = pendingPackages.find((p: PendingArtistPackageResponse) => p.id === packageId);
    setConfirmAction({
      type: "reject",
      packageId,
      packageName: pkg?.packageName || "Package",
    });
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    if (confirmAction.type === "approve") {
      approveMutation.mutate(confirmAction.packageId, {
        onSuccess: () => {
          toast.success("Package approved successfully");
        },
        onError: (error) => {
          toast.error("Failed to approve package");
          console.error("Approve error:", error);
        },
      });
    } else {
      rejectMutation.mutate(confirmAction.packageId, {
        onSuccess: () => {
          toast.success("Package rejected successfully");
        },
        onError: (error) => {
          toast.error("Failed to reject package");
          console.error("Reject error:", error);
        },
      });
    }
    setConfirmAction(null);
  };

  const handleCancelAction = () => {
    setConfirmAction(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["moderator-pending-packages", currentPage, pageSize, searchTerm] });
    toast.info("Refreshing pending packages...");
  };

  const pendingPackages = useMemo(() => pendingData?.pendingArtistPackages?.items || [], [pendingData]);
  const artists = useMemo(() => pendingData?.artists?.items || [], [pendingData]);
  const totalCount = pendingData?.pendingArtistPackages?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const isLoading = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <Card className="mb-6 border-gray-700">
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
          <p className="mb-4 text-sm text-gray-400">
            Review and approve or reject pending service packages from artists
          </p>

          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="text"
                placeholder="Search packages by name..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="border-gray-600 bg-gray-700 pr-10 pl-10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {searchTerm && <div className="text-sm text-gray-400">Searching for: &ldquo;{searchTerm}&rdquo;</div>}
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
            <div className="py-8 text-center">
              <p className="mb-4 text-red-400">Error loading pending packages: {pendingError.message}</p>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : pendingLoading ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 h-12 w-12">
                <RefreshCw className="h-12 w-12 animate-spin text-gray-400" />
              </div>
              <p className="text-gray-400">Loading pending packages...</p>
            </div>
          ) : (
            <>
              <ApprovalPackageList
                packages={pendingPackages}
                artists={artists}
                onApprove={handleApprove}
                onReject={handleReject}
                isLoading={isLoading}
              />
              {/* Pagination */}
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                isLoading={pendingLoading}
                className="mt-6"
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ApprovalConfirmDialog
        isOpen={!!confirmAction}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        action={confirmAction?.type || "approve"}
        packageName={confirmAction?.packageName}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ApprovalServicePackageSection;
