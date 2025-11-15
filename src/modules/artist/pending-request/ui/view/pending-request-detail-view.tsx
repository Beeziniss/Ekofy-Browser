"use client";

import { PendingRequestDetailSection } from "../section/pending-request-detail-section";

interface PendingRequestDetailViewProps {
  requestId: string;
}

export function PendingRequestDetailView({ requestId }: PendingRequestDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Request Details</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage this collaboration request
        </p>
      </div>

      <PendingRequestDetailSection requestId={requestId} />
    </div>
  );
}