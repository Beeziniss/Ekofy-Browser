"use client";

import React, { useEffect, useState } from "react";
import { useTrackUploadProgress } from "@/hooks/use-track-upload-progress";
import { TrackUploadProgress } from "@/components/track-upload-progress";
import { SimulatedUploadTest } from "@/components/simulated-upload-test";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Page = () => {
  const [manualProgress, setManualProgress] = useState<{ percent: number; stepDescription: string } | null>(null);
  const [manualCompleted, setManualCompleted] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  const {
    progress: signalRProgress,
    isCompleted: signalRCompleted,
    isConnected,
    error: signalRError,
    startConnection,
    stopConnection,
    resetProgress,
  } = useTrackUploadProgress();

  // Determine which progress to show (SignalR takes priority)
  const currentProgress = signalRProgress || manualProgress;
  const currentCompleted = signalRCompleted || manualCompleted;
  const currentError = signalRError || manualError;

  // Auto-connect when component mounts
  useEffect(() => {
    startConnection();

    // Cleanup on unmount
    return () => {
      stopConnection();
    };
  }, [startConnection, stopConnection]);

  const handleReset = () => {
    resetProgress();
    setManualProgress(null);
    setManualCompleted(false);
    setManualError(null);
  };

  const handleReconnect = async () => {
    await stopConnection();
    await startConnection();
  };

  const handleManualProgressUpdate = (percent: number, stepDescription: string) => {
    setManualProgress({ percent, stepDescription });
    setManualCompleted(false);
    setManualError(null);
  };

  const handleManualCompleted = () => {
    setManualCompleted(true);
    setManualError(null);
  };

  const handleManualFailed = (errorMessage: string) => {
    setManualError(errorMessage);
    setManualCompleted(false);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold">Artist Studio</h1>
          <p className="text-muted-foreground">Track your upload progress in real-time</p>
        </div>

        {/* Progress Component */}
        {(currentProgress || currentCompleted || currentError) && (
          <TrackUploadProgress
            progress={currentProgress?.percent || 0}
            stepDescription={currentProgress?.stepDescription}
            isCompleted={currentCompleted}
            error={currentError}
            isConnected={isConnected}
            className="mx-auto max-w-2xl"
          />
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={!currentProgress && !currentCompleted && !currentError}
          >
            Reset Progress
          </Button>
          <Button onClick={handleReconnect} variant={isConnected ? "outline" : "default"}>
            {isConnected ? "Reconnect" : "Connect to Hub"}
          </Button>
        </div>

        <Separator />

        {/* Test Component for Development */}
        <div className="space-y-4">
          <h2 className="text-center text-xl font-semibold">Development Testing</h2>
          <p className="text-muted-foreground text-center text-sm">
            Use these controls to test the progress bar without a real SignalR backend
          </p>
          <SimulatedUploadTest
            onProgressUpdate={handleManualProgressUpdate}
            onCompleted={handleManualCompleted}
            onFailed={handleManualFailed}
          />
        </div>

        {/* Connection Status Info */}
        <div className="bg-muted/50 mx-auto max-w-2xl space-y-2 rounded-lg p-4 text-sm">
          <h3 className="font-semibold">SignalR Connection Status:</h3>
          <p>
            Status:{" "}
            <span className={isConnected ? "text-green-600" : "text-red-600"}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </p>
          <p className="text-muted-foreground">
            The progress bar will update automatically when your backend sends upload progress events.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
