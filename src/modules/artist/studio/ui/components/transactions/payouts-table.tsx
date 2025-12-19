"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useArtistPayouts } from "@/modules/artist/studio/hooks/use-artist-payouts";
import { platformFeeByPayoutIdOptions } from "@/gql/options/artist-activity-options";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PayoutTransactionStatus } from "@/gql/graphql";
import { payoutStatusBadge } from "@/modules/shared/ui/components/status/status-badges";

interface PayoutsTableProps {
  userId: string;
  pageSize?: number;
  typeFilter?: string;
  onTypeFilterChange?: (value: string) => void;
}

const statusBadge = payoutStatusBadge;

// Component to fetch and display platform fee
function PlatformFeeCell({ payoutId }: { payoutId: string }) {
  const { data, isLoading } = useQuery({
    ...platformFeeByPayoutIdOptions({ payoutTransactionId: payoutId }),
  });
  
  if (isLoading) return <span className="text-gray-400">...</span>;
  
  const platformFee = data?.packageOrders?.items?.[0]?.platformFeePercentage;
  
  if (platformFee !== undefined && platformFee !== null) {
    return <span>{platformFee}%</span>;
  }
  
  return <span className="text-gray-400">-</span>;
}

// Component to display payout type (receives platformFee as prop to avoid duplicate queries)
function PayoutTypeCell({ platformFee, isLoading }: { platformFee?: number | null; isLoading?: boolean }) {
  if (isLoading) return <span className="text-gray-400">...</span>;
  
  if (platformFee !== undefined && platformFee !== null) {
    return <Badge variant="ekofy">Service</Badge>;
  }
  
  return <Badge variant="secondary">Escrow Release</Badge>;
}

export default function PayoutsTable({ userId, pageSize = 10, typeFilter = "all", onTypeFilterChange }: PayoutsTableProps) {
  const [page, setPage] = useState(1);
  const visibleRowsRef = useRef<Set<string>>(new Set());
  const [hasVisibleRows, setHasVisibleRows] = useState(false);

  const { data, isLoading, isError } = useArtistPayouts({ userId, page, pageSize });

  const items = data?.payoutTransactions?.items ?? [];
  const totalCount = data?.payoutTransactions?.totalCount ?? 0;
  const hasNext = !!data?.payoutTransactions?.pageInfo?.hasNextPage;
  const hasPrev = !!data?.payoutTransactions?.pageInfo?.hasPreviousPage;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Reset visible rows when items or filter changes
  useEffect(() => {
    visibleRowsRef.current = new Set();
    setHasVisibleRows(false);
  }, [items, typeFilter]);

  // Memoize the callback to prevent infinite loops
  const handleVisibilityChange = useCallback((payoutId: string, visible: boolean) => {
    if (visible) {
      visibleRowsRef.current.add(payoutId);
    } else {
      visibleRowsRef.current.delete(payoutId);
    }
    // Only update state if it changes to prevent unnecessary re-renders
    const newHasVisible = visibleRowsRef.current.size > 0;
    setHasVisibleRows(prev => {
      if (prev !== newHasVisible) {
        return newHasVisible;
      }
      return prev;
    });
  }, []);

  return (
    <div className="space-y-4">
      {onTypeFilterChange && (
        <div className="flex items-center gap-4">
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="escrow">Escrow Release</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Platform Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payout</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8}>Loading...</TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-red-500">Failed to load payouts.</TableCell>
              </TableRow>
            ) : items && items.length > 0 ? (
              <>
                {items.map((tx, idx) => (
                  <PayoutRow 
                    key={tx?.id ?? idx} 
                    tx={tx} 
                    typeFilter={typeFilter}
                    onVisibilityChange={handleVisibilityChange}
                  />
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={8}>No payouts found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!hasPrev}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => (hasNext ? p + 1 : p))} disabled={!hasNext}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// Separate component for payout row to handle type filtering
function PayoutRow({ tx, typeFilter, onVisibilityChange }: { tx: any; typeFilter: string; onVisibilityChange?: (payoutId: string, visible: boolean) => void }) {
  const { data: platformFeeData, isLoading: isLoadingType } = useQuery({
    ...platformFeeByPayoutIdOptions({ payoutTransactionId: tx?.id || "" }),
    enabled: !!tx?.id,
  });
  
  const platformFee = platformFeeData?.packageOrders?.items?.[0]?.platformFeePercentage;
  const payoutType = platformFee !== undefined && platformFee !== null ? "service" : "escrow";
  const isVisible = typeFilter === "all" || typeFilter === payoutType;
  const prevVisibleRef = useRef<boolean | null>(null);
  
  // Notify parent about visibility only when it changes
  useEffect(() => {
    if (!isLoadingType && tx?.id) {
      // Only call if visibility actually changed
      if (prevVisibleRef.current !== isVisible) {
        prevVisibleRef.current = isVisible;
        onVisibilityChange?.(tx.id, isVisible);
      }
    }
  }, [isLoadingType, isVisible, tx?.id, onVisibilityChange]);
  
  // Filter by type - return null if doesn't match filter (but only after loading)
  if (!isLoadingType && typeFilter !== "all" && typeFilter !== payoutType) {
    return null;
  }
  
  return (
    <TableRow>
      <TableCell>
        {tx?.createdAt ? new Date(tx.createdAt as unknown as string).toLocaleString() : "-"}
      </TableCell>
      <TableCell>
        {typeof tx?.amount === "number" ? tx.amount.toLocaleString() : tx?.amount} {tx?.currency}
      </TableCell>
      <TableCell>
        <PayoutTypeCell platformFee={platformFee} isLoading={isLoadingType} />
      </TableCell>
      <TableCell>{tx?.method || "-"}</TableCell>
      <TableCell>
        {tx?.id ? <PlatformFeeCell payoutId={tx.id} /> : "-"}
      </TableCell>
      <TableCell>{tx?.status ? statusBadge(tx.status as PayoutTransactionStatus) : "-"}</TableCell>
      <TableCell>
        {tx?.stripeTransferId || tx?.stripePayoutId || tx?.id ? (
          <Link href={`/artist/studio/transactions/payouts/${tx?.stripeTransferId || tx?.stripePayoutId || tx?.id}`} className="text-primary hover:underline">
            #{(tx?.stripeTransferId || tx?.stripePayoutId || tx?.id)!.slice(-8)}
          </Link>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        {tx?.id ? (
          <Link href={`/artist/studio/transactions/payouts/${tx.id}`} className="text-primary hover:underline">View</Link>
        ) : (
          "-"
        )}
      </TableCell>
    </TableRow>
  );
}
