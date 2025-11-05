"use client";

import React from 'react';
import { useAuthAction } from '@/hooks/use-auth-action';
import { WarningAuthDialog } from '@/modules/shared/ui/components/warning-auth-dialog';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const {
    showWarningDialog,
    setShowWarningDialog,
    warningAction,
    trackName,
  } = useAuthAction();

  return (
    <>
      {children}
      <WarningAuthDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        action={warningAction}
        trackName={trackName}
      />
    </>
  );
};