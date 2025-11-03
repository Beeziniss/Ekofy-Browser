import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  subscriptionDetailQueryOptions, 
  subscriptionPlansQueryOptions 
} from "@/gql/options/subscription-options";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { SubscriptionPlanTable } from "../component/subscription-plan-table";
import { SubscriptionActions } from "../component/subscription-actions";
import { default as CreateSubscriptionPlanForm } from "../component/create-subscription-plan-form";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { formatNumber } from "@/utils/format-number";
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewPlan = (plan: SubscriptionPlan) => {
    // TODO: Implement plan detail view
    console.log("View plan:", plan);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    // TODO: Implement edit plan functionality
    console.log("Edit plan:", plan);
  };

  const handleDeletePlan = (plan: SubscriptionPlan) => {
    // TODO: Implement delete plan functionality
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
      case "ENTERPRISE":
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
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{subscription.name}</h1>
          <p className="text-muted-foreground">{subscription.description}</p>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Subscription
        </Button>
      </div>

      {/* Subscription details card */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Code</div>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {subscription.code}
              </code>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Tier</div>
              <Badge variant={getTierBadgeVariant(subscription.tier)}>
                {subscription.tier}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <Badge variant={getStatusBadgeVariant(subscription.status)}>
                {subscription.status}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Version</div>
              <div className="text-sm">{subscription.version}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Amount</div>
              <div className="text-sm font-medium">
                {formatNumber(subscription.amount)} {subscription.currency}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Created</div>
              <div className="text-sm">
                {new Date(subscription.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Updated</div>
              <div className="text-sm">
                {subscription.updatedAt 
                  ? new Date(subscription.updatedAt).toLocaleDateString()
                  : "Never"
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription plans section */}
      <div className="space-y-4">
        <SubscriptionActions
          onCreateSubscriptionPlan={() => setIsCreatePlanFormOpen(true)}
          onSearch={handleSearch}
          searchPlaceholder="Search subscription plans..."
          showCreatePlan={true}
        />

        <SubscriptionPlanTable
          subscriptionPlans={plans}
          onView={handleViewPlan}
          onEdit={handleEditPlan}
          onDelete={handleDeletePlan}
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
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <CreateSubscriptionPlanForm
        open={isCreatePlanFormOpen}
        onOpenChange={setIsCreatePlanFormOpen}
        onSuccess={handleCreatePlanSuccess}
        preselectedSubscriptionCode={subscription?.code}
      />
    </div>
  );
}