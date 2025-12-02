"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { RoyaltyPoliciesQuery } from "@/gql/graphql";
import { useDowngradeRoyaltyPolicyVersionMutation } from "@/gql/client-mutation-options/royalty-policies-mutation";
import {
  getCurrentActiveVersion,
  getDowngradeAvailableVersions,
} from "@/gql/options/royalty-policies-options";

type RoyaltyPolicy = NonNullable<
  NonNullable<RoyaltyPoliciesQuery["royaltyPolicies"]>["items"]
>[number];

interface DowngradeVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  availablePolicies: RoyaltyPolicy[];
}

export function DowngradeVersionDialog({
  open,
  onOpenChange,
  onSuccess,
  availablePolicies,
}: DowngradeVersionDialogProps) {
  const [version, setVersion] = useState("");

  const downgradeMutation = useDowngradeRoyaltyPolicyVersionMutation();

  // Use helper functions from gql/options
  const availableVersions = getDowngradeAvailableVersions(availablePolicies);
  const currentVersion = getCurrentActiveVersion(availablePolicies);

  const handleSubmit = () => {
    if (version) {
      const versionNum = Number(version);

      // Validate version is not greater than or equal to current version
      if (currentVersion !== null && versionNum >= currentVersion) {
        toast.error(`Cannot downgrade to version ${version}. You can only downgrade to versions lower than the current version (v${currentVersion}).`);
        return;
      }

      // Validate version exists in available inactive policies
      if (!availableVersions.includes(versionNum)) {
        toast.error(`Version ${version} is not available for downgrade. Please select from available versions.`);
        return;
      }
    }

    downgradeMutation.mutate(version ? Number(version) : undefined, {
      onSuccess: () => {
        setVersion("");
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Downgrade Policy Version
          </DialogTitle>
          <DialogDescription>
            {currentVersion !== null && (
              <span className="block mb-2 font-medium text-foreground">
                Current Version: <span className="text-primary">v{currentVersion}</span>
              </span>
            )}
            Downgrade to a previous policy version. Leave empty to automatically downgrade
            to the previous version.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="version">Version Number (Optional)</Label>
            <Input
              id="version"
              type="number"
              placeholder="Enter version number"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              disabled={downgradeMutation.isPending}
            />
            <p className="text-muted-foreground text-sm">
              Leave empty to downgrade to the previous version automatically
            </p>
          </div>

          {availableVersions.length > 0 && (
            <div className="bg-muted rounded-md p-4">
              <p className="text-sm font-medium mb-2">Available Versions:</p>
              <div className="flex flex-wrap gap-2">
                {availableVersions.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVersion(v.toString())}
                    className="bg-background hover:bg-accent rounded px-3 py-1 text-sm transition-colors"
                    disabled={downgradeMutation.isPending}
                  >
                    v{v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-yellow-500/10 border-yellow-500/20 rounded-md border p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-500">
              <strong>Warning:</strong> Downgrading will affect all future transactions.
              Make sure you understand the implications before proceeding.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={downgradeMutation.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={downgradeMutation.isPending} variant="destructive">
            {downgradeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Downgrade Version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
