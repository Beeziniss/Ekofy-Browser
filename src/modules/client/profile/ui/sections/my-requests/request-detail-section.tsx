"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, User, FileText, MessageSquare } from "lucide-react";
import { requestByIdOptions } from "@/gql/options/client-options";
import { requestStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import { RequestStatus as GqlRequestStatus, RequestType as GqlRequestType, CurrencyType } from "@/gql/graphql";
import { useAuthStore } from "@/store";

interface RequestDetailSectionProps {
  requestId: string;
}

// MOCK DATA - same as in my-requests-section
const MOCK_DATA = true;

const getMockRequestById = (id: string, userId: string) => {
  const mockRequests = [
    {
      __typename: "Request" as const,
      id: "req-001",
      requestUserId: userId,
      title: "Need a custom logo design for my startup",
      titleUnsigned: "need a custom logo design for my startup",
      summary: "Looking for a professional logo that represents innovation and technology",
      summaryUnsigned: "looking for a professional logo that represents innovation and technology",
      detailDescription: "I need a modern, minimalist logo for my tech startup. The logo should incorporate elements of AI and innovation.",
      budget: { min: 500, max: 1000 },
      currency: CurrencyType.Usd,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: GqlRequestStatus.Pending,
      type: GqlRequestType.DirectRequest,
      postCreatedTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      requestCreatedTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      artistId: "artist-001",
      packageId: "pkg-001",
      requestor: [],
      artist: [
        {
          __typename: "Artist" as const,
          id: "artist-001",
          stageName: "Creative Studio Pro",
          avatarImage: null,
        },
      ],
    },
    {
      __typename: "Request" as const,
      id: "req-002",
      requestUserId: userId,
      title: "Music production for my upcoming album",
      titleUnsigned: "music production for my upcoming album",
      summary: "Need full music production including mixing and mastering",
      summaryUnsigned: "need full music production including mixing and mastering",
      detailDescription: "Looking for professional music production services for 10 tracks. Genre: Electronic/Pop.",
      budget: { min: 2000, max: 5000 },
      currency: CurrencyType.Usd,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: GqlRequestStatus.Confirmed,
      type: GqlRequestType.DirectRequest,
      postCreatedTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      requestCreatedTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      artistId: "artist-002",
      packageId: "pkg-002",
      requestor: [],
      artist: [
        {
          __typename: "Artist" as const,
          id: "artist-002",
          stageName: "BeatMaster Productions",
          avatarImage: null,
        },
      ],
    },
    {
      __typename: "Request" as const,
      id: "req-003",
      requestUserId: userId,
      title: "Professional voice over for commercial",
      titleUnsigned: "professional voice over for commercial",
      summary: "Need a deep, authoritative voice for a 30-second commercial",
      summaryUnsigned: "need a deep authoritative voice for a 30 second commercial",
      detailDescription: "Looking for a professional voice actor with a deep, authoritative tone for a product commercial.",
      budget: { min: 300, max: 600 },
      currency: CurrencyType.Usd,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: GqlRequestStatus.Rejected,
      type: GqlRequestType.DirectRequest,
      postCreatedTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      requestCreatedTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      artistId: "artist-003",
      packageId: "pkg-003",
      requestor: [],
      artist: [
        {
          __typename: "Artist" as const,
          id: "artist-003",
          stageName: "VoiceOver Maestro",
          avatarImage: null,
        },
      ],
    },
    {
      __typename: "Request" as const,
      id: "req-004",
      requestUserId: userId,
      title: "Website redesign and development",
      titleUnsigned: "website redesign and development",
      summary: "Complete website overhaul with modern design",
      summaryUnsigned: "complete website overhaul with modern design",
      detailDescription: "Need a complete website redesign with responsive design, modern UI/UX, and performance optimization.",
      budget: { min: 3000, max: 7000 },
      currency: CurrencyType.Usd,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: GqlRequestStatus.Canceled,
      type: GqlRequestType.DirectRequest,
      postCreatedTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      requestCreatedTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      artistId: "artist-004",
      packageId: "pkg-004",
      requestor: [],
      artist: [
        {
          __typename: "Artist" as const,
          id: "artist-004",
          stageName: "WebDev Solutions",
          avatarImage: null,
        },
      ],
    },
  ];

  return mockRequests.find((req) => req.id === id);
};

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
  const { user } = useAuthStore();
  const { data: request, isLoading, error } = useQuery(requestByIdOptions(requestId));

  // Use mock data if enabled
  const displayRequest = MOCK_DATA && user?.userId ? getMockRequestById(requestId, user.userId) : request;
  const isLoadingData = MOCK_DATA ? false : isLoading;
  const hasError = MOCK_DATA ? !displayRequest : error || !request;

  if (isLoadingData) {
    return <RequestDetailSkeleton />;
  }

  if (hasError || !displayRequest) {
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

  if (isLoadingData) {
    return <RequestDetailSkeleton />;
  }

  if (hasError) {
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
            <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="mb-2 text-2xl">{displayRequest.title || "Untitled Request"}</CardTitle>
              <div className="flex items-center gap-2">
                {requestStatusBadge(displayRequest.status)}
              </div>
              </div>
            </div>
          </CardHeader>
        <CardContent className="space-y-6">
          {/* Artist Info & Key Information */}
          <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            {/* Artist Info */}
            {displayRequest.artist && displayRequest.artist.length > 0 && (
              <div className="flex items-start gap-3 pb-4 border-b border-gray-700">
                <User className="mt-1 h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Sent to</p>
                  <Link
                    href={`/artist/${displayRequest.artist[0].id}`}
                    className="hover:text-main-purple text-lg font-semibold text-white transition-colors"
                  >
                    {displayRequest.artist[0].stageName}
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
                  <p className="text-lg font-semibold text-white">{formatBudget(displayRequest.budget, displayRequest.currency)}</p>
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Deadline</p>
                  <p className="text-lg font-semibold text-white">{formatDate(displayRequest.deadline)}</p>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-lg font-semibold text-white">
                    {formatDateTime(displayRequest.requestCreatedTime || displayRequest.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-start gap-3">
                <FileText className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Last Updated</p>
                  <p className="text-lg font-semibold text-white">{formatDateTime(displayRequest.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold">
              Description
            </h3>
            {displayRequest.summary && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-400">Summary</h4>
                <p className="text-white">{displayRequest.summary}</p>
              </div>
            )}
            {displayRequest.detailDescription && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-400">Details</h4>
                <p className="whitespace-pre-wrap text-white">{displayRequest.detailDescription}</p>
              </div>
            )}
            {!displayRequest.summary && !displayRequest.detailDescription && (
              <p className="text-gray-400">No description provided</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {displayRequest.status === "CONFIRMED" && (
          <Button className="primary_gradient text-white hover:opacity-65">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message Artist
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/profile/my-requests">Back to My Requests</Link>
        </Button>
      </div>
      </div>
    </div>
  );
}
