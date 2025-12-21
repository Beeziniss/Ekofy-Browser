"use client";

import { EntitlementLayout } from "../layouts";
import { EntitlementDetailSection } from "../sections";

interface EntitlementDetailViewProps {
  entitlementId: string;
}

export function EntitlementDetailView({ entitlementId }: EntitlementDetailViewProps) {
  return (
    <EntitlementLayout>
      <EntitlementDetailSection entitlementId={entitlementId} />
    </EntitlementLayout>
  );
}

