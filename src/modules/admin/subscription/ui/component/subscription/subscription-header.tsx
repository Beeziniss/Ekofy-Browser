"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, CheckCircle } from "lucide-react";

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
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const canActivate = hasPlans && subscription.status !== "ACTIVE";

  const handleActivateClick = () => {
    setShowActivateDialog(true);
  };

  const handleConfirmActivate = () => {
    onActivate?.();
    setShowActivateDialog(false);
  };

  return (
    <>
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
              onClick={handleActivateClick}
              disabled={isActivating}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isActivating ? "Activating..." : "Activate"}
            </Button>
          )}
        </div>
      </div>

      {/* Activate Confirmation Dialog */}
      <AlertDialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate the subscription "{subscription.name}"? This action will make the subscription active and available to users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <button 
              onClick={handleConfirmActivate} 
              disabled={isActivating}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isActivating ? "Activating..." : "Yes, Activate"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
