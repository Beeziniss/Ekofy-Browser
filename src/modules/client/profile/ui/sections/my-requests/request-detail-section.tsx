"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, MessageSquare, XCircle, ArrowLeftIcon, Package, MessageCircle } from "lucide-react";
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
import { requestOptions } from "@/gql/options/listener-request-options";
import { moderatorPackageOrderDetailOptions } from "@/gql/options/moderator-options";
import { requestStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import {
  RequestStatus as GqlRequestStatus,
  RequestArtistFragmentDoc,
  RequestArtistPackageFragmentDoc,
} from "@/gql/graphql";
import { useFragment } from "@/gql";

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
  const { data: request, isLoading } = useQuery(requestOptions(requestId));
  const changeStatusMutation = useChangeRequestStatus();

  // Fetch order details including conversationId when orderId exists
  const { data: orderData } = useQuery(moderatorPackageOrderDetailOptions(request?.orderId || ""));

  // Fetch artist data if not included and artistId exists
  /* const { data: artistData } = useQuery({
    ...artistDetailOptions(request?.artistId || ""),
    enabled: !!request?.artistId && (!request?.artist || request.artist.length === 0),
  }); */

  // Use artist from request or fetched artist data
  // const artist = request?.artist?.[0] || artistData?.artists?.items?.[0];
  const artist = useFragment(RequestArtistFragmentDoc, request?.artist);

  // Get artist package (API returns as array)
  const artistPackage = useFragment(RequestArtistPackageFragmentDoc, request?.artistPackage);

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

  /* const formatBudget = (budget?: { min: number; max: number } | null, currency?: string | null) => {
    if (!budget) return "N/A";
    const formatCurrency = (amount: number) => {
      return `${amount.toLocaleString()} ${currency?.toUpperCase() || "USD"}`;
    };

    if (budget.min === budget.max) {
      return formatCurrency(budget.min);
    }
    return `${formatCurrency(budget.min)} - ${formatCurrency(budget.max)}`;
  }; */

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
      {/* Header with Back Button and Action Buttons */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Request Details</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/profile/my-requests"
            className="hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm font-normal transition hover:border-b"
          >
            <ArrowLeftIcon className="w-4" /> Back to My Requests
          </Link>
        </div>
      </div>
      <div className="space-y-6">
        {/* Main Card with all details */}
        <Card>
            <CardHeader>
            {/* Buttons Row - Left aligned */}
            <div className="flex items-center gap-2 mb-4">
              {/* View Order Button - Only show when orderId exists */}
              {request?.orderId && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/orders/${request.orderId}/details`}>
                <Package className="mr-2 h-4 w-4" />
                View Order
                </Link>
              </Button>
              )}

              {/* View Conversation Button - Only show when conversationId exists */}
              {orderData?.conversationId && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/conversation/${orderData.conversationId}`}>
                <MessageCircle className="mr-2 h-4 w-4" />
                View Conversation
                </Link>
              </Button>
              )}
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
            </div>
            <div className="flex items-start justify-between space-y-4 rounded-lg border p-4">
              <div className="flex-1">
              <CardTitle className="mb-2 text-2xl">
                {request.title || `Request for ${artist?.[0].stageName || "Service"}`} - {request.type}
              </CardTitle>
              <div className="flex items-center gap-2">{requestStatusBadge(request.status)}</div>
              </div>
            </div>
            </CardHeader>
          <CardContent className="space-y-6">
            {/* Artist Info & Key Information */}

            <div className="space-y-4 rounded-lg border p-4">
              {/* Artist Info */}
              {artist && (
                <div className="flex items-start gap-3 border-b border-gray-700 pb-4">
                  <User className="mt-1 h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Sent to</p>
                    <Link
                      href={`/artists/${"userId" in artist && artist.userId ? artist.userId : request.artistId}`}
                      className="hover:text-main-purple text-lg font-semibold text-white transition-colors"
                    >
                      {artist?.[0]?.stageName || "Unknown Artist"}
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {/* Budget */}
                {/* <div className="flex items-start gap-3">
                  <DollarSign className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Budget</p>
                    <p className="text-lg font-semibold text-white">{formatBudget(request.budget, request.currency)}</p>
                  </div>
                </div> */}

                {/* Deadline */}
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="text-lg font-semibold text-white">{request.duration} days</p>
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Created</p>
                    <p className="text-lg font-semibold text-white">
                      {formatDateTime(request.postCreatedTime || request.requestCreatedTime)}
                    </p>
                  </div>
                </div>

                {/* Last Updated */}
                {/* <div className="flex items-start gap-3">
                  <FileText className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Last Updated</p>
                    <p className="text-lg font-semibold text-white">{formatDateTime(request.updatedAt)}</p>
                  </div>
                </div> */}
              </div>
            </div>
            {request.summary && (
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Summary</h3>
                <div>
                  <p className="text-white" dangerouslySetInnerHTML={{ __html: request.summary }}></p>
                </div>

              {!request.summary && <p className="text-gray-400">No summary provided</p>}
            </div>
              )}
              {request.detailDescription && (
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Detail Description</h3>
                <div>
                  <p className="text-white" dangerouslySetInnerHTML={{ __html: request.detailDescription }}></p>
                </div>
              {!request.detailDescription && <p className="text-gray-400">No detail description provided</p>}
            </div>
              )}
            {/* Description Section */}
              {request.requirements && (
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Requirements</h3>
                <div>
                  <p className="text-white" dangerouslySetInnerHTML={{ __html: request.requirements }}></p>
                </div>
x              {!request.requirements && <p className="text-gray-400">No requirements provided</p>}
            </div>
              )}

            {/* Budget */}
            {request.budget && (
              <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Budget</h3>
              <div>
                <p className="text-lg font-semibold text-white">
                {request.budget.min?.toLocaleString()} - {request.budget.max?.toLocaleString()} {request.currency?.toUpperCase() || "USD"}
                </p>
              </div>
              </div>
            )}

            {/* Package Information Section */}
            {(artistPackage ?? []).length > 0 && (
              <div className="space-y-4 border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold">Package Chosen</h3>
                <div className="space-y-4 rounded-lg border p-4">
                  {/* Package Name */}
                  <div>
                    <p className="text-sm text-gray-400">Package Name</p>
                    <p className="text-lg font-semibold text-white">{artistPackage?.[0]?.packageName || "Package Name Not Available"}</p>
                  </div>

                  {/* Package Details - Single Line */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Package Amount */}
                    <div>
                      <p className="text-sm text-gray-400">Package Price</p>
                      <p className="text-lg font-semibold text-white">
                        {artistPackage?.[0]?.amount?.toLocaleString()}{" "}
                        {artistPackage?.[0]?.currency?.toUpperCase() ||"USD"}
                      </p>
                    </div>

                    {/* Estimated Delivery */}
                    <div>
                      <p className="text-sm text-gray-400">Estimated Delivery</p>
                      <p className="text-lg font-semibold text-white">
                        {artistPackage?.[0]?.estimateDeliveryDays}{" "}
                        {artistPackage?.[0]?.estimateDeliveryDays === 1 ? "day" : "days"}
                      </p>
                    </div>

                    {/* Max Revisions */}
                    <div>
                      <p className="text-sm text-gray-400">Revisions Included</p>
                      <p className="text-lg font-semibold text-white">
                        {artistPackage?.[0]?.maxRevision === -1 ? "Unlimited" : artistPackage?.[0]?.maxRevision || 0} revisions
                      </p>
                    </div>
                  </div>

                  {/* Package Description */}
                  {artistPackage?.[0]?.description && (
                    <div className="border-t border-gray-700 pt-4">
                      <p className="mb-2 text-sm text-gray-400">Package Description</p>
                      <p className="whitespace-pre-wrap text-white">{artistPackage?.[0]?.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {/* <div className="flex flex-wrap gap-3">
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
        </div> */}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Request?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this request? This action cannot be undone. The artist will be notified
              that you have canceled the request.
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
