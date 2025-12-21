"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye} from "lucide-react";
import { activeInactiveStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import type { Subscription } from "@/types";
import { formatCurrencyVND } from "@/utils/format-currency";

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

  function getTierColor(tier: string) {
    switch (tier.toLowerCase()) {
      case "free":
        return "bg-secondary text-muted-foreground border-border";
      case "pro":
        return "text-white border-transparent shadow-md";
      case "premium":
        return "text-white border-transparent shadow-lg";
      default:
        return "bg-gray-800 border-white text-white";
    }
  }

  function getTierStyle(tier: string): React.CSSProperties {
    switch (tier.toLowerCase()) {
      case "pro":
        return {
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)",
        };
      case "premium":
        return {
          background: "linear-gradient(135deg, #f59e0b, #ec4899)",
          boxShadow: "0 2px 12px rgba(245, 158, 11, 0.5)",
        };
      default:
        return {};
    }
  }

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
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${getTierColor(subscription.tier)}`}
                    style={getTierStyle(subscription.tier)}
                  >
                    {subscription.tier}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-white">
                  {formatCurrencyVND(subscription.amount)} {subscription.currency.toUpperCase()}
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
                  {onView && (
                    <Button 
                      onClick={() => onView(subscription)}
                      variant="ghost"
                      className="text-gray-300 hover:text-white cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
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
