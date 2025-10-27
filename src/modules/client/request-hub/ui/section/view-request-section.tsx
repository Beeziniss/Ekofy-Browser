"use client";

import { RequestCard } from "../component/request-card";
import { RequestListSkeleton } from "../component/request-card-skeleton";
import { RequestHubItem } from "@/types/request-hub";

interface ViewRequestSectionProps {
  requests: RequestHubItem[];
  isLoading?: boolean;
  onViewDetails: (id: string) => void;
  onApply: (id: string) => void;
  onSave?: (id: string) => void;
}

export function ViewRequestSection({ 
  requests, 
  isLoading = false,
  onViewDetails,
  onApply,
  onSave
}: ViewRequestSectionProps) {
  if (isLoading) {
    return <RequestListSkeleton count={6} />;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or check back later for new requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onViewDetails={onViewDetails}
          onApply={onApply}
          onSave={onSave}
        />
      ))}
    </div>
  );
}