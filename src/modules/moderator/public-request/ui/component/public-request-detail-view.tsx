"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Lock} from "lucide-react";
import { RequestPublicDetailByIdQuery, RequestStatus } from "@/gql/graphql";
import { BlockRequestDialog } from "./block-request-dialog";
import { useBlockPublicRequest } from "@/gql/client-mutation-options/public-request-mutation-options";

type RequestItem = NonNullable<RequestPublicDetailByIdQuery["requestDetailById"]>;

interface PublicRequestDetailViewProps {
  request: RequestItem;
  onBack?: () => void;
}

export function PublicRequestDetailView({ request, onBack }: PublicRequestDetailViewProps) {
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const blockRequestMutation = useBlockPublicRequest();

  // Format status display
  const formatStatus = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.Open:
        return "OPEN";
      case RequestStatus.Blocked:
        return "BLOCKED";
      case RequestStatus.Closed:
        return "CLOSED";
      case RequestStatus.Deleted:
        return "DELETED";
      default:
        return status;
    }
  };

  // Get status variant
  const getStatusVariant = (status: RequestStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case RequestStatus.Open:
        return "default";
      case RequestStatus.Blocked:
        return "destructive";
      case RequestStatus.Closed:
        return "secondary";
      case RequestStatus.Deleted:
        return "outline";
      default:
        return "secondary";
    }
  };

  // Format budget
  const formatBudget = (budget: { min: number; max: number } | null, currency: string) => {
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBlockRequest = () => {
    setShowBlockDialog(true);
  };

  const handleConfirmBlock = async () => {
    await blockRequestMutation.mutateAsync(request.id);
    setShowBlockDialog(false);
  };

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-6 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          )}
          <div className="flex items-center gap-3">
            {request.status === RequestStatus.Open && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBlockRequest}
                disabled={blockRequestMutation.isPending}

              >
                <Lock className="mr-2 h-4 w-4" />
                Block Request
              </Button>
            )}
          </div>
        </div>

        {/* Request Information Card */}
        <Card>
            <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
              <CardTitle className="mb-3 text-2xl text-white flex items-center justify-between">
                {request.title}
                <Badge variant={getStatusVariant(request.status)} className="ml-4 text-sm">
                  Status: {formatStatus(request.status)}
                </Badge>
              </CardTitle>
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {request.requestor?.[0]?.displayName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
                </Avatar>
                <div>
                <p className="font-medium text-white">
                  {request.requestor?.[0]?.displayName || `User ${request.requestUserId.slice(-4)}`}
                </p>
                <p className="text-sm text-gray-400">Requestor</p>
                </div>
              </div>
              </div>
            </div>
            </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div>
              <h3 className="mb-2 flex items-center text-sm font-semibold text-gray-400">
                Summary
              </h3>
              <p className="text-base leading-relaxed text-gray-200">{request.summary}</p>
            </div>

            <Separator className="bg-gray-700" />

            <div>
              <h3 className="mb-2 flex items-center text-sm font-semibold text-gray-400">
                Detail Description
              </h3>
              <p className="text-base leading-relaxed text-gray-200">{request.detailDescription}</p>
            </div>
            <Separator className="bg-gray-700" />

            {/* Budget and Duration */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 flex items-center text-sm font-semibold text-gray-400">
                  Budget
                </h3>
                <p className="text-lg font-medium text-white">{formatBudget(request.budget ?? null, request.currency)}</p>
              </div>
              <div>
                <h3 className="mb-2 flex items-center text-sm font-semibold text-gray-400">
                  Duration
                </h3>
                <p className="text-lg font-medium text-white">{request.duration} days</p>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Timestamps */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 flex items-center text-sm font-semibold text-gray-400">
                  Created Date
                </h3>
                <p className="text-base text-gray-200">{formatDate(request.postCreatedTime)}</p>
              </div>
              <div>
                <h3 className="mb-2 flex items-center text-sm font-semibold text-gray-400">
                  Last Updated
                </h3>
                <p className="text-base text-gray-200">
                  {request.updatedAt ? formatDate(request.updatedAt) : "No provider"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Block Confirmation Dialog */}
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
