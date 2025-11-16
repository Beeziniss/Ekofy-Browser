"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, User, FileText, MessageSquare, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useChangeRequestStatus } from "@/gql/client-mutation-options/request-hub-mutation-options";
import { listenerRequestByIdOptions } from "@/gql/options/listener-request-options";
import { artistDetailOptions } from "@/gql/options/client-options";
import { requestStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import { RequestStatus as GqlRequestStatus } from "@/gql/graphql";

interface RequestDetailSectionProps {
  requestId: string;
}

// Skeleton loader
function RequestDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RequestDetailSection({ requestId }: RequestDetailSectionProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { data: request, isLoading } = useQuery(listenerRequestByIdOptions(requestId));
  const changeStatusMutation = useChangeRequestStatus();

  // Fetch artist data if not included and artistId exists
  const { data: artistData } = useQuery({
    ...artistDetailOptions(request?.artistId || ""),
    enabled: !!request?.artistId && (!request?.artist || request.artist.length === 0),
  });

  // Use artist from request or fetched artist data
  const artist = request?.artist?.[0] || artistData?.artists?.items?.[0];
  
  // Get artist package (API returns as array)
  const artistPackage = request?.artistPackage?.[0] || null;

  const handleCancelRequest = async () => {
    if (!request) return;

    try {
      await changeStatusMutation.mutateAsync({
        requestId: requestId,
        status: GqlRequestStatus.Canceled,
      });

      toast.success("Your request has been canceled successfully.");

      setShowCancelDialog(false);
      // Redirect back to list after a short delay
      setTimeout(() => {
        window.location.href = "/profile/my-requests";
      }, 1000);
    } catch (error) {
      console.error("Failed to cancel request:", error);
      toast.error("Failed to cancel request. Please try again.");
    }
  };

  if (isLoading) {
    return <RequestDetailSkeleton />;
  }

  if (!request) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500">Failed to load request details. Please try again.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/profile/my-requests">Back to My Requests</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return "N/A";
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBudget = (budget?: { min: number; max: number } | null, currency?: string | null) => {
    if (!budget) return "N/A";
    const formatCurrency = (amount: number) => {
      return `${amount.toLocaleString()} ${currency?.toUpperCase() || "USD"}`;
    };

    if (budget.min === budget.max) {
      return formatCurrency(budget.min);
    }
    return `${formatCurrency(budget.min)} - ${formatCurrency(budget.max)}`;
  };

  if (isLoading) {
    return <RequestDetailSkeleton />;
  }

  if (!request) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500">Failed to load request details. Please try again.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/profile/my-requests">Back to My Requests</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      {/* Header with Back Button */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Request Details</h1>
        <Link
          href="/profile/my-requests"
          className="hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm font-normal transition hover:border-b"
        >
          &larr; Back to My Requests
        </Link>
      </div>

      <div className="space-y-6">
        {/* Main Card with all details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between space-y-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            
            <div className="flex-1">
              <CardTitle className="mb-2 text-2xl">
                {request.title || `Request for ${request.artist?.[0]?.stageName || "Service"}`}
              </CardTitle>
              <div className="flex items-center gap-2">
                {requestStatusBadge(request.status)}
              </div>
              </div>
            </div>
          </CardHeader>
        <CardContent className="space-y-6">
          {/* Artist Info & Key Information */}
         
          <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            {/* Artist Info */}
            {artist && (
              <div className="flex items-start gap-3 pb-4 border-b border-gray-700">
                <User className="mt-1 h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Sent to</p>
                  <Link
                    href={`/artist/${"userId" in artist && artist.userId ? artist.userId : request.artistId}`}
                    className="hover:text-main-purple text-lg font-semibold text-white transition-colors"
                  >
                    {artist.stageName}
                  </Link>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {/* Budget */}
              <div className="flex items-start gap-3">
                <DollarSign className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Budget</p>
                  <p className="text-lg font-semibold text-white">{formatBudget(request.budget, request.currency)}</p>
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Deadline</p>
                  <p className="text-lg font-semibold text-white">{formatDate(request.deadline)}</p>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-lg font-semibold text-white">
                    {formatDateTime(request.requestCreatedTime || request.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-start gap-3">
                <FileText className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Last Updated</p>
                  <p className="text-lg font-semibold text-white">{formatDateTime(request.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            <h3 className="text-lg font-semibold">
              Description
            </h3>
            {request.summary && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-400">Summary</h4>
                <p className="text-white">{request.summary}</p>
              </div>
            )}
            {request.detailDescription && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-400">Details</h4>
                <p className="whitespace-pre-wrap text-white">{request.detailDescription}</p>
              </div>
            )}
            {!request.summary && !request.detailDescription && (
              <p className="text-gray-400">No description provided</p>
            )}
          </div>

          {/* Package Information Section */}
          {artistPackage && (
            <div className="space-y-4 border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold">Package Chosen</h3>
              <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                {/* Package Name */}
                <div>
                  <p className="text-sm text-gray-400">Package Name</p>
                  <p className="text-lg font-semibold text-white">{artistPackage.packageName}</p>
                </div>

                {/* Package Details - Single Line */}
                <div className="grid gap-4 grid-cols-3">
                  {/* Package Amount */}
                  <div>
                    <p className="text-sm text-gray-400">Package Price</p>
                    <p className="text-lg font-semibold text-white">
                      {artistPackage.amount?.toLocaleString()} {artistPackage.currency?.toUpperCase() || "USD"}
                    </p>
                  </div>

                  {/* Estimated Delivery */}
                  <div>
                    <p className="text-sm text-gray-400">Estimated Delivery</p>
                    <p className="text-lg font-semibold text-white">
                      {artistPackage.estimateDeliveryDays} {artistPackage.estimateDeliveryDays === 1 ? "day" : "days"}
                    </p>
                  </div>

                  {/* Max Revisions */}
                  <div>
                    <p className="text-sm text-gray-400">Revisions Included</p>
                    <p className="text-lg font-semibold text-white">
                      {artistPackage.maxRevision === -1 
                        ? "Unlimited" 
                        : artistPackage.maxRevision}
                    </p>
                  </div>
                </div>

                {/* Package Description */}
                {artistPackage.description && (
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-sm text-gray-400 mb-2">Package Description</p>
                    <p className="whitespace-pre-wrap text-white">{artistPackage.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {request.status === "CONFIRMED" && (
          <Button className="primary_gradient text-white hover:opacity-65">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message Artist
          </Button>
        )}
        {request.status === "PENDING" && (
          <Button
            variant="destructive"
            onClick={() => setShowCancelDialog(true)}
            disabled={changeStatusMutation.isPending}
          >
            <XCircle className="mr-2 h-4 w-4" />
            {changeStatusMutation.isPending ? "Canceling..." : "Cancel Request"}
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/profile/my-requests">Back to My Requests</Link>
        </Button>
      </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Request?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this request? This action cannot be undone.
              The artist will be notified that you have canceled the request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Request</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelRequest}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
