"use client";

import { SubscriptionPlanCard } from "../components/subscription-plan-card";
import type { SubscriptionPlan } from "@/types";

interface SubscriptionPlansGridSectionProps {
  plans: SubscriptionPlan[];
  isLoading?: boolean;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  couponDiscount?: number;
  premiumFeatures?: string[];
  proFeatures?: string[]; // Add support for Pro features
}

export function SubscriptionPlansGridSection({ 
  plans, 
  isLoading, 
  onSelectPlan,
  couponDiscount = 0,
  premiumFeatures = [],
  proFeatures = [] // Add proFeatures parameter
}: SubscriptionPlansGridSectionProps) {

  if (isLoading) {
    return (
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-muted-foreground">Loading subscription plans...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <section className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">No Plans Available</h2>
          <p className="text-muted-foreground">Check back later for subscription options.</p>
        </div>
      </section>
    );
  }

  // Group plans by subscription tier
  const groupedPlans = plans.reduce((acc, plan) => {
    const tier = plan.subscription?.[0]?.tier || 'UNKNOWN';
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(plan);
    return acc;
  }, {} as Record<string, SubscriptionPlan[]>);

  // Sort tiers for display (FREE -> PREMIUM -> ENTERPRISE)
  const tierOrder = ['FREE', 'PREMIUM', 'PRO'];
  const sortedTiers = Object.keys(groupedPlans).sort((a, b) => {
    return tierOrder.indexOf(a) - tierOrder.indexOf(b);
  });

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Select the perfect subscription that fits your music needs and budget
        </p>

        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {sortedTiers.map((tier) => {
            const tierPlans = groupedPlans[tier];
            return tierPlans.map((plan, index) => {
              // Get appropriate features based on tier
              let keyFeatures: string[] | undefined;
              if (tier === 'PREMIUM') {
                keyFeatures = premiumFeatures;
              } else if (tier === 'PRO') {
                keyFeatures = proFeatures;
              }
              
              return (
                <div 
                  key={`${tier}-${index}`} 
                  className="w-full sm:w-80 md:w-96 flex-shrink-0"
                >
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