"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { pendingRequestDetailOptions } from "@/gql/options/pending-request-option";
import { moderatorPackageOrderDetailOptions } from "@/gql/options/moderator-options";
import { useChangeRequestStatusMutation } from "@/gql/client-mutation-options/pending-request-mutation";
import { PendingRequestInfoCard } from "../component/pending-request-info-card";
import { PendingRequestActions } from "../component/pending-request-actions";
import { RequestStatus } from "@/gql/graphql";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PendingRequestDetailSectionProps {
  requestId: string;
}

export function PendingRequestDetailSection({ requestId }: PendingRequestDetailSectionProps) {
  const router = useRouter();
  
  // Fetch request details
  const { data, isLoading, error, refetch } = useQuery(
    pendingRequestDetailOptions(requestId)
  );

  // Mutations
  const changeStatusMutation = useChangeRequestStatusMutation();

  const request = data?.requests?.items?.[0];
  const orderId = request?.orderId;

  // Fetch order details including conversationId when orderId exists
  const { data: orderData } = useQuery(moderatorPackageOrderDetailOptions(orderId || ""));

  // Handlers
  const handleApprove = async () => {
    try {
      await changeStatusMutation.mutateAsync({
        requestId,
        status: RequestStatus.Confirmed,
      });
      router.push("/artist/studio/pending-request");
    } catch (error) {
      toast.error("Failed to approve request");
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async () => {
    try {
      await changeStatusMutation.mutateAsync({
        requestId,
        status: RequestStatus.Rejected,
      });
      router.push("/artist/studio/pending-request");
    } catch (error) {
      toast.error("Failed to reject request");
      console.error("Error rejecting request:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load request details</p>
          <button
            onClick={() => refetch()}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.requests) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Request not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-2 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/artist/studio/pending-request")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <PendingRequestInfoCard request={data.requests.items || []} />
        </div>

        {/* Sidebar */}
        <div>
          <PendingRequestActions
            requestId={requestId}
            status={data.requests.items?.[0]?.status || RequestStatus.Pending}
            requestTitle={data.requests.items?.[0]?.title || 'Untitled Request'}
            orderId={orderId}
            conversationId={orderData?.conversationId}
            onApprove={handleApprove}
            onReject={handleReject}
            isProcessing={changeStatusMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}