"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { subscriptionsQueryOptions } from "@/gql/options/subscription-options";
import { SubscriptionTable } from "../component/subscription/subscription-table";
import { SubscriptionActions } from "../component/subscription/subscription-actions";
import { CreateSubscriptionForm } from "../component/subscription/create-subscription-form";
import { CustomPagination } from "@/components/ui/custom-pagination";
import type { Subscription, SubscriptionsResponse } from "@/types";

interface SubscriptionListSectionProps {
  initialData?: SubscriptionsResponse;
}

export function SubscriptionListSection({ initialData }: SubscriptionListSectionProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  const { data, isLoading, refetch } = useQuery({
    ...subscriptionsQueryOptions(skip, pageSize, searchTerm),
    initialData,
  });

  const subscriptions = data?.subscriptions.items || [];
  const totalCount = data?.subscriptions.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearch = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewSubscription = (subscription: Subscription) => {
    router.push(`/admin/subscription/${subscription.id}`);
  };

  const handleCreateSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <SubscriptionActions
        onCreateSubscription={() => setIsCreateFormOpen(true)}
        onSearch={handleSearch}
        searchPlaceholder="Search subscriptions by name..."
      />

      <SubscriptionTable
        subscriptions={subscriptions}
        onView={handleViewSubscription}
        isLoading={isLoading}
      />

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

      <CreateSubscriptionForm
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
