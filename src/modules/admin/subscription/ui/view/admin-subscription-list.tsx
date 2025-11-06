import { SubscriptionListSection } from "../section/subscription-list-section";
import { SubscriptionLayout } from "../layout/subscription-layout";
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
