"use client";

import { useAuthStore } from "@/store";
import { useAuthDialog } from "../ui/context/auth-dialog-context";

export const useSearchAuth = () => {
  const { isAuthenticated } = useAuthStore();
  const { showAuthDialog } = useAuthDialog();

  const executeWithAuth = (
    action: () => void,
    warningType: "play" | "favorite" | "comment" | "follow" | "playlist" = "play",
    trackName?: string,
  ) => {
    if (!isAuthenticated) {
      showAuthDialog(warningType, trackName);
      return;
    }

    action();
  };

  return {
    executeWithAuth,
    isAuthenticated,
  };
};
