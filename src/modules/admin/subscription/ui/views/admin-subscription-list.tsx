"use client";

import { SubscriptionListSection } from "../sections/subscription-list-section";
import { SubscriptionLayout } from "../layouts/subscription-layout";
import type { SubscriptionsResponse } from "@/types";

interface AdminSubscriptionListProps {
  initialData?: SubscriptionsResponse;
}

export function AdminSubscriptionList({ initialData }: AdminSubscriptionListProps) {
  return (
    <SubscriptionLayout title="Subscriptions" description="Manage subscription plans and pricing for your platform">
      <SubscriptionListSection initialData={initialData} />
    </SubscriptionLayout>
  );
}
