"use client";

import { useAuthStore } from "@/store";
import { RequestCard } from "../component/request-card";
import { RequestListSkeleton } from "../component/request-card-skeleton";
import { RequestsQuery } from "@/gql/graphql";

type RequestItem = NonNullable<NonNullable<RequestsQuery['requests']>['items']>[0];

interface ViewRequestSectionProps {
  requests: RequestItem[];
  isLoading?: boolean;
  onViewDetails: (id: string) => void;
  onApply: (id: string) => void;
  onEdit?: (id: string) => void;
  onSave?: (id: string) => void;
}

export function ViewRequestSection({ 
  requests, 
  isLoading = false,
  onViewDetails,
  onApply,
  onEdit,
  onSave
}: ViewRequestSectionProps) {
  const { user } = useAuthStore();

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
      {requests.map((request) => {
        const isOwner = user?.userId === request.requestUserId;
        
        return (
          <RequestCard
            key={request.id}
            request={request}
            onViewDetails={onViewDetails}
            onApply={onApply}
            onEdit={isOwner ? onEdit : undefined}
            onSave={onSave}
            isOwner={isOwner}
          />
        );
      })}
    </div>
  );
}