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
  SquarePen,
  Flag,
  Trash2,
} from "lucide-react";
import { RequestsQuery, RequestStatus } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { useAuthDialog } from "../context/auth-dialog-context";
import { useStripeAccountStatus } from "@/hooks/use-stripe-account-status";
import RequestHubCommentSection from "../section/comment-section";
import { StripeAccountRequiredModal } from "@/modules/shared/ui/components/stripe-account-required-modal";
import { ReportDialog } from "@/modules/shared/ui/components/report-dialog";
import { ReportRelatedContentType } from "@/gql/graphql";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { useMutation } from "@tanstack/react-query";
import { addConversationFromRequestHubMutationOptions } from "@/gql/options/client-mutation-options";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

type RequestItem = NonNullable<NonNullable<RequestsQuery["requests"]>["items"]>[0];

interface RequestDetailViewProps {
  request: RequestItem;
  onBack: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function RequestDetailView({ request, onBack, onEdit, onDelete, className }: RequestDetailViewProps) {
  const router = useRouter();
  const { showAuthDialog } = useAuthDialog();
  const { isAuthenticated, user } = useAuthStore();
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { isArtist, hasStripeAccount } = useStripeAccountStatus();

  const { mutateAsync: addConversation } = useMutation(addConversationFromRequestHubMutationOptions);

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

  const handleEdit = () => {
    if (!isAuthenticated) {
      showAuthDialog("edit", request.title || "Untitled Request");
      return;
    }
    onEdit?.(request.id);
  };

  const handleContactClient = async () => {
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
      const conversationId = await addConversation({ requestId: request.id, otherUserId: request.requestUserId });

      router.push(`/inbox/${conversationId.addConversationFromRequestHub}`);
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
                  <span>Posted {formatDistanceToNow(new Date(request.postCreatedTime), { addSuffix: true })}</span>
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
                <h2 className="mb-4 text-lg font-semibold">Detail Description</h2>
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
                      <span className="text-gray-500">Duration</span>
                      <span className="ml-auto font-medium">{request.duration} (days)</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Posted</span>
                      <span className="ml-auto font-medium">{formatDistanceToNow(new Date(request.postCreatedTime), { addSuffix: true })}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Show Edit button if user is the owner */}
                    {user?.userId === request.requestUserId && onEdit && request.status === RequestStatus.Open && (
                      <Button variant="ekofy" className="w-full text-white hover:opacity-90" onClick={handleEdit}>
                        <SquarePen className="mr-2 h-4 w-4" />
                        Edit Request
                      </Button>
                    )}

                    {/* Show Delete button if user is the owner */}
                    {user?.userId === request.requestUserId && onDelete && request.status === RequestStatus.Open && (
                      <Button variant="destructive" className="w-full" onClick={() => setDeleteDialogOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Request
                      </Button>
                    )}

                    {/* Show Contact Client button only for Artists */}
                    {isArtist && user?.userId !== request.requestUserId && (
                      <Button variant="ekofy" className="w-full" onClick={handleContactClient}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Contact Client
                      </Button>
                    )}

                    {isAuthenticated && user?.userId !== request.requestUserId && (
                      <Button variant="outline" className="w-full" onClick={() => setReportDialogOpen(true)}>
                        <Flag className="mr-2 h-4 w-4" />
                        Report
                      </Button>
                    )}
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

      {/* Report Dialog */}
      {request.requestUserId && (
        <ReportDialog
          contentType={ReportRelatedContentType.Request}
          contentId={request.id}
          reportedUserId={request.requestUserId}
          reportedUserName={request.title || ""}
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
        />
      )}

      {/* Delete Confirm Dialog */}
      <DeleteConfirmModal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete?.(request.id);
          setDeleteDialogOpen(false);
        }}
      />
    </div>
  );
}
