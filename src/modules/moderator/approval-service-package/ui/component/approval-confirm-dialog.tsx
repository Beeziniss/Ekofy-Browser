import React from "react";
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
import { Check, X } from "lucide-react";

interface ApprovalConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  action: "approve" | "reject";
  packageName?: string;
  isLoading?: boolean;
}

const ApprovalConfirmDialog: React.FC<ApprovalConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  action,
  packageName = "this package",
  isLoading = false,
}) => {
  const isApprove = action === "approve";

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent className="border-gray-700 bg-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-white">
            {isApprove ? (
              <Check className="mr-2 h-5 w-5 text-green-500" />
            ) : (
              <X className="mr-2 h-5 w-5 text-red-500" />
            )}
            {isApprove ? "Approve" : "Reject"} Service Package
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to {action}{" "}
            <span className="font-medium text-white">&ldquo;{packageName}&rdquo;</span>?
            {isApprove ? (
              <span className="mt-2 block text-green-400">
                This will make the package available to listeners and allow the artist to start receiving orders.
              </span>
            ) : (
              <span className="mt-2 block text-red-400">
                This will reject the package and it will not be available to listeners. The artist will be notified.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="border-gray-600 text-gray-300 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={
              isApprove ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700"
            }
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                {isApprove ? "Approving..." : "Rejecting..."}
              </div>
            ) : (
              <>
                {isApprove ? <Check className="mr-2 h-4 w-4" /> : <X className="mr-2 h-4 w-4" />}
                {isApprove ? "Approve" : "Reject"}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApprovalConfirmDialog;
