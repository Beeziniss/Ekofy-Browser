"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { requestByIdOptions } from "@/gql/options/client-options";
import { RequestDetailView } from "@/modules/client/request-hub/ui/component";
import { AuthDialogProvider } from "@/modules/client/request-hub/ui/context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RequestStatus } from "@/gql/graphql";

const RequestDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const requestId = params.requesthubId as string;

  // Fetch request details
  const { data: request, isLoading } = useQuery(requestByIdOptions(requestId));

  const handleBack = () => {
    router.push("/request-hub");
  };

  const handleEdit = (id: string) => {
    router.push(`/request-hub/${id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading request details...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Request not found</div>
      </div>
    );
  }

  // Only show OPEN requests in detail view
  if (request.status !== RequestStatus.Open) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">This request is not available for viewing</div>
      </div>
    );
  }

  return (
    <AuthDialogProvider>
      <RequestDetailView request={request} onBack={handleBack} onEdit={handleEdit} />
    </AuthDialogProvider>
  );
};

export default RequestDetailPage;
