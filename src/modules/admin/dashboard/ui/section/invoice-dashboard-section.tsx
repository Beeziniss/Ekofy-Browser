"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { invoiceDashboardOptions } from "@/gql/options/dashboard-options";
import { InvoiceTable } from "../component/invoice-dashboard/invoice-table";
import { InvoiceFilters } from "../component/invoice-dashboard/invoice-filters";
import { SortEnumType } from "@/gql/graphql";

export function InvoiceDashboardSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filters from URL
  const page = parseInt(searchParams.get("invoicePage") || "1");
  const status = searchParams.get("invoiceStatus") || "all";
  const type = searchParams.get("invoiceType") || "all";
  const pageSize = 5; // Reduced from 10 to 5 to avoid field cost limit

  // Build where filter
  const whereFilter = useMemo(() => {
    const filter: Record<string, unknown> = {};
    
    // Filter by invoice type
    if (type === "service") {
      filter.oneOffSnapshot = { ne: null };
    } else if (type === "subscription") {
      filter.subscriptionSnapshot = { ne: null };
    }

    return Object.keys(filter).length > 0 ? filter : undefined;
  }, [type]);

  const { data, isLoading } = useQuery(
    invoiceDashboardOptions(
      (page - 1) * pageSize,
      pageSize,
      whereFilter,
      [{ paidAt: SortEnumType.Desc }],
    )
  );

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "1") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleStatusChange = (newStatus: string) => {
    updateURL("invoiceStatus", newStatus);
    updateURL("invoicePage", "1"); // Reset to page 1
  };

  const handleTypeChange = (newType: string) => {
    updateURL("invoiceType", newType);
    updateURL("invoicePage", "1"); // Reset to page 1
  };

  const handlePageChange = (newPage: number) => {
    updateURL("invoicePage", newPage.toString());
  };

  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;
  const hasNextPage = data?.pageInfo.hasNextPage || false;
  const hasPreviousPage = data?.pageInfo.hasPreviousPage || false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <InvoiceFilters
            selectedStatus={status}
            onStatusChange={handleStatusChange}
            selectedType={type}
            onTypeChange={handleTypeChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            <InvoiceTable invoices={data?.items || []} />
            
            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages || 1} ({data?.totalCount || 0} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPreviousPage || page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasNextPage}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
