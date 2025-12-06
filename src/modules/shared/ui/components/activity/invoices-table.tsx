"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { listenerInvoicesOptions } from "@/gql/options/listener-activity-options";
import { artistInvoicesOptions } from "@/gql/options/artist-activity-options";
import { useAuthStore } from "@/store";

type Source = "listener" | "artist";

interface SharedInvoicesTableProps {
  pageSize?: number;
  source: Source;
  invoiceLinkPrefix: string; // e.g. /profile/invoices or /artist/studio/profile/invoices
  txLinkPrefix?: string; // defaults based on source if not provided
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

export default function SharedInvoicesTable({
  pageSize = 10,
  source,
  invoiceLinkPrefix,
  txLinkPrefix,
  externalData,
}: SharedInvoicesTableProps) {
  const { user } = useAuthStore();
  const [internalPage, setInternalPage] = useState(1);

  const {
    data: listenerData,
    isPending: isListenerPending,
    isError: isListenerError,
  } = useQuery({
    ...listenerInvoicesOptions({ userId: user?.userId || "", page: internalPage, pageSize }),
    enabled: source === "listener" && !!user?.userId && !externalData,
  });

  const {
    data: artistData,
    isPending: isArtistPending,
    isError: isArtistError,
  } = useQuery({
    ...artistInvoicesOptions({ userId: user?.userId || "", page: internalPage, pageSize }),
    enabled: source === "artist" && !!user?.userId && !externalData,
  });

  // Use external data if provided, otherwise use internal data
  const items = externalData
    ? externalData.items
    : listenerData?.invoices?.items || artistData?.invoices?.items || [];
  const totalCount = externalData
    ? externalData.totalCount
    : listenerData?.invoices?.totalCount ?? artistData?.invoices?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const isLoading = externalData
    ? externalData.isLoading
    : source === "listener"
      ? isListenerPending
      : isArtistPending;
  const isError = externalData
    ? externalData.isError
    : source === "listener"
      ? isListenerError
      : isArtistError;

  const page = externalData ? externalData.page : internalPage;
  const handlePageChange = externalData ? externalData.onPageChange : setInternalPage;

  const resolvedTxLinkPrefix =
    txLinkPrefix ??
    (source === "listener" ? "/profile/payment-history" : "/artist/studio/transactions/payment-history");

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-gray-800">
            <TableHead className="text-gray-300">Date</TableHead>
            <TableHead className="text-gray-300">Amount</TableHead>
            <TableHead className="text-gray-300">To</TableHead>
            <TableHead className="text-gray-300">From</TableHead>
            <TableHead className="text-gray-300">Invoice ID</TableHead>
            <TableHead className="text-gray-300">Transaction ID</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                Loading invoices...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-red-400">
                Failed to load invoices. Please try again.
              </TableCell>
            </TableRow>
          ) : items && items.length > 0 ? (
            items.map((inv, idx) => (
              <TableRow key={inv?.id ?? idx} className="border-gray-700 hover:bg-gray-800">
                <TableCell className="whitespace-nowrap text-gray-300">
                  {inv?.paidAt
                    ? new Date(inv.paidAt as unknown as string).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "-"}
                </TableCell>
                <TableCell className="font-medium text-white">
                  {typeof inv?.amount === "number" ? inv.amount.toLocaleString() : inv?.amount}{" "}
                  {inv?.currency || "VND"}
                </TableCell>
                <TableCell className="text-gray-300">{inv?.to || inv?.email || "-"}</TableCell>
                <TableCell className="text-gray-300">{inv?.from || "-"}</TableCell>
                <TableCell className="font-mono text-xs text-gray-400">
                  {inv?.id ? (
                    <Link
                      href={`${invoiceLinkPrefix}/${inv.id}`}
                      className="text-primary hover:text-primary/80"
                    >
                      <span className="max-w-[120px] inline-block truncate">
                        {inv.id.slice(0, 20)}...
                      </span>
                    </Link>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-400">
                  {inv?.paymentTransactionId ? (
                    <Link
                      href={`${resolvedTxLinkPrefix}/${inv.paymentTransactionId}`}
                      className="text-primary hover:text-primary/80"
                    >
                      <span className="max-w-[120px] inline-block truncate">
                        {inv.paymentTransactionId.slice(0, 20)}...
                      </span>
                    </Link>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" asChild>
                    <Link href={`${invoiceLinkPrefix}/${inv.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                No invoices found.
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
