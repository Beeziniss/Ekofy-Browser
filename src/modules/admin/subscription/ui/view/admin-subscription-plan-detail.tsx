"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { subscriptionPlanDetailQueryOptions } from "@/gql/options/subscription-options";
import { SubscriptionLayout } from "../layout/subscription-layout";
import { PlanDetailHeader } from "../component/subscription-plan/plan-detail-header";
import { PlanBasicInfo } from "../component/subscription-plan/plan-basic-info";
import { PlanSubscriptionInfo } from "../component/subscription-plan/plan-subscription-info";
import { PlanPricingInfo } from "../component/subscription-plan/plan-pricing-info";
import { PlanImages } from "../component/subscription-plan/plan-images";
import { PlanMetadata } from "../component/subscription-plan/plan-metadata";
import { PlanQuickStats } from "../component/subscription-plan/plan-quick-stats";

interface SubscriptionPlanDetailViewProps {
  subscriptionId: string;
  planId: string;
}

export default function SubscriptionPlanDetailView({ subscriptionId, planId }: SubscriptionPlanDetailViewProps) {
  const { data, isLoading, error } = useQuery(subscriptionPlanDetailQueryOptions(planId));

  const handleEdit = () => {
    console.log("Edit plan");
  };

  const handleDelete = () => {
    console.log("Delete plan");
  };

  if (isLoading) {
    return (
      <SubscriptionLayout title="Loading..." showCard={false}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="h-32 rounded bg-gray-200"></div>
          <div className="h-48 rounded bg-gray-200"></div>
        </div>
      </SubscriptionLayout>
    );
  }

  if (error || !data?.subscriptionPlans?.items?.[0]) {
    return (
      <SubscriptionLayout title="Subscription Plan Not Found" showCard={false}>
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Subscription Plan Not Found</h1>
          <p className="mb-6 text-gray-600">
            The subscription plan you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href={`/admin/subscription/${subscriptionId}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Subscription
            </Button>
          </Link>
        </div>
      </SubscriptionLayout>
    );
  }

  const plan = data.subscriptionPlans.items[0];

  return (
    <SubscriptionLayout title={plan.stripeProductName} description="Subscription Plan Details" showCard={false}>
      <div className="space-y-6">
        <PlanDetailHeader subscriptionId={subscriptionId} onEdit={handleEdit} onDelete={handleDelete} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Information */}
          <div className="space-y-6 lg:col-span-2">
            <PlanBasicInfo plan={plan} />

            <PlanSubscriptionInfo subscription={plan.subscription} />

            <PlanPricingInfo prices={plan.subscriptionPlanPrices} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PlanImages images={plan.stripeProductImages} />

            <PlanMetadata metadata={plan.stripeProductMetadata} />

            <PlanQuickStats
              totalPrices={plan.subscriptionPlanPrices.length}
              activePrices={plan.subscriptionPlanPrices.filter((p) => p.stripePriceActive).length}
              totalImages={plan.stripeProductImages?.length || 0}
              totalMetadata={plan.stripeProductMetadata?.length || 0}
            />
          </div>
        </div>
      </div>
    </SubscriptionLayout>
  );
}
