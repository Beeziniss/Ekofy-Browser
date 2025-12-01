"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTrackUploadProgress } from "@/hooks/use-track-upload-progress";
import { TrackUploadProgress } from "@/components/track-upload-progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { EkofyLogoXs } from "@/assets/icons";
import TrackUploadSuccessDialog from "@/components/track-upload-success-dialog";

const Page = () => {
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const {
    progress: signalRProgress,
    isCompleted: signalRCompleted,
    isConnected,
    error: signalRError,
    startConnection,
    stopConnection,
    resetProgress,
  } = useTrackUploadProgress();

  // Auto-connect when component mounts
  useEffect(() => {
    startConnection();

    // Cleanup on unmount
    return () => {
      stopConnection();
    };
  }, [startConnection, stopConnection]);

  // Show success dialog when upload is completed
  useEffect(() => {
    if (signalRCompleted) {
      // Add a small delay to show the 100% completion before showing dialog
      const timer = setTimeout(() => {
        setShowSuccessDialog(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [signalRCompleted]);

  const handleCancel = async () => {
    await stopConnection();
    resetProgress();
    router.push("/artist/studio/tracks");
  };

  return (
    <div className="relative w-full">
      <header className="bg-main-dark-bg fixed top-0 z-1000 flex w-full items-center justify-between px-6 py-3">
        <div className="flex items-center gap-x-2 select-none">
          <EkofyLogoXs className="size-8" />

          <div className="primary_gradient flex h-6 items-center gap-x-2 bg-clip-text text-transparent">
            <span className="text-lg font-bold">Ekofy | Track Uploading</span>
          </div>
        </div>

        <Button
          onClick={handleCancel}
          className="bg-main-grey-dark-bg group hover:bg-main-grey-dark-bg/90 z-10 size-10 rounded-full"
        >
          <X className="text-main-grey-dark group-hover:text-main-grey size-6" />
        </Button>
      </header>

      <div className="container mx-auto max-w-6xl py-20">
        <div className="space-y-6">
          <h1 className="mb-2 text-3xl font-bold">Uploading Track</h1>
          <p className="text-muted-foreground">Please wait while your track is being processed.</p>

          {/* Progress Component */}
          <TrackUploadProgress
            progress={signalRProgress?.percent || 0}
            stepDescription={signalRProgress?.stepDescription}
            isCompleted={signalRCompleted}
            error={signalRError}
            isConnected={isConnected}
          />
        </div>
      </div>

      {/* Success Dialog */}
      <TrackUploadSuccessDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog} />
    </div>
  );
};

export default Page;
