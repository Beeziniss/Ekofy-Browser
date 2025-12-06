"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye} from "lucide-react";
import { formatNumber } from "@/utils/format-number";
import { activeInactiveStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import type { Subscription } from "@/types";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onView?: (subscription: Subscription) => void;
  isLoading?: boolean;
}

export function SubscriptionTable({
  subscriptions,
  onView,
  isLoading = false,
}: SubscriptionTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-gray-800">
            <TableHead className="text-gray-300">Name</TableHead>
            <TableHead className="text-gray-300">Code</TableHead>
            <TableHead className="text-gray-300">Tier</TableHead>
            <TableHead className="text-gray-300">Amount</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Created At</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                Loading subscriptions...
              </TableCell>
            </TableRow>
          ) : subscriptions.length > 0 ? (
            subscriptions.map((subscription) => (
              <TableRow key={subscription.id} className="border-gray-700 hover:bg-gray-800">
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold text-white">{subscription.name}</div>
                    <div className="text-gray-400 max-w-[200px] truncate text-sm">
                      {subscription.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="bg-gray-800 rounded px-2 py-1 text-sm text-gray-300">{subscription.code}</code>
                </TableCell>
                <TableCell>
                  <span className="border border-white rounded px-3 py-1 text-sm font-semibold bg-gray-800 text-white">
                    {subscription.tier}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-white">
                  {formatNumber(subscription.amount)} {subscription.currency}
                </TableCell>
                <TableCell>
                  {activeInactiveStatusBadge(subscription.status)}
                </TableCell>
                <TableCell className="text-gray-300">
                  {new Date(subscription.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-gray-700 bg-gray-800">
                      <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      {onView && (
                        <DropdownMenuItem 
                          onClick={() => onView(subscription)}
                          className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                No subscriptions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
