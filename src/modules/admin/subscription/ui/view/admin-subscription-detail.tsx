"use client";

import { useRouter } from "next/navigation";
import { SubscriptionDetailSection } from "../section/subscription-detail-section";

interface AdminSubscriptionDetailProps {
  subscriptionId: string;
}

export function AdminSubscriptionDetail({ subscriptionId }: AdminSubscriptionDetailProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/admin/subscription");
  };

  return (
    <div className="container mx-auto py-6">
      <SubscriptionDetailSection 
        subscriptionId={subscriptionId} 
        onBack={handleBack}
      />
    </div>
  );
}