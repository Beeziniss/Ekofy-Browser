"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { moderatorPublicRequestByIdQueryOptions } from "@/gql/options/moderator-public-request-query-options";
import { PublicRequestDetailView } from "@/modules/moderator/public-request/ui/component/public-request-detail-view";
import { Loader2 } from "lucide-react";

interface PublicRequestDetailPageProps {
  params: Promise<{
    requestId: string;
  }>;
}

export default function PublicRequestDetailPage({ params }: PublicRequestDetailPageProps) {
  const router = useRouter();
  const { requestId } = React.use(params);
  const { data, isLoading, error } = useQuery(moderatorPublicRequestByIdQueryOptions(requestId));

  const handleBack = () => {
    router.push("/moderator/public-request");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !data?.requestDetailById) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Request Not Found</h2>
          <p className="mt-2 text-gray-400">The request you are looking for does not exist or has been deleted.</p>
          <button onClick={handleBack} className="mt-4 text-blue-500 hover:underline">
            Go back to list
          </button>
        </div>
      </div>
    );
  }

  return <PublicRequestDetailView request={data.requestDetailById} onBack={handleBack} />;
}
