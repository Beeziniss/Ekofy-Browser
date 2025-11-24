"use client";

import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import ActivityConversationTable from "../components/activity-conversation-table";
import { listenerOptions, orderPackageOptions } from "@/gql/options/client-options";

interface ActivityConversationSectionProps {
  userId: string;
}

const ActivityConversationSection = ({ userId }: ActivityConversationSectionProps) => {
  return (
    <Suspense fallback={<ActivityConversationSectionSkeleton />}>
      <ActivityConversationSectionSuspense userId={userId} />
    </Suspense>
  );
};

const ActivityConversationSectionSkeleton = () => {
  return <div>Loading...</div>;
};

const ActivityConversationSectionSuspense = ({ userId }: ActivityConversationSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  const { data: listenerData } = useSuspenseQuery(listenerOptions(userId, userId));
  const { data: orderData } = useSuspenseQuery(orderPackageOptions({ userId, skip, take: pageSize }));

  const orders = orderData?.packageOrders?.items || [];
  const totalCount = orderData?.packageOrders?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex w-full flex-col gap-y-6">
      <h1 className="text-4xl tracking-wide">
        Orders with <strong>{listenerData.listeners?.items?.[0].displayName}</strong>
      </h1>
      <div>{totalCount} result found</div>
      <ActivityConversationTable
        orders={orders}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ActivityConversationSection;
