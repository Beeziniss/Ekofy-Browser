"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { PeriodTime, SubscriptionPlan } from "@/gql/graphql";
import { SubscriptionPlanCard } from "../components/subscription-plan-card";

interface SubscriptionPlansGridSectionProps {
  isLoading?: boolean;
  proFeatures?: string[];
  couponDiscount?: number;
  plans: SubscriptionPlan[];
  premiumFeatures?: string[];
  onSelectPlan: (subscriptionCode: string, period: PeriodTime) => void;
}

export function SubscriptionPlansGridSection({
  plans,
  isLoading,
  onSelectPlan,
  proFeatures = [],
  couponDiscount = 0,
  premiumFeatures = [],
}: SubscriptionPlansGridSectionProps) {
  if (isLoading) {
    return (
      <section className="container mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Choose Your Plan</h2>
          <p className="text-muted-foreground">Loading subscription plans...</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96 rounded-md" />
          ))}
        </div>
      </section>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <section className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold">No Plans Available</h2>
          <p className="text-muted-foreground">Check back later for subscription options.</p>
        </div>
      </section>
    );
  }

  // Group plans by subscription tier
  const groupedPlans = plans.reduce(
    (acc, plan) => {
      const tier = plan.subscription?.[0]?.tier || "UNKNOWN";
      if (!acc[tier]) acc[tier] = [];
      acc[tier].push(plan);
      return acc;
    },
    {} as Record<string, SubscriptionPlan[]>,
  );

  // Sort tiers for display (FREE -> PREMIUM -> ENTERPRISE)
  const tierOrder = ["FREE", "PREMIUM", "PRO"];
  const sortedTiers = Object.keys(groupedPlans).sort((a, b) => {
    return tierOrder.indexOf(a) - tierOrder.indexOf(b);
  });

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Choose Your Plan</h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
          Select the perfect subscription that fits your music needs and budget
        </p>

        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-8">
          {sortedTiers.map((tier) => {
            const tierPlans = groupedPlans[tier];
            return tierPlans.map((plan, index) => {
              // Get appropriate features based on tier
              let keyFeatures: string[] | undefined;
              if (tier === "PREMIUM") {
                keyFeatures = premiumFeatures;
              } else if (tier === "PRO") {
                keyFeatures = proFeatures;
              }

              return (
                <div key={`${tier}-${index}`} className="w-full flex-shrink-0 sm:w-80 md:w-96">
                  <SubscriptionPlanCard
                    plan={plan}
                    onSelectPlan={onSelectPlan}
                    couponDiscount={couponDiscount}
                    keyFeatures={keyFeatures}
                  />
                </div>
              );
            });
          })}
        </div>
      </div>
    </section>
  );
}
