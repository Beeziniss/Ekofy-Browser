"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Plus, ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { RoyaltyPolicyTable } from "../component/royalty-policy-table";
import { RoyaltyPolicyFilters } from "../component/royalty-policy-filters";
import { CreateRoyaltyPolicyDialog } from "../component/create-royalty-policy-dialog";
import { DowngradeVersionDialog } from "../component/downgrade-version-dialog";
import { SwitchToLatestDialog } from "../component/switch-to-latest-dialog";
import { royaltyPoliciesOptions, isCurrentVersionLatest, isDowngradeAvailable } from "@/gql/options/royalty-policies-options";
import {
  CurrencyType,
  PolicyStatus,
  RoyaltyPolicyFilterInput,
} from "@/gql/graphql";

export function RoyaltyPolicyListSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDowngradeDialogOpen, setIsDowngradeDialogOpen] = useState(false);
  const [isSwitchToLatestDialogOpen, setIsSwitchToLatestDialogOpen] = useState(false);

  const [filters, setFilters] = useState<{
    search?: string;
    currency?: CurrencyType;
    status?: PolicyStatus;
  }>({
    status: searchParams.get("status") ? (searchParams.get("status") as PolicyStatus) : undefined,
  });

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (filters.status) params.set("status", filters.status);

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [currentPage, filters.status, router, pathname]);

  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  // Build filter object for GraphQL query
  const buildWhereFilter = useCallback((): RoyaltyPolicyFilterInput | undefined => {
    if (!filters.currency && !filters.status) return undefined;

    const where: RoyaltyPolicyFilterInput = {};

    if (filters.currency) {
      where.currency = { eq: filters.currency };
    }

    if (filters.status) {
      where.status = { eq: filters.status };
    }

    return where;
  }, [filters]);

  const whereFilter = buildWhereFilter();

  const { data, isLoading, refetch } = useQuery(
    royaltyPoliciesOptions(skip, pageSize, whereFilter)
  );

  const policies = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleFiltersChange = useCallback(
    (newFilters: { search?: string; currency?: CurrencyType; status?: PolicyStatus }) => {
      setFilters(newFilters);
      setCurrentPage(1);
    },
    []
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateSuccess = () => {
    refetch();
  };

  // Check version states
  const isLatestVersion = isCurrentVersionLatest(policies);
  const canDowngrade = isDowngradeAvailable(policies);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <RoyaltyPolicyFilters 
          onFiltersChange={handleFiltersChange}
          initialStatus={filters.status}
        />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsDowngradeDialogOpen(true)}
            disabled={!canDowngrade}
            title={!canDowngrade ? "No previous version available to downgrade to" : "Downgrade to previous version"}
          >
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Downgrade Version
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsSwitchToLatestDialogOpen(true)}
            disabled={isLatestVersion}
            title={isLatestVersion ? "Already on latest version" : "Switch to latest version"}
          >
            <ArrowUpToLine className="mr-2 h-4 w-4" />
            Switch to Latest
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Policy
          </Button>
        </div>
      </div>
      {/* Table */}
      <RoyaltyPolicyTable
        policies={policies}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Create Dialog */}
      <CreateRoyaltyPolicyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      {/* Downgrade Version Dialog */}
      <DowngradeVersionDialog
        open={isDowngradeDialogOpen}
        onOpenChange={setIsDowngradeDialogOpen}
        onSuccess={handleCreateSuccess}
        availablePolicies={policies}
      />

      {/* Switch to Latest Dialog */}
      <SwitchToLatestDialog
        open={isSwitchToLatestDialogOpen}
        onOpenChange={setIsSwitchToLatestDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
