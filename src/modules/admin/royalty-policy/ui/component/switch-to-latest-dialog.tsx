"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSwitchToLatestVersionMutation } from "@/gql/client-mutation-options/royalty-policies-mutation";

interface SwitchToLatestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SwitchToLatestDialog({
  open,
  onOpenChange,
  onSuccess,
}: SwitchToLatestDialogProps) {
  const switchMutation = useSwitchToLatestVersionMutation();

  const handleConfirm = () => {
    switchMutation.mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Switch to Latest Version</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to switch to the latest policy version? This will affect
            all future transactions and cannot be undone automatically.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={switchMutation.isPending}>Cancel</AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={switchMutation.isPending} className="bg-green-500 hover:bg-green-600 text-white">
            {switchMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
