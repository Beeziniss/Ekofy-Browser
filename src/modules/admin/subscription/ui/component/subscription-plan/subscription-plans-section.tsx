"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SubscriptionActions } from "../subscription/subscription-actions";
import { SubscriptionPlanTable } from "./subscription-plan-table";
import { CustomPagination } from "@/components/ui/custom-pagination";
import type { SubscriptionPlan } from "@/types";

interface SubscriptionPlansSectionProps {
  subscription:
    | {
        id: string;
        name: string;
        description?: string | null;
        code: string;
        tier: string;
        status: string;
      }
    | undefined;
  plans: SubscriptionPlan[];
  isLoadingPlans: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  subscriptionId: string;
  onCreatePlan: () => void;
  onSearch: (searchTerm: string) => void;
  onPageChange: (page: number) => void;
  onViewPlan: (plan: SubscriptionPlan) => void;
}

export function SubscriptionPlansSection({
  subscription,
  plans,
  isLoadingPlans,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  subscriptionId,
  onCreatePlan,
  onSearch,
  onPageChange,
  onViewPlan,
}: SubscriptionPlansSectionProps) {
  // Check if subscription can create plans
  const canCreateSubscriptionPlans = () => {
    if (!subscription) return false;
    // Hide create button if there are already plans
    if (plans.length > 0) return false;
    return subscription.tier === "PREMIUM" || subscription.tier === "PRO";
  };

  // Check if subscription plans section should be shown
  const shouldShowSubscriptionPlans = () => {
    if (!subscription) return false;
    return subscription.tier !== "FREE";
  };

  if (!shouldShowSubscriptionPlans()) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            Free tier subscriptions do not support subscription plans. Upgrade to Premium to manage subscription plans.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <SubscriptionActions
        onCreateSubscriptionPlan={onCreatePlan}
        onSearch={onSearch}
        searchPlaceholder="Search subscription plans..."
        showCreatePlan={canCreateSubscriptionPlans()}
      />

      {/* Info message when cannot create plans */}
      {!canCreateSubscriptionPlans() && subscription && subscription.tier !== "FREE" && (
        <Card className="border-main-dark-bg-1 bg-main-card-bg">
          <CardContent className="p-4">
            <p className="text-sm text-main-white">
              {plans.length > 0 
                ? "This subscription already has plans. Only one plan per subscription is allowed."
                : "Only Premium and Pro subscriptions can create subscription plans."
              }
            </p>
          </CardContent>
        </Card>
      )}

      <SubscriptionPlanTable
        subscriptionPlans={plans}
        onView={onViewPlan}
        isLoading={isLoadingPlans}
        showSubscriptionInfo={false}
        subscriptionId={subscriptionId}
      />

      {totalPages > 1 && (
        <div className="flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
