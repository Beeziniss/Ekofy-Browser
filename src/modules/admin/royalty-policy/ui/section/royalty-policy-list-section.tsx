"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { RoyaltyPolicyTable } from "../component/royalty-policy-table";
import { RoyaltyPolicyFilters } from "../component/royalty-policy-filters";
import { CreateRoyaltyPolicyDialog } from "../component/create-royalty-policy-dialog";
import { royaltyPoliciesOptions } from "@/gql/options/royalty-policies-options";
import {
  CurrencyType,
  PolicyStatus,
  RoyaltyPolicyFilterInput,
  RoyaltyPoliciesQuery,
} from "@/gql/graphql";

type RoyaltyPolicy = NonNullable<
  NonNullable<RoyaltyPoliciesQuery["royaltyPolicies"]>["items"]
>[number];

export function RoyaltyPolicyListSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<{
    search?: string;
    currency?: CurrencyType;
    status?: PolicyStatus;
  }>({});

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
      setCurrentPage(1); // Reset to first page when filters change
    },
    []
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateSuccess = () => {
    refetch();
  };

  const handleView = (policy: RoyaltyPolicy) => {
    // TODO: Implement view details
    console.log("View policy:", policy);
  };

  const handleEdit = (policy: RoyaltyPolicy) => {
    // TODO: Implement edit dialog (when mutation is ready)
    console.log("Edit policy:", policy);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <RoyaltyPolicyFilters onFiltersChange={handleFiltersChange} />
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Policy
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-muted-foreground text-sm font-medium">Total Policies</div>
          <div className="mt-2 text-2xl font-bold">{totalCount}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-muted-foreground text-sm font-medium">Active Policies</div>
          <div className="mt-2 text-2xl font-bold">
            {policies.filter((p: RoyaltyPolicy) => p.status === PolicyStatus.Active).length}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-muted-foreground text-sm font-medium">Pending Review</div>
          <div className="mt-2 text-2xl font-bold">
            {policies.filter((p: RoyaltyPolicy) => p.status === PolicyStatus.Pending).length}
          </div>
        </div>
      </div>

      {/* Table */}
      <RoyaltyPolicyTable
        policies={policies}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
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
    </div>
  );
}
