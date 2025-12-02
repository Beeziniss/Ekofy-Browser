"use client";

import { EscrowPolicyListSection } from "../section/escrow-policy-list-section";
import { EscrowPolicyLayout } from "../layout/escrow-policy-layout";

export function EscrowPolicyView() {
  return (
    <EscrowPolicyLayout
      title="Escrow Commission Policy Management"
      description="Configure and manage escrow commission policies for platform fees and revenue distribution"
    >
      <EscrowPolicyListSection />
    </EscrowPolicyLayout>
  );
}
