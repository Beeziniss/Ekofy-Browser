"use client";

import { ArtistApprovalLayout } from "../layout";
import { ArtistApprovalSection } from "../section";

export function ArtistApprovalView() {
  return (
    <ArtistApprovalLayout
      title="Approval Center"
      description="Manage artist registration requests and approvals"
    >
      <ArtistApprovalSection />
    </ArtistApprovalLayout>
  );
}
