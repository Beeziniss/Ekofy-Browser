"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useLinkGoogleAccount from "../../hooks/use-link-google-account";

interface LinkGoogleAccountDialogProps {
  children: React.ReactNode;
}

const LinkGoogleAccountDialog = ({ children }: LinkGoogleAccountDialogProps) => {
  const { linkGoogleAccount, isLoading } = useLinkGoogleAccount();
  const [open, setOpen] = useState(false);

  const handleLinkGoogle = () => {
    linkGoogleAccount();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Link Google Account</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to link your account with Google? This will allow you to sign in with Google in the future.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <button 
            onClick={handleLinkGoogle} 
            disabled={isLoading} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Linking...
              </>
            ) : (
              "Link Account"
            )}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LinkGoogleAccountDialog;
