"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { OrderDisputedTableWrapper } from "../component";
import { moderatorDisputedPackageOrdersOptions } from "@/gql/options/moderator-options";
import { toast } from "sonner";
import { PackageOrderItem } from "@/types";

export function OrderDisputedSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchParams.get("search") || "");
  const pageSize = 10;

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    
    const queryString = params.toString();
    router.replace(`/moderator/order-disputed${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [currentPage, debouncedSearchTerm, router]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery(moderatorDisputedPackageOrdersOptions(currentPage, pageSize));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (isLoading && !ordersData) {
    return (
      <div className="space-y-6">
        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50">
          <div className="text-gray-400">Loading disputed orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load disputed orders");
    return (
      <div className="space-y-6">
        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50">
          <div className="text-red-400">Error loading orders: {error.message}</div>
        </div>
      </div>
    );
  }

  const orders = (ordersData?.items || []) as PackageOrderItem[];
  const totalCount = ordersData?.totalCount || 0;
  const pageInfo = ordersData?.pageInfo;

  return (
    <div className="space-y-6">
      <OrderDisputedTableWrapper
        orders={orders}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        hasNextPage={pageInfo?.hasNextPage || false}
        hasPreviousPage={pageInfo?.hasPreviousPage || false}
        onPageChange={handlePageChange}
        onSearchChange={handleSearch}
        searchTerm={searchTerm}
      />
    </div>
  );
}
