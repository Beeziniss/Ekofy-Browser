"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { artistTransactionsOptions } from "@/gql/options/artist-activity-options";
import { listenerTransactionsOptions } from "@/gql/options/listener-activity-options";
import { methodBadge, paymentStatusBadge, transactionStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Source = "listener" | "artist";

interface SharedPaymentTransactionsTableProps {
  pageSize?: number;
  source: Source;
  linkPrefix: string; // e.g. "/profile/transaction-history" or "/artist/studio/transactions/payment-history"
  // Optional: external data control for filtering/searching
  externalData?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: Record<string, any>[];
    isLoading: boolean;
    isError: boolean;
    page: number;
    totalCount: number;
    onPageChange: (page: number) => void;
  };
}

export default function SharedPaymentTransactionsTable({
  pageSize = 10,
  source,
  linkPrefix,
  externalData,
}: SharedPaymentTransactionsTableProps) {
  const { user } = useAuthStore();
  const [internalPage, setInternalPage] = useState(1);

  const queryOptions =
    source === "listener"
      ? listenerTransactionsOptions({ userId: user?.userId || "", page: internalPage, pageSize })
      : artistTransactionsOptions({ userId: user?.userId || "", page: internalPage, pageSize });

  const { data, isLoading: internalLoading, isError: internalError } = useQuery({
    ...queryOptions,
    enabled: !!user?.userId && !externalData,
  });

  // Use external data if provided, otherwise use internal data
  const transactionData = externalData ? externalData.items : data?.paymentTransactions?.items || [];
  const totalCount = externalData 
    ? externalData.totalCount 
    : data?.paymentTransactions?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const isLoading = externalData ? externalData.isLoading : internalLoading;
  const isError = externalData ? externalData.isError : internalError;
  const page = externalData ? externalData.page : internalPage;
  const handlePageChange = externalData ? externalData.onPageChange : setInternalPage;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Transaction Status</TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                Loading transactions...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-red-400">
                Failed to load transactions. Please try again.
              </TableCell>
            </TableRow>
          ) : transactionData && transactionData.length > 0 ? (
            transactionData.map((transaction, idx) => (
              <TableRow key={transaction?.id ?? idx}>
                <TableCell>
                  {transaction?.createdAt ? new Date(transaction.createdAt as unknown as string).toLocaleString() : "-"}
                </TableCell>
                <TableCell>
                  {typeof transaction?.amount === "number" ? transaction.amount.toLocaleString() : transaction?.amount}{" "}
                  {transaction?.currency}
                </TableCell>
                <TableCell className="space-x-1">
                  {Array.isArray(transaction?.stripePaymentMethod) && transaction!.stripePaymentMethod.length > 0
                    ? transaction.stripePaymentMethod.map((method, index) => methodBadge(method, index))
                    : "-"}
                </TableCell>
                <TableCell>
                  {transaction?.paymentStatus ? paymentStatusBadge(transaction.paymentStatus) : "-"}
                </TableCell>
                <TableCell>
                  {transaction?.status ? transactionStatusBadge(transaction.status) : "-"}
                </TableCell>
                <TableCell>
                  {transaction?.id ? (
                    <Link href={`${linkPrefix}/${transaction?.id}`} className="text-primary hover:underline">
                      #{transaction?.id!.slice(-8)}
                    </Link>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {transaction?.id ? (
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" asChild>
                      <Link href={`${linkPrefix}/${transaction?.id}`}>View</Link>
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CustomPagination
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
