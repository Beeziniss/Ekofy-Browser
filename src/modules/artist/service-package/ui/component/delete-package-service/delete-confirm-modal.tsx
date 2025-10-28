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

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  action?: 'delete' | 'enable' | 'disable';
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  action = 'delete',
}) => {
  const getActionText = () => {
    switch (action) {
      case 'enable':
        return {
          title: title || 'Do you really want to enable this package?',
          description: description || 'This action will make the package available for purchase.',
          confirmText: 'Enable',
          confirmClass: 'bg-green-600 hover:bg-green-700',
        };
      case 'disable':
        return {
          title: title || 'Do you really want to disable this package?',
          description: description || 'This action will make the package unavailable for purchase.',
          confirmText: 'Disable',
          confirmClass: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'delete':
      default:
        return {
          title: title || 'Do you really want to delete this package?',
          description: description || 'This action cannot be undone. This will permanently delete the package.',
          confirmText: 'Delete',
          confirmClass: 'bg-red-600 hover:bg-red-700',
        };
    }
  };

  const actionConfig = getActionText();

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">?</span>
            </div>
            <span>{actionConfig.title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            {actionConfig.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onCancel}
            className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={`text-white ${actionConfig.confirmClass} border-0`}
          >
            {actionConfig.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmModal;