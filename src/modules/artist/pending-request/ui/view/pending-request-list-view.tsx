"use client";

import { PendingRequestListSection } from "../section/pending-request-list-section";

export function PendingRequestListView() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Pending Requests</h1>
        <p className="text-muted-foreground mt-2">
          Manage and review collaboration requests from listeners
        </p>
      </div>

      <PendingRequestListSection />
    </div>
  );
}