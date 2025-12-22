"use client";

import { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import ActivityConversationTable from "../components/activity-conversation-table";
import { listenerOptions, orderPackageOptions } from "@/gql/options/client-options";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PackageOrderStatus } from "@/gql/graphql";

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

const ActivityConversationSectionSuspense = ({ userId }: ActivityConversationSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<PackageOrderStatus>(PackageOrderStatus.InProgress);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const { data: listenerData } = useSuspenseQuery(listenerOptions(userId, userId));

  const statusOptions = [
    { value: PackageOrderStatus.InProgress, label: "In Progress" },
    { value: PackageOrderStatus.Paid, label: "Paid" },
    { value: PackageOrderStatus.Completed, label: "Completed" },
    { value: PackageOrderStatus.Disputed, label: "Disputed" },
    { value: PackageOrderStatus.Refund, label: "Refund" },
  ];

  const handleStatusFilterChange = (value: string) => {
    setStatus(value as PackageOrderStatus);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = () => {
    const skip = (currentPage - 1) * pageSize;
    // Refetch the orders data
    queryClient.invalidateQueries({
      queryKey: ["order-packages", skip, pageSize, userId, undefined, false, undefined, status],
    });
  };

  /* const handleGoBack = () => {
    router.back();
  }; */

  return (
    <div className="flex w-full flex-col gap-y-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-4xl tracking-wide">
          Orders with <strong>{listenerData.listeners?.items?.[0].displayName}</strong>
        </h1>

        <Select value={status} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* {user && user.userId === userId ? (
          <Link
            href="/profile"
            className="text-main-white hover:border-main-white flex cursor-pointer items-center gap-x-2 border-b border-transparent pb-0.5 transition-colors"
          >
            <ArrowLeftIcon className="w-4" /> Back to profile
          </Link>
        ) : (
          <div
            onClick={handleGoBack}
            className="text-main-white hover:border-main-white flex cursor-pointer items-center gap-x-2 border-b border-transparent pb-0.5 transition-colors"
          >
            <ArrowLeftIcon className="w-4" /> Back to previous page
          </div>
        )} */}
      </div>

      <Suspense fallback={<ActivityConversationTableSkeleton />}>
        <ActivityConversationTableWrapper
          userId={userId}
          currentPage={currentPage}
          pageSize={pageSize}
          status={status}
          onPageChange={handlePageChange}
          onStatusChange={handleStatusChange}
        />
      </Suspense>
    </div>
  );
};

interface ActivityConversationTableWrapperProps {
  userId: string;
  currentPage: number;
  pageSize: number;
  status: PackageOrderStatus;
  onPageChange: (page: number) => void;
  onStatusChange: () => void;
}

const ActivityConversationTableWrapper = ({
  userId,
  currentPage,
  pageSize,
  status,
  onPageChange,
  onStatusChange,
}: ActivityConversationTableWrapperProps) => {
  const skip = (currentPage - 1) * pageSize;

  const { data: orderData } = useSuspenseQuery(
    orderPackageOptions({ currentUserId: userId, skip, take: pageSize, isArtist: false, status }),
  );

  const orders = orderData?.packageOrders?.items || [];
  const totalCount = orderData?.packageOrders?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <div className="text-muted-foreground text-sm">{totalCount} result found</div>
      <ActivityConversationTable
        orders={orders}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onStatusChange={onStatusChange}
      />
    </>
  );
};

const ActivityConversationTableSkeleton = () => {
  return (
    <>
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
    </>
  );
};

export default ActivityConversationSection;
