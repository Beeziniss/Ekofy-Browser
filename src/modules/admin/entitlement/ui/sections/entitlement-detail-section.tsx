"use client";

import { useState } from "react";
import { EntitlementDetailHeader } from "../components/entitlement-detail-header";
import { EntitlementDetailCard } from "../components/entitlement-detail-card";
import { useEntitlementDetail } from "../../hooks";
import { useDeactivateEntitlementMutation, useReactivateEntitlementMutation } from "@/gql/client-mutation-options/entitlements-mutation-options";
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

interface EntitlementDetailSectionProps {
  entitlementId: string;
}

export function EntitlementDetailSection({ entitlementId }: EntitlementDetailSectionProps) {
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"deactivate" | "reactivate" | null>(null);
  
  const { entitlement, isLoading, refetch } = useEntitlementDetail(entitlementId);
  const deactivateMutation = useDeactivateEntitlementMutation();
  const reactivateMutation = useReactivateEntitlementMutation();

  const handleDeactivate = () => {
    if (entitlement) {
      setActionType("deactivate");
      setActionDialogOpen(true);
    }
  };

  const handleReactivate = () => {
    if (entitlement) {
      setActionType("reactivate");
      setActionDialogOpen(true);
    }
  };

  const handleActionConfirm = () => {
    if (entitlement && actionType) {
      if (actionType === "deactivate") {
        deactivateMutation.mutate(entitlement.code, {
          onSuccess: () => {
            refetch();
            setActionDialogOpen(false);
            setActionType(null);
          },
        });
      } else {
        reactivateMutation.mutate(entitlement.code, {
          onSuccess: () => {
            refetch();
            setActionDialogOpen(false);
            setActionType(null);
          },
        });
      }
    }
  };

  return (
    <>
      <div className="space-y-6">
        <EntitlementDetailHeader
          isActive={entitlement?.isActive}
          onDeactivate={handleDeactivate}
          onReactivate={handleReactivate}
        />
        <EntitlementDetailCard entitlement={entitlement} isLoading={isLoading} />
      </div>

      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "deactivate"
                ? `This will deactivate the entitlement "${entitlement?.name}". Users will no longer have access to this feature.`
                : `This will reactivate the entitlement "${entitlement?.name}". Users will regain access to this feature.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActionConfirm}
              className={actionType === "deactivate" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {actionType === "deactivate" ? "Deactivate" : "Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

