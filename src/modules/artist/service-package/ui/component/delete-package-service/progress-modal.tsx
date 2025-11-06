"use client";

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

interface ProgressModalProps {
  isOpen: boolean;
  onIgnore: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onIgnore,
  onCancel,
  title = "This package is in confirmation progress!",
  description = "The package is currently being processed. Please wait for completion.",
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="border-gray-700 bg-gray-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <span className="font-bold text-white">!</span>
            </div>
            <span>{title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onIgnore}
            className="border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
          >
            Ignore
          </AlertDialogCancel>
          <AlertDialogAction onClick={onCancel} className="border-0 bg-red-600 text-white hover:bg-red-700">
            Cancel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProgressModal;
