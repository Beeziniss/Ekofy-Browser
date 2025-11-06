"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserStatus } from "@/gql/graphql";

interface ModeratorStatusConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  userFullName: string;
  action: UserStatus;
}

export function ModeratorStatusConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  userFullName,
  action,
}: ModeratorStatusConfirmModalProps) {
  const isDeactivating = action === UserStatus.Banned;
  const actionText = isDeactivating ? "ban" : "reactivate";
  const actionColor = isDeactivating ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-gray-700 bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{isDeactivating ? "Ban User" : "Reactivate User"}</DialogTitle>
          <DialogDescription className="text-gray-300">
            Are you sure you want to {actionText} this user?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-300">
            You are about to {actionText} <span className="font-semibold text-white">{userFullName}</span>.
            {isDeactivating
              ? " This will prevent them from accessing their account and using the platform."
              : " This will restore their access to the platform."}
          </p>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className={`${actionColor} text-white`}>
            {isLoading
              ? isDeactivating
                ? "Banning..."
                : "Reactivating..."
              : isDeactivating
                ? "Ban User"
                : "Reactivate User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
