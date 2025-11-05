import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  subscriptionDetailQueryOptions, 
  subscriptionPlansQueryOptions 
} from "@/gql/options/subscription-options";
import { SubscriptionTier, SubscriptionStatus } from "@/gql/graphql";
import { SubscriptionHeader } from "../component/subscription/subscription-header";
import { SubscriptionInfoCard } from "../component/subscription/subscription-info-card";
import { SubscriptionPlansSection } from "../component/subscription-plan/subscription-plans-section";
import { default as CreateSubscriptionPlanForm } from "../component/subscription-plan/create-subscription-plan-form";
import type { SubscriptionPlan } from "@/types";

interface SubscriptionDetailSectionProps {
  subscriptionId: string;
  onBack?: () => void;
}

export function SubscriptionDetailSection({ 
  subscriptionId, 
  onBack 
}: SubscriptionDetailSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatePlanFormOpen, setIsCreatePlanFormOpen] = useState(false);
  
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery(
    subscriptionDetailQueryOptions(subscriptionId)
  );

  const { data: plansData, isLoading: isLoadingPlans, refetch: refetchPlans } = useQuery(
    subscriptionPlansQueryOptions(skip, pageSize, subscriptionId, searchTerm)
  );

  const subscription = subscriptionData?.subscriptions?.items?.[0];
  const plans = plansData?.subscriptionPlans.items || [];
  const totalCount = plansData?.subscriptionPlans.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

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

  const handleEditPlan = (plan: SubscriptionPlan) => {
    console.log("Edit plan:", plan);
  };

  const handleDeletePlan = (plan: SubscriptionPlan) => {
    console.log("Delete plan:", plan);
  };

  const handleCreatePlanSuccess = () => {
    refetchPlans();
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
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading subscription details...</div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Subscription not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubscriptionHeader subscription={subscription} onBack={onBack} />
      
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
        onEditPlan={handleEditPlan}
        onDeletePlan={handleDeletePlan}
      />

      {/* Show form for Premium and Pro subscriptions */}
      {(subscription.tier === SubscriptionTier.Premium || subscription.tier === SubscriptionTier.Pro) && subscription.status === SubscriptionStatus.Active && (
        <CreateSubscriptionPlanForm
          open={isCreatePlanFormOpen}
          onOpenChange={setIsCreatePlanFormOpen}
          onSuccess={handleCreatePlanSuccess}
          preselectedSubscriptionCode={subscription?.code}
        />
      )}
    </div>
  );
}