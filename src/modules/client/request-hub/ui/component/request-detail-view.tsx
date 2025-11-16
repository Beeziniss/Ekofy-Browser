"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  //   Bookmark,
  DollarSign,
  Clock,
  Calendar,
  MessageCircle,
  Send,
} from "lucide-react";
import { RequestsQuery } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { useAuthDialog } from "../context/auth-dialog-context";
import { useStripeAccountStatus } from "@/hooks/use-stripe-account-status";
import RequestHubCommentSection from "./comment-section";
import { StripeAccountRequiredModal } from "@/modules/shared/ui/components/stripe-account-required-modal";

type RequestItem = NonNullable<NonNullable<RequestsQuery["requests"]>["items"]>[0];

interface RequestDetailViewProps {
  request: RequestItem;
  onBack: () => void;
  onApply: () => void;
  onContactClient: () => void;
  className?: string;
}

export function RequestDetailView({ request, onBack, onApply, onContactClient, className }: RequestDetailViewProps) {
  const [showStripeModal, setShowStripeModal] = useState(false);
  // Get auth state and dialog
  const { isAuthenticated } = useAuthStore();
  const { showAuthDialog } = useAuthDialog();

  // Get Stripe account status
  const { isArtist, hasStripeAccount } = useStripeAccountStatus();

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
  const formatDeadline = (deadline: string | Date) => {
    const date = typeof deadline === "string" ? new Date(deadline) : deadline;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
      onApply();
    }
  };

  const handleContactClient = () => {
    if (!isAuthenticated) {
      showAuthDialog("contact", request.title || "Untitled Request");
      return;
    }

    // Check if user is artist and has stripe account for contact
    if (isArtist && !hasStripeAccount) {
      setShowStripeModal(true);
      return;
    }

    // Only allow artists to contact client
    if (isArtist) {
      onContactClient();
    }
  };

  return (
    <div className={cn("min-h-screen", className)}>
      {/* Header */}
      <div className="px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="transition-smooth flex items-center gap-2 text-white hover:opacity-75"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Title and Bookmark */}
            <div className="flex items-start justify-between">
              <h1 className="mr-4 flex-1 text-2xl font-bold text-white">{request.title}</h1>
            </div>

            {/* Author and Post Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {request.requestor?.[0]?.displayName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">
                  {request.requestor?.[0]?.displayName || `User ${request.requestUserId.slice(-4)}`}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Posted {formatTimeAgo(request.postCreatedTime)}</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <Card>
              <CardContent className="px-6 py-0">
                <h2 className="mb-4 text-lg font-semibold">Summary</h2>
                <p className="mb-4 leading-relaxed text-white">{request.summary}</p>
              </CardContent>
            </Card>

            {/* Detail Description */}
            <Card>
              <CardContent className="px-6 py-0">
                <h2 className="mb-4 text-lg font-semibold">Detailed Description</h2>
                <div
                  className="prose prose-invert max-w-none leading-relaxed text-white"
                  dangerouslySetInnerHTML={{ __html: request.detailDescription || "" }}
                />
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardContent className="px-6 py-0">
                <h2 className="mb-4 text-lg font-semibold">Request Status</h2>
                <Badge variant={getStatusVariant(request.status)} className="px-3 py-1 text-sm">
                  {formatStatus(request.status)}
                </Badge>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <div className="mt-8">
              <RequestHubCommentSection requestId={request.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-20">
              {/* Budget */}
              <Card>
                <CardContent className="px-6 py-0">
                  <div className="mb-2 flex items-center text-gray-500">
                    <DollarSign className="mr-1 h-4 w-4" />
                    <span className="text-sm">Budget</span>
                  </div>
                  <p className="mb-4 text-2xl font-bold text-purple-600">
                    {formatBudget(request!.budget!, request.currency)}
                  </p>

                  <div className="mb-6 space-y-3">
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Deadline</span>
                      <span className="ml-auto font-medium">{formatDeadline(request.deadline)}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Posted</span>
                      <span className="ml-auto font-medium">{formatTimeAgo(request.postCreatedTime)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-purple-600 text-white hover:bg-purple-700" onClick={handleApply}>
                      <Send className="mr-2 h-4 w-4" />
                      Apply Now
                    </Button>

                    <Button variant="outline" className="w-full" onClick={handleContactClient}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Client
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Account Required Modal */}
      <StripeAccountRequiredModal
        open={showStripeModal}
        onOpenChange={setShowStripeModal}
        onCancel={() => setShowStripeModal(false)}
      />
    </div>
  );
}
