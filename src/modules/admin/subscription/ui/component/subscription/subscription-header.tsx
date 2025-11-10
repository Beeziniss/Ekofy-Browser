"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, CheckCircle } from "lucide-react";

interface SubscriptionHeaderProps {
  subscription: {
    id: string;
    name: string;
    description?: string | null;
    code: string;
    tier: string;
    status: string;
  };
  onBack?: () => void;
  onActivate?: () => void;
  hasPlans?: boolean;
  isActivating?: boolean;
}

export function SubscriptionHeader({ subscription, onBack, onActivate, hasPlans, isActivating }: SubscriptionHeaderProps) {
  const canActivate = hasPlans && subscription.status !== "ACTIVE";

  return (
    <div className="flex items-center justify-between gap-4">
      {onBack && (
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      )}
      <div className="flex items-center gap-2">
        {canActivate && onActivate && (
          <Button 
            variant="default" 
            onClick={onActivate}
            disabled={isActivating}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isActivating ? "Activating..." : "Activate"}
          </Button>
        )}
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Subscription
        </Button>
      </div>
    </div>
  );
}
