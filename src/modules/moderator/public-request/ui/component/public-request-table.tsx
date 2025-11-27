"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Lock, MoreVertical } from "lucide-react";
import { RequestsPublicQuery, RequestStatus } from "@/gql/graphql";
import { BlockRequestDialog } from "./block-request-dialog";
import { useBlockPublicRequest } from "@/gql/client-mutation-options/public-request-mutation-options";
import { formatDistanceToNow } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type RequestItem = NonNullable<NonNullable<RequestsPublicQuery["requests"]>["items"]>[0];

interface PublicRequestCardProps {
  request: RequestItem;
  onViewDetails?: (id: string) => void;
}

export function PublicRequestCard({ request, onViewDetails }: PublicRequestCardProps) {
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const blockRequestMutation = useBlockPublicRequest();

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
              <span className="text-sm font-medium text-main-white">
                {request.requestor?.[0]?.displayName || `User ${request.requestUserId.slice(-4)}`}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div>
            <p className="line-clamp-1 font-medium text-main-white">{request.title}</p>
          </div>
        </TableCell>
        <TableCell>
          <span className="text-sm text-main-white">{formatBudget(request.budget ?? null, request.currency)}</span>
        </TableCell>
        <TableCell className="text-center">
          <span className="text-sm text-main-white">{request.duration} days</span>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {request.status === RequestStatus.Open ? (
                <DropdownMenuItem onClick={() => onViewDetails?.(request.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
              ) : null}

              {request.status === RequestStatus.Open && (
                <DropdownMenuItem
                  onClick={handleBlockClick}
                  disabled={blockRequestMutation.isPending}
                  className="text-red-500"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Block
                </DropdownMenuItem>
              )}

              {request.status !== RequestStatus.Open && (
                <div className="text-sm text-main-white px-4 py-2">
                  No actions available
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
