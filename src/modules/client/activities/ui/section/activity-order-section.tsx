"use client";

import { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orderPackageOptions } from "@/gql/options/client-options";
import ActivityOrderTable from "../components/activity-order-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ActivityOrderSectionProps {
  userId: string;
}

const ActivityOrderSection = ({ userId }: ActivityOrderSectionProps) => {
  return (
    <Suspense fallback={<ActivityOrderSectionSkeleton />}>
      <ActivityOrderSectionSuspense userId={userId} />
    </Suspense>
  );
};

const ActivityOrderSectionSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-y-6">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-10 w-1/3 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
      <Skeleton className="h-6 w-56 rounded-md" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-80 max-w-80">Client</TableHead>
              <TableHead>Package</TableHead>
              <TableHead className="w-52">Deadline</TableHead>
              <TableHead className="w-44">Total</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="w-80 max-w-80">
                  <Skeleton className="h-6 w-48 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-32 rounded-md" />
                </TableCell>
                <TableCell className="w-52">
                  <Skeleton className="h-6 w-24 rounded-md" />
                </TableCell>
                <TableCell className="w-44">
                  <Skeleton className="h-6 w-20 rounded-md" />
                </TableCell>
                <TableCell className="w-28">
                  <Skeleton className="h-6 w-16 rounded-md" />
                </TableCell>
                <TableCell className="w-20">
                  <Skeleton className="h-6 w-12 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const ActivityOrderSectionSuspense = ({ userId }: ActivityOrderSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  const { data: orderData } = useSuspenseQuery(
    orderPackageOptions({ currentUserId: userId, skip, take: pageSize, isArtist: true }),
  );

  const orders = orderData?.packageOrders?.items || [];
  const totalCount = orderData?.packageOrders?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex w-full flex-col gap-y-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-4xl font-semibold tracking-wide">My Orders</h1>
      </div>
      <div>{totalCount} result found</div>
      <ActivityOrderTable
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

export default ActivityOrderSection;
