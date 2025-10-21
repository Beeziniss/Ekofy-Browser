import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Check, X } from 'lucide-react';

interface ApprovalConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  action: 'approve' | 'reject';
  packageName?: string;
  isLoading?: boolean;
}

const ApprovalConfirmDialog: React.FC<ApprovalConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  action,
  packageName = 'this package',
  isLoading = false,
}) => {
  const isApprove = action === 'approve';

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent className="bg-gray-800 border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center">
            {isApprove ? (
              <Check className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <X className="h-5 w-5 text-red-500 mr-2" />
            )}
            {isApprove ? 'Approve' : 'Reject'} Service Package
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to {action} <span className="font-medium text-white">&ldquo;{packageName}&rdquo;</span>?
            {isApprove ? (
              <span className="block mt-2 text-green-400">
                This will make the package available to listeners and allow the artist to start receiving orders.
              </span>
            ) : (
              <span className="block mt-2 text-red-400">
                This will reject the package and it will not be available to listeners. The artist will be notified.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:text-white"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={isApprove 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-red-600 hover:bg-red-700 text-white"
            }
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isApprove ? 'Approving...' : 'Rejecting...'}
              </div>
            ) : (
              <>
                {isApprove ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                {isApprove ? 'Approve' : 'Reject'}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApprovalConfirmDialog;