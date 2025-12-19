"use client";

import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Loader2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTrackUploadProgress } from "@/hooks/use-track-upload-progress";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export const TrackUploadPopup: React.FC = () => {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { progress, isCompleted, isConnected, error, startConnection, stopConnection, resetProgress } =
    useTrackUploadProgress();

  // Auto-connect when component mounts
  useEffect(() => {
    startConnection();

    return () => {
      stopConnection();
    };
  }, [startConnection, stopConnection]);

  const handleClose = async () => {
    await stopConnection();
    resetProgress();
    setIsVisible(false);
    setIsMinimized(false);
  };

  // Show popup when progress starts
  useEffect(() => {
    if (progress && progress.percent > 0) {
      setIsVisible(true);
    }
  }, [progress]);

  // Handle completion
  useEffect(() => {
    if (isCompleted) {
      // Invalidate moderator tracks query
      queryClient.invalidateQueries({ queryKey: ["moderator-pending-tracks"] });

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted, queryClient]);

  // Don't show if not visible or if there's no progress and not completed
  if (!isVisible || (!progress && !isCompleted && !error)) {
    return null;
  }

  const getStatusIcon = () => {
    if (error) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (isCompleted) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (progress && progress.percent > 0 && isConnected) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    return null;
  };

  const getStatusText = () => {
    if (error) {
      return `Error: ${error}`;
    }
    if (isCompleted) {
      return "Upload completed successfully!";
    }
    if (progress?.stepDescription) {
      return progress.stepDescription;
    }
    return "Preparing upload...";
  };

  const progressValue = progress?.percent || 0;

  return (
    <div
      className={cn(
        "bg-background fixed right-6 bottom-6 z-[9999] w-96 rounded-lg border shadow-2xl transition-all duration-300",
        isMinimized ? "h-16" : "h-auto",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-semibold">{isCompleted ? "Upload Complete" : "Uploading Track"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-7 w-7 p-0">
            <Minimize2 className="h-3.5 w-3.5" />
          </Button>
          {/* <Button variant="ghost" size="sm" onClick={handleClose} className="h-7 w-7 p-0">
            <X className="h-3.5 w-3.5" />
          </Button> */}
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="space-y-3 p-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progressValue)}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>

          {/* Status Description */}
          <p
            className={cn("text-xs", error ? "text-red-600" : isCompleted ? "text-green-600" : "text-muted-foreground")}
          >
            {getStatusText()}
          </p>

          {/* Connection Status Indicator */}
          {/* <div className="flex items-center gap-2 text-xs">
            <div className={cn("h-1.5 w-1.5 rounded-full", isConnected ? "bg-green-400" : "bg-red-400")} />
            <span className="text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
          </div> */}
        </div>
      )}
    </div>
  );
};
