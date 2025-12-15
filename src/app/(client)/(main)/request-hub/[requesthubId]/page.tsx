"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { requestByIdOptions } from "@/gql/options/client-options";
import { RequestDetailView } from "@/modules/client/request-hub/ui/component";
import { AuthDialogProvider } from "@/modules/client/request-hub/ui/context";
import { useRouter } from "next/navigation";
import { RequestStatus } from "@/gql/graphql";
import { toast } from "sonner";

const RequestDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const requestId = params.requesthubId as string;

  // Fetch request details
  const { data: request, isLoading, isError } = useQuery(requestByIdOptions(requestId));

  const handleBack = () => {
    router.push("/request-hub");
  };

  const handleEdit = (id: string) => {
    router.push(`/request-hub/${id}/edit`);
  };

  // Redirect if request not found or backend error
  useEffect(() => {
    if (!isLoading && (isError || !request)) {
      toast.error("Request not found", {
        description: "The request you're looking for has been Closed or removed.",
      });
      router.push("/request-hub");
    }
  }, [isLoading, isError, request, router]);

  // Redirect if request is not open (Closed, Blocked, or Deleted)
  useEffect(() => {
    if (request && request.status !== RequestStatus.Open) {
      const statusMessage = 
        request.status === RequestStatus.Closed 
          ? "This request has been closed and is no longer available for viewing."
          : request.status === RequestStatus.Blocked
          ? "This request has been blocked and is not available."
          : "This request is not available for viewing.";
      
      toast.error("Request unavailable", {
        description: statusMessage,
      });
      router.push("/request-hub");
    }
  }, [request, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading request details...</div>
      </div>
    );
  }

  if (!request) {
    return null; // Will redirect via useEffect
  }

  return (
    <AuthDialogProvider>
      <RequestDetailView request={request} onBack={handleBack} onEdit={handleEdit} />
    </AuthDialogProvider>
  );
};

export default RequestDetailPage;
