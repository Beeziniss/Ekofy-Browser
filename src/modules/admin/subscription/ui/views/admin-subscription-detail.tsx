"use client";

import { useRouter } from "next/navigation";
import { SubscriptionDetailSection } from "../sections/subscription-detail-section";
import { SubscriptionLayout } from "../layouts/subscription-layout";

interface AdminSubscriptionDetailProps {
  subscriptionId: string;
}

export function AdminSubscriptionDetail({ subscriptionId }: AdminSubscriptionDetailProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/admin/subscription");
  };

  return (
    <SubscriptionLayout showCard={false}>
      <SubscriptionDetailSection subscriptionId={subscriptionId} onBack={handleBack} />
    </SubscriptionLayout>
  );
}
