import { useState } from "react";
import { useAuthStore } from "@/store";

export const useAuthAction = () => {
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningAction, setWarningAction] = useState<"play" | "favorite" | "comment" | "follow" | "playlist">("play");
  const [trackName, setTrackName] = useState<string | undefined>();
  const { isAuthenticated } = useAuthStore();

  const executeWithAuth = (
    action: () => void,
    warningType: "play" | "favorite" | "comment" | "follow" | "playlist" = "play",
    trackName?: string,
  ) => {
    if (!isAuthenticated) {
      setWarningAction(warningType);
      setTrackName(trackName);
      setShowWarningDialog(true);
      return;
    }

    action();
  };

  return {
    showWarningDialog,
    setShowWarningDialog,
    warningAction,
    trackName,
    executeWithAuth,
    isAuthenticated,
  };
};
