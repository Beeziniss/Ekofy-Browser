"use client";

import PendingRequestsTable, { PendingTrackUploadRequest } from "./index";
import PendingRequestsTableHeader from "./pending-requests-table-header";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SortingState, Updater } from "@tanstack/react-table";

interface PendingRequestsTableWrapperProps {
  data: PendingTrackUploadRequest[];
  totalCount: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  pageSize?: number;
}

const PendingRequestsTableWrapper = ({
  data,
  totalCount,
  hasNextPage = false,
  hasPreviousPage = false,
  pageSize: propPageSize,
}: PendingRequestsTableWrapperProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>([]);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = propPageSize || parseInt(searchParams.get("pageSize") || "10");

  const updateURLParams = useCallback(
    (params: { [key: string]: string | number }) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (value === "" || value === "all" || (key === "page" && value === 1)) {
          current.delete(key);
        } else {
          current.set(key, value.toString());
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.push(`${window.location.pathname}${query}`, { scroll: false });
    },
    [searchParams, router],
  );

  useEffect(() => {
    // Set react-table sorting state from URL params
    const urlSortBy = searchParams.get("sortBy") || "";
    const urlSortOrder = searchParams.get("sortOrder") || "desc";

    if (urlSortBy) {
      setSorting([{ id: urlSortBy, desc: urlSortOrder === "desc" }]);
    } else {
      setSorting([]);
    }
  }, [searchParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      updateURLParams({ page });
    },
    [updateURLParams],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      updateURLParams({ pageSize: newPageSize, page: 1 });
    },
    [updateURLParams],
  );

  const handleSortingChange = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const newSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;

      setSorting(newSorting);
      if (newSorting.length > 0) {
        const sort = newSorting[0];
        const newSortBy = sort.id;
        const newSortOrder = sort.desc ? "desc" : "asc";
        updateURLParams({
          sortBy: newSortBy,
          sortOrder: newSortOrder,
          page: 1,
        });
      }
    },
    [updateURLParams, sorting],
  );

  return (
    <div className="w-full">
      <PendingRequestsTableHeader totalRequests={data.length} />
      <PendingRequestsTable
        data={data}
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </div>
  );
};

export default PendingRequestsTableWrapper;
