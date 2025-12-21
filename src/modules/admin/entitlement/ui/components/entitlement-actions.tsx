"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EntitlementActionsProps {
  onCreateEntitlement: () => void;
}

export function EntitlementActions({ onCreateEntitlement }: EntitlementActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Entitlements</h2>
        <p className="text-muted-foreground">
          Manage user entitlements and feature access
        </p>
      </div>
      <Button onClick={onCreateEntitlement}>
        <Plus className="mr-2 h-4 w-4" />
        Create Entitlement
      </Button>
    </div>
  );
}

