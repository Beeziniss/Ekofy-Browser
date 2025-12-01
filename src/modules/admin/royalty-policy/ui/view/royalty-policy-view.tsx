"use client";

import { RoyaltyPolicyListSection } from "../section/royalty-policy-list-section";
import { RoyaltyPolicyLayout } from "../layout/royalty-policy-layout";

export function RoyaltyPolicyView() {
  return (
    <RoyaltyPolicyLayout
      title="Royalty Policy Management"
      description="Configure and manage royalty policies for stream payments and revenue distribution"
    >
      <RoyaltyPolicyListSection />
    </RoyaltyPolicyLayout>
  );
}
