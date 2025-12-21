"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EntitlementActions } from "../components/entitlement-actions";
import { EntitlementFiltersComponent } from "../components/entitlement-filters";
import { EntitlementTable } from "../components/entitlement-table";
import { CreateEntitlementDialog } from "../components/create-entitlement-dialog";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useEntitlements } from "../../hooks";
import { useDeactivateEntitlementMutation, useReactivateEntitlementMutation } from "@/gql/client-mutation-options/entitlements-mutation-options";

export function EntitlementListSection() {
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    entitlements,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    filters,
    handlePageChange,
    handleFilterChange,
    resetFilters,
    refetch,
  } = useEntitlements();

  const deactivateMutation = useDeactivateEntitlementMutation();
  const reactivateMutation = useReactivateEntitlementMutation();

  const handleView = (entitlementId: string) => {
    router.push(`/admin/entitlement/${entitlementId}`);
  };

  const handleDeactivate = (code: string) => {
    deactivateMutation.mutate(code, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleReactivate = (code: string) => {
    reactivateMutation.mutate(code, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleCreateSuccess = () => {
    refetch();
  };

  return (
    <>
      <div className="space-y-6">
        <EntitlementActions onCreateEntitlement={() => setIsCreateDialogOpen(true)} />

        <EntitlementFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />

        <EntitlementTable
          entitlements={entitlements}
          isLoading={isLoading}
          onView={handleView}
          onDeactivate={handleDeactivate}
          onReactivate={handleReactivate}
        />

        {totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <CreateEntitlementDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}

