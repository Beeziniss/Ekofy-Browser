import React from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrackUploadProgressProps {
  progress: number;
  stepDescription?: string;
  isCompleted?: boolean;
  error?: string | null;
  isConnected?: boolean;
  className?: string;
}

export const TrackUploadProgress: React.FC<TrackUploadProgressProps> = ({
  progress,
  stepDescription,
  isCompleted = false,
  error = null,
  isConnected = false,
  className,
}) => {
  const getStatusIcon = () => {
    if (error) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (isCompleted) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (progress > 0 && isConnected) {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
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
    if (stepDescription) {
      return stepDescription;
    }
    return "Preparing upload...";
  };

  return (
    <div className={cn("w-full space-y-4 rounded-lg border p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Track Upload Progress</h3>
        {getStatusIcon()}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Status Description */}
      <div className="space-y-2">
        <p className={cn("text-sm", error ? "text-red-600" : isCompleted ? "text-green-600" : "text-muted-foreground")}>
          {getStatusText()}
        </p>

        {/* Connection Status */}
        {/* <div className="flex items-center gap-2 text-xs">
          <div className={cn("h-2 w-2 rounded-full", isConnected ? "bg-green-400" : "bg-red-400")} />
          <span className="text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
        </div> */}
      </div>
    </div>
  );
};
