"use client";

import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FragmentType, useFragment } from "@/gql";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, User, DollarSign } from "lucide-react";
import { requestStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import { serviceCreateCheckoutSessionMutationOptions } from "@/gql/options/client-mutation-options";
import { Request, RequestArtistFragmentDoc, RequestArtistPackageFragmentDoc, RequestStatus } from "@/gql/graphql";
import { conversationDetailByRequestOptions } from "@/gql/options/client-options";

interface RequestListItemProps {
  request: Omit<Request, "requestor" | "artist" | "artistPackage"> & {
    // Explicitly say: "The artist field looks like this fragment"
    artist: FragmentType<typeof RequestArtistFragmentDoc>[];

    // Do the same for other fragments if needed
    artistPackage: FragmentType<typeof RequestArtistPackageFragmentDoc>[];
  };
  className?: string;
}

export function RequestListItem({ request, className }: RequestListItemProps) {
  const artist = useFragment(RequestArtistFragmentDoc, request.artist);
  // const artistPackage = useFragment(RequestArtistPackageFragmentDoc, request.artistPackage);

  // Payment mutation
  const createCheckoutSessionMutation = useMutation(serviceCreateCheckoutSessionMutationOptions);

  // Conversation query
  const { data: conversationData } = useQuery(conversationDetailByRequestOptions(request.id));

  const handlePayment = async () => {
    if (!request.packageId) {
      toast.error("Package information is missing for this request.");
      return;
    }

    try {
      // Safely get conversationId - direct requests won't have conversations
      const conversationId = conversationData?.conversations?.items?.[0]?.id ?? null;

      const result = await createCheckoutSessionMutation.mutateAsync({
        packageId: request.packageId,
        requestId: request.id,
        duration: request.duration || 0,
        requirements: request.requirements || "",
        deliveries: [], // Empty array as requested
        conversationId,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/profile/my-requests`,
        isReceiptEmail: true, // Default to true for receipt email
        isSavePaymentMethod: false, // Default to false for saving payment method
      });

      // Navigate to the payment URL
      if (result.createPaymentCheckoutSession?.url) {
        window.location.href = result.createPaymentCheckoutSession.url;
      } else {
        toast.error("Failed to create payment session. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const formatBudget = (
    budget: { min: number; max: number } | null | undefined,
    currency: string | null | undefined,
  ) => {
    if (!budget) return "Budget not specified";
    const currencyStr = currency?.toUpperCase() || "USD";
    const formatCurrency = (amount: number) => {
      return `${amount.toLocaleString()} ${currencyStr}`;
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
                  {request.title || `Request for ${artist?.[0].stageName || "Service"}`} - {request.type}
                </h3>
                {requestStatusBadge(request.status)}
              </div>
            </div>

            {/* Summary */}
            {request.summary && (
              <div>
                <span className="font-medium text-white">Summary: </span>
                <p
                  className="line-clamp-2 inline text-sm text-gray-400"
                  dangerouslySetInnerHTML={{ __html: request.summary || "No summary provided" }}
                ></p>
              </div>
            )}

            {/* Requirements */}
            {request.requirements && (
              <div>
                <span className="font-medium text-white">Requirements: </span>
                <p
                  className="line-clamp-2 text-sm text-gray-400"
                  dangerouslySetInnerHTML={{ __html: request.requirements || "No requirements provided" }}
                ></p>
              </div>
            )}
            {/* Artist Info - Only show for direct requests with artist */}
            {artist && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">
                  To:{" "}
                  <Link
                    href={`/artists/${"userId" in artist && artist.userId ? artist.userId : request.artistId}/tracks`}
                    className="hover:text-main-purple font-medium text-white transition-colors"
                  >
                    {artist?.[0]?.stageName}
                  </Link>
                </span>
              </div>
            )}

            {/* Meta Information */}
            <div className="text-main-white flex flex-wrap items-center gap-4 text-sm">
              {request.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-white">Budget: {formatBudget(request.budget, request.currency)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Duration: {request.duration} days</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Created:{" "}
                  {request.postCreatedTime
                    ? formatDateTime(request.postCreatedTime)
                    : formatDateTime(request.requestCreatedTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Show payment button only for confirmed requests with package */}
            {request.status === RequestStatus.Confirmed && request.packageId && (
              <Button
                variant={"ekofy"}
                size={"sm"}
                onClick={handlePayment}
                disabled={createCheckoutSessionMutation.isPending}
              >
                {createCheckoutSessionMutation.isPending ? "Processing..." : "Confirm Payment"}
              </Button>
            )}

            <Button variant="outline" size="sm" asChild className="flex-1 md:flex-none">
              <Link href={`/profile/my-requests/${request.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
