"use client";

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
  title = 'This package is in confirmation progress!',
  description = 'The package is currently being processed. Please wait for completion.',
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">!</span>
            </div>
            <span>{title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onIgnore}
            className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
          >
            Ignore
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onCancel}
            className="bg-red-600 hover:bg-red-700 text-white border-0"
          >
            Cancel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProgressModal;