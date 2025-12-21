"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
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

  // Use state for filters instead of relying on URL params
  const [status, setStatus] = useState(searchParams.get("invoiceStatus") || "all");
  const [type, setType] = useState(searchParams.get("invoiceType") || "all");
  const [page, setPage] = useState(parseInt(searchParams.get("invoicePage") || "1"));
  const pageSize = 5;

  // Build where filter
  const whereFilter = useMemo(() => {
    const filter: Record<string, unknown> = {};
    return Object.keys(filter).length > 0 ? filter : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const { data, isLoading } = useQuery(
    invoiceDashboardOptions((page - 1) * pageSize, pageSize, whereFilter, [{ paidAt: SortEnumType.Desc }]),
  );

  // Client-side filtering by invoice type
  const typeFilteredInvoices = useMemo(() => {
    if (!data?.items) return [];
    if (type === "all") return data.items;

    return data.items.filter((invoice) => {
      if (type === "service") {
        return invoice.oneOffSnapshot !== null && invoice.oneOffSnapshot !== undefined;
      } else if (type === "subscription") {
        return invoice.subscriptionSnapshot !== null && invoice.subscriptionSnapshot !== undefined;
      }
      return true;
    });
  }, [data?.items, type]);

  // Client-side filtering by payment status
  const filteredInvoices = useMemo(() => {
    if (status === "all") return typeFilteredInvoices;
    const filtered = typeFilteredInvoices.filter((invoice) => {
      const transactionStatus = invoice.transaction?.[0]?.paymentStatus;
      return transactionStatus === status;
    });

    return filtered;
  }, [typeFilteredInvoices, status]);

  // Adjust pagination for filtered results
  const filteredTotalCount = useMemo(() => {
    if (status === "all") return data?.totalCount || 0;
    return filteredInvoices.length;
  }, [status, data?.totalCount, filteredInvoices.length]);

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "1") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const newUrl = `?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    updateURL("invoiceStatus", newStatus);
    if (newStatus !== status) {
      setPage(1);
      updateURL("invoicePage", "1");
    }
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    updateURL("invoiceType", newType);
    if (newType !== type) {
      setPage(1);
      updateURL("invoicePage", "1");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL("invoicePage", newPage.toString());
  };

  const totalPages = filteredTotalCount ? Math.ceil(filteredTotalCount / pageSize) : 0;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

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
            <InvoiceTable invoices={filteredInvoices} />

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Page {page} of {totalPages || 1} ({filteredTotalCount} total)
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
                <Button variant="outline" size="sm" disabled={!hasNextPage} onClick={() => handlePageChange(page + 1)}>
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
