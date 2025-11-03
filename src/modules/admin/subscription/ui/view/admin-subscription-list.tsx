import { SubscriptionListSection } from "../section/subscription-list-section";
import type { SubscriptionsResponse } from "@/types";

interface AdminSubscriptionListProps {
  initialData?: SubscriptionsResponse;
}

export function AdminSubscriptionList({ initialData }: AdminSubscriptionListProps) {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage subscription plans and pricing for your platform.
          </p>
        </div>
        
        <SubscriptionListSection initialData={initialData} />
      </div>
    </div>
  );
}