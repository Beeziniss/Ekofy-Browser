"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import { RequestsPublicQuery, RequestStatus } from "@/gql/graphql";
import { BlockRequestDialog } from "./block-request-dialog";
import { useBlockPublicRequest } from "@/gql/client-mutation-options/public-request-mutation-options";
import { formatDistanceToNow } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";

type RequestItem = NonNullable<NonNullable<RequestsPublicQuery["requests"]>["items"]>[0];

interface PublicRequestCardProps {
  request: RequestItem;
  onViewDetails?: (id: string) => void;
}

export function PublicRequestCard({ request, onViewDetails }: PublicRequestCardProps) {
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const blockRequestMutation = useBlockPublicRequest();

  // Format status display
  const formatStatus = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.Open:
        return "OPEN";
      case RequestStatus.Blocked:
        return "BLOCKED";
      default:
        return status;
    }
  };

  // Get status variant
  const getStatusVariant = (status: RequestStatus): "default" | "destructive" => {
    switch (status) {
      case RequestStatus.Open:
        return "default";
      case RequestStatus.Blocked:
        return "destructive";
      default:
        return "default";
    }
  };

  // Format budget
  const formatBudget = (budget: { min: number; max: number } | null | undefined, currency: string) => {
    if (!budget) return "N/A";

    const formatCurrency = (amount: number) => {
      switch (currency.toUpperCase()) {
        case "VND":
          return `${amount.toLocaleString()} VND`;
        case "USD":
          return `$${amount.toLocaleString()}`;
        case "EUR":
          return `€${amount.toLocaleString()}`;
        default:
          return `${amount.toLocaleString()} ${currency.toUpperCase()}`;
      }
    };

    if (budget.min === budget.max) {
      return formatCurrency(budget.min);
    }
    return `${formatCurrency(budget.min)} - ${formatCurrency(budget.max)}`;
  };

  const handleBlockClick = () => {
    setShowBlockDialog(true);
  };

  const handleConfirmBlock = async () => {
    await blockRequestMutation.mutateAsync(request.id);
    setShowBlockDialog(false);
  };

  return (
    <>
      <TableRow className="border-gray-800">
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-700 text-sm text-gray-300">
                {request.requestor?.[0]?.displayName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                {request.requestor?.[0]?.displayName || `User ${request.requestUserId.slice(-4)}`}
              </span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(request.postCreatedTime), { addSuffix: true })}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="max-w-md">
            <p className="line-clamp-1 font-medium text-white">{request.title}</p>
            <p className="line-clamp-1 text-sm text-gray-400">{request.summary}</p>
          </div>
        </TableCell>
        <TableCell>
          <span className="text-sm text-green-500">{formatBudget(request.budget ?? null, request.currency)}</span>
        </TableCell>
        <TableCell className="text-center">
          <span className="text-sm text-blue-500">{request.duration} days</span>
        </TableCell>
        <TableCell className="text-center">
          <Badge variant={getStatusVariant(request.status)} className="text-xs">
            {formatStatus(request.status)}
          </Badge>
        </TableCell>
        <TableCell className="text-center">
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(request.postCreatedTime), { addSuffix: true })}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails?.(request.id)}>
              <Eye className="mr-1 h-3.5 w-3.5" />
              View
            </Button>
            {request.status === RequestStatus.Open && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBlockClick}
                disabled={blockRequestMutation.isPending}
              >
                Block
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <BlockRequestDialog
        open={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        onConfirm={handleConfirmBlock}
        isLoading={blockRequestMutation.isPending}
        requestTitle={request.title || "this request"}
      />
    </>
  );
}
