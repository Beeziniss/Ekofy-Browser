"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CouponTable } from "../components/coupon-table";
import { CouponForm } from "../components/coupon-form";
import { adminCouponsOptions, createCouponMutationOptions, deprecateCouponMutationOptions } from "@/gql/options/admin-options";
import { useRouter, useSearchParams } from "next/navigation";
import { CouponStatus, CreateCouponRequestInput } from "@/gql/graphql";
import { toast } from "sonner";

type ViewMode = "list" | "create";

export function CouponSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchParams.get("search") || "");
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 10;

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    const queryString = params.toString();
    router.replace(`/admin/coupon${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [currentPage, debouncedSearchTerm, statusFilter, router]);

  // Debounce search term
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search term changes
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const statusFilterValue = statusFilter === "ALL" ? undefined : (statusFilter as CouponStatus);

  const {
    data: couponsData,
    isLoading,
    error,
  } = useQuery(adminCouponsOptions(currentPage, pageSize, debouncedSearchTerm, statusFilterValue));

  // Create coupon mutation
  const { mutate: createCoupon, isPending: isCreating } = useMutation({
    ...createCouponMutationOptions,
    onSuccess: () => {
      toast.success("Coupon created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setViewMode("list");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create coupon: ${error.message}`);
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handleCreateCoupon = () => {
    setViewMode("create");
  };

  const handleCancelCreate = () => {
    setViewMode("list");
  };

  const handleSubmitCoupon = (data: CreateCouponRequestInput) => {
    createCoupon(data);
  };

  if (viewMode === "create") {
    return <CouponForm onSubmit={handleSubmitCoupon} onCancel={handleCancelCreate} isLoading={isCreating} />;
  }

  if (isLoading && !isSearching) {
    return <div className="flex h-64 items-center justify-center">Loading Data...</div>;
  }
  if (error) {
    return <div className="text-red-500">Error loading data: {error.message}</div>;
  }

  const coupons = couponsData?.coupons?.items || [];
  const totalCount = couponsData?.coupons?.totalCount || 0;

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Show loading state for table or searching state
  const isTableLoading = isLoading || isSearching;

  return (
    <div className="space-y-6">
      <CouponTable
        data={coupons}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        isLoading={isTableLoading}
        error={error}
        onCreateCoupon={handleCreateCoupon}
      />
    </div>
  );
}

