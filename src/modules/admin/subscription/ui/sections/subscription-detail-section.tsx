import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { subscriptionDetailQueryOptions, subscriptionPlansQueryOptions } from "@/gql/options/subscription-options";
import { useActivateSubscriptionMutation } from "@/gql/client-mutation-options/subscription-mutation-options";
import { SubscriptionTier } from "@/gql/graphql";
import { SubscriptionHeader } from "../components/subscription/subscription-header";
import { SubscriptionInfoCard } from "../components/subscription/subscription-info-card";
import { SubscriptionPlansSection } from "../components/subscription-plan/subscription-plans-section";
import { default as CreateSubscriptionPlanForm } from "../components/subscription-plan/create-subscription-plan-form";
import { default as EditSubscriptionPlanForm } from "../components/subscription-plan/edit-subscription-plan-form";
import type { SubscriptionPlan } from "@/types";

interface SubscriptionDetailSectionProps {
  subscriptionId: string;
  onBack?: () => void;
}

export function SubscriptionDetailSection({ subscriptionId, onBack }: SubscriptionDetailSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatePlanFormOpen, setIsCreatePlanFormOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditPlanFormOpen, setIsEditPlanFormOpen] = useState(false);

  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  const activateSubscriptionMutation = useActivateSubscriptionMutation();

  const { data: subscriptionData, isLoading: isLoadingSubscription, refetch: refetchSubscription } = useQuery(
    subscriptionDetailQueryOptions(subscriptionId),
  );

  const {
    data: plansData,
    isLoading: isLoadingPlans,
    refetch: refetchPlans,
  } = useQuery(subscriptionPlansQueryOptions(skip, pageSize, subscriptionId, searchTerm));

  const subscription = subscriptionData?.subscriptions?.items?.[0];
  const plans = plansData?.subscriptionPlans.items || [];
  const totalCount = plansData?.subscriptionPlans.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasPlans = plans.length > 0;

  const handleSearch = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleViewPlan = (plan: SubscriptionPlan) => {
    console.log("View plan:", plan);
  };

  const handleEditPlanSuccess = () => {
    refetchPlans();
    setIsEditPlanFormOpen(false);
    setEditPlan(null);
  };

  const handleCreatePlanSuccess = () => {
    refetchPlans();
  };

  const handleActivateSubscription = async () => {
    if (!subscription?.id) return;
    
    try {
      await activateSubscriptionMutation.mutateAsync(subscription.id);
      refetchSubscription();
    } catch (error) {
      console.error("Failed to activate subscription:", error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default" as const;
      case "INACTIVE":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case "FREE":
        return "outline" as const;
      case "PREMIUM":
        return "default" as const;
      case "PRO":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  if (isLoadingSubscription) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-muted-foreground">Loading subscription details...</div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-muted-foreground">Subscription not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubscriptionHeader 
        subscription={subscription} 
        onBack={onBack} 
        onActivate={handleActivateSubscription}
        hasPlans={hasPlans}
        isActivating={activateSubscriptionMutation.isPending}
      />

      <SubscriptionInfoCard
        subscription={subscription}
        getStatusBadgeVariant={getStatusBadgeVariant}
        getTierBadgeVariant={getTierBadgeVariant}
      />

      <SubscriptionPlansSection
        subscription={subscription}
        plans={plans}
        isLoadingPlans={isLoadingPlans}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        subscriptionId={subscriptionId}
        onCreatePlan={() => setIsCreatePlanFormOpen(true)}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onViewPlan={handleViewPlan}
      />

      {/* Show form for Premium and Pro subscriptions */}
      {subscription.tier === SubscriptionTier.Premium || subscription.tier === SubscriptionTier.Pro ? (
          <CreateSubscriptionPlanForm
            open={isCreatePlanFormOpen}
            onOpenChange={setIsCreatePlanFormOpen}
            onSuccess={handleCreatePlanSuccess}
            preselectedSubscriptionCode={subscription?.code}
          />
      ) : null}

      {/* Edit Subscription Plan Form */}
      {editPlan && (
        <EditSubscriptionPlanForm
          open={isEditPlanFormOpen}
          onOpenChange={setIsEditPlanFormOpen}
          onSuccess={handleEditPlanSuccess}
          subscriptionPlan={editPlan}
        />
      )}
    </div>
  );
}
