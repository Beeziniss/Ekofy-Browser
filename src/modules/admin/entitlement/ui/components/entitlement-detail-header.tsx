"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft} from "lucide-react";
import { useRouter } from "next/navigation";

interface EntitlementDetailHeaderProps {
  isActive?: boolean;
  onDeactivate?: () => void;
  onReactivate?: () => void;
}

export function EntitlementDetailHeader({
  isActive,
  onDeactivate,
  onReactivate,
}: EntitlementDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Entitlement Details</h1>
        <p className="text-muted-foreground">
          View and manage entitlement information
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          Back to Entitlements List
        </Button>
        <div className="flex gap-2">
          {isActive ? (
            <Button variant="destructive" onClick={onDeactivate}>
              Deactivate
            </Button>
          ) : (
            <Button variant="default" onClick={onReactivate}>
              Reactivate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

