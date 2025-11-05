"use client";

import React, { createContext, useContext, useState } from 'react';
import { WarningAuthDialog } from '@/modules/shared/ui/components/warning-auth-dialog';

interface AuthDialogContextType {
  showAuthDialog: (action: "play" | "favorite" | "comment" | "follow" | "playlist", trackName?: string) => void;
}

const AuthDialogContext = createContext<AuthDialogContextType | null>(null);

export const useAuthDialog = () => {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error('useAuthDialog must be used within AuthDialogProvider');
  }
  return context;
};

interface AuthDialogProviderProps {
  children: React.ReactNode;
}

export const AuthDialogProvider: React.FC<AuthDialogProviderProps> = ({ children }) => {
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningAction, setWarningAction] = useState<"play" | "favorite" | "comment" | "follow" | "playlist">("play");
  const [trackName, setTrackName] = useState<string | undefined>();

  const showAuthDialog = (action: "play" | "favorite" | "comment" | "follow" | "playlist", trackName?: string) => {
    setWarningAction(action);
    setTrackName(trackName);
    setShowWarningDialog(true);
  };

  return (
    <AuthDialogContext.Provider value={{ showAuthDialog }}>
      {children}
      <WarningAuthDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        action={warningAction}
        trackName={trackName}
      />
    </AuthDialogContext.Provider>
  );
};