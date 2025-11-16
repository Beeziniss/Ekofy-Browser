"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Clock, Send, ChevronDown, ChevronUp, SquarePen } from "lucide-react";
import { RequestsQuery } from "@/gql/graphql";
import { requestHubCommentsOptions } from "@/gql/options/client-options";
import { RequestHubCommentSection, StripeAccountRequiredModal } from "./";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { useAuthDialog } from "../context/auth-dialog-context";
import { useStripeAccountStatus } from "@/hooks/use-stripe-account-status";

type RequestItem = NonNullable<NonNullable<RequestsQuery["requests"]>["items"]>[0];

interface RequestCardProps {
  request: RequestItem;
  onViewDetails?: (id: string) => void;
  onApply?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
  onSave?: (id: string) => void;
  isOwner?: boolean;
}

export function RequestCard({ request, onViewDetails, onApply, onEdit, className, isOwner = false }: RequestCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);

  // Get auth state and dialog
  const { isAuthenticated } = useAuthStore();
  const { showAuthDialog } = useAuthDialog();

  // Get Stripe account status
  const { isArtist, hasStripeAccount } = useStripeAccountStatus();

  // Fetch comment count for this request
  const { data: commentsData } = useQuery(requestHubCommentsOptions(request.id));

  // Calculate total comment count (including replies)
  const getTotalCommentCount = () => {
    if (!commentsData?.threadedComments) return 0;

    const threads = commentsData.threadedComments.threads || [];
    return threads.reduce((total, thread) => {
      // Count root comment + all replies
      return total + 1 + (thread.totalReplies || 0);
    }, 0);
  };

  const totalComments = getTotalCommentCount();

  // Format status from GraphQL enum to display text
  const formatStatus = (status: string) => {
    switch (status) {
      case "Open":
        return "Open";
      case "Closed":
        return "Closed";
      case "Blocked":
        return "Blocked";
      case "Deleted":
        return "Deleted";
      default:
        return status;
    }
  };

  // Get status color variant
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Open":
        return "default";
      case "Closed":
        return "secondary";
      case "Blocked":
        return "destructive";
      case "Deleted":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleToggleComments = () => {
    // Anyone can view comments, no auth required
    setShowComments(!showComments);
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      showAuthDialog("apply", request.title || "Untitled Request");
      return;
    }

    // Check if user is artist and has stripe account
    if (isArtist && !hasStripeAccount) {
      setShowStripeModal(true);
      return;
    }

    // Only allow artists to apply
    if (isArtist) {
      onApply?.(request.id);
    }
  };

  const handleEdit = () => {
    if (!isAuthenticated) {
      showAuthDialog("edit", request.title || "Untitled Request");
      return;
    }
    onEdit?.(request.id);
  };
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      const hours = diffHours;
      const minutes = diffMinutes % 60;
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      const days = diffDays;
      const hours = diffHours % 24;
      return `${days} day${days > 1 ? "s" : ""} ${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
  };

  const formatBudget = (budget: { min: number; max: number }, currency: string) => {
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

  const formatDeadline = (deadline: string | Date) => {
    const date = typeof deadline === "string" ? new Date(deadline) : deadline;
    return date.toLocaleDateString();
  };

  return (
    <Card className={cn("w-full transition-shadow hover:shadow-md", className)}>
      <CardContent className="px-6 py-0">
        {/* Header with Avatar and Save Button */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gray-200 text-gray-600">
                {request.requestor?.[0]?.displayName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-white">
                {request.requestor?.[0]?.displayName || `User ${request.requestUserId.slice(-4)}`}
              </h4>
              <p className="text-sm text-white">{formatTimeAgo(request.postCreatedTime)}</p>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          className="mb-3 line-clamp-2 cursor-pointer text-lg font-semibold text-white hover:text-gray-300"
          onClick={() => onViewDetails?.(request.id)}
        >
          {request.title}
        </h3>

        {/* Summary */}
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-white">{request.summary}</p>

        {/* Status Badge */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant={getStatusVariant(request.status)} className="text-xs">
            {formatStatus(request.status)}
          </Badge>
        </div>

        {/* Budget and Deadline */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <p className="mr-1 text-white">Budget:</p>
            <p className="text-main-purple font-medium">{formatBudget(request!.budget!, request.currency)}</p>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-white" />
            <p className="mr-1 text-white">Deadline:</p>
            <p className="text-main-purple font-medium">{formatDeadline(request.deadline)}</p>
          </div>
        </div>
        {/* Footer with Action Buttons */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleComments}
            className="hover:text-primary flex items-center p-0 text-sm text-gray-500"
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            View Comments {totalComments > 0 && `(${totalComments})`}
            {showComments ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails?.(request.id)} className="text-sm">
              View Details
            </Button>
            {isOwner && onEdit ? (
              <Button size="sm" onClick={handleEdit} className="primary_gradient text-sm text-white hover:opacity-65">
                <SquarePen className="mr-1 h-3 w-3" />
                Edit
              </Button>
            ) : (
              <Button size="sm" onClick={handleApply} className="primary_gradient text-sm text-white hover:opacity-65">
                <Send className="mr-1 h-3 w-3" />
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 px-6">
          <RequestHubCommentSection requestId={request.id} />
        </div>
      )}

      {/* Stripe Account Required Modal */}
      <StripeAccountRequiredModal
        open={showStripeModal}
        onOpenChange={setShowStripeModal}
        onCancel={() => setShowStripeModal(false)}
      />
    </Card>
  );
}
