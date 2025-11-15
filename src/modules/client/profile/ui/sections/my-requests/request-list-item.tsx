"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, Calendar, Eye, User } from "lucide-react";
import { RequestsQuery } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { requestStatusBadge } from "@/modules/shared/ui/components/status/status-badges";

type RequestItem = NonNullable<NonNullable<RequestsQuery["requests"]>["items"]>[0];

interface RequestListItemProps {
  request: RequestItem;
  className?: string;
}

export function RequestListItem({ request, className }: RequestListItemProps) {
  const formatBudget = (budget: { min: number; max: number }, currency: string) => {
    const formatCurrency = (amount: number) => {
      return `${amount.toLocaleString()} ${currency.toUpperCase()}`;
    };

    if (budget.min === budget.max) {
      return formatCurrency(budget.min);
    }
    return `${formatCurrency(budget.min)} - ${formatCurrency(budget.max)}`;
  };

  const formatDateTime = (dateString: string | Date) => {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className={cn("w-full transition-shadow hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          {/* Left Section - Request Info */}
          <div className="flex-1 space-y-3">
            {/* Title and Status */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white">
                  {request.title}
                </h3>
                {requestStatusBadge(request.status)}
              </div>
            </div>

            {/* Summary or Detail Description */}
            <p className="line-clamp-2 text-sm text-gray-400">
              {request.summary || request.detailDescription || "No description provided"}
            </p>

            {/* Artist Info - Only show for direct requests with artist */}
            {request.artist && request.artist.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">
                  To:{" "}
                  <Link
                    href={`/artist/${request.artist[0].id}`}
                    className="hover:text-main-purple font-medium text-white transition-colors"
                  >
                    {request.artist[0].stageName}
                  </Link>
                </span>
              </div>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-white">Budget: {formatBudget(request.budget, request.currency)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Deadline: {formatDate(request.deadline)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {request.requestCreatedTime ? formatDateTime(request.requestCreatedTime) : formatDateTime(request.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex gap-2 md:flex-col md:items-end">
            <Button variant="outline" size="sm" asChild className="flex-1 md:flex-none">
              <Link href={`/profile/my-requests/${request.id}`}>
                <Eye className="mr-1 h-4 w-4" />
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
