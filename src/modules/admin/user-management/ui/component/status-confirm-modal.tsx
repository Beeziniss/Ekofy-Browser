"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserStatus } from "@/gql/graphql";
import { HelpCircle } from "lucide-react";

interface StatusConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  status: UserStatus;
  userName: string;
}

export function StatusConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  status,
  // userName,
}: StatusConfirmModalProps) {
  const isActivating = status === UserStatus.Active;
  const isDeactivating = status === UserStatus.Banned;

  const getTitle = () => {
    if (isActivating) return "Active confirm modal";
    if (isDeactivating) return "Banned confirm modal";
    return "Change confirm modal";
  };

  const getMessage = () => {
    if (isActivating) return "Do you really want to active this account?";
    if (isDeactivating) return "Do you really want to banned this account?";
    return "Do you really want to change role this account?";
  };

  const getConfirmButtonText = () => {
    if (isActivating) return "Active";
    if (isDeactivating) return "Banned";
    return "Confirm";
  };

  const getConfirmButtonStyle = () => {
    if (isActivating) return "bg-green-600 hover:bg-green-700 border-green-600";
    if (isDeactivating) return "bg-red-600 hover:bg-red-700 border-red-600";
    return "bg-blue-600 hover:bg-blue-700 border-blue-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-300 text-center">
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          
          <p className="text-center text-white font-medium">
            {getMessage()}
          </p>
        </div>

        <div className="flex justify-center space-x-4 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`text-white px-8 ${getConfirmButtonStyle()}`}
          >
            {getConfirmButtonText()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}