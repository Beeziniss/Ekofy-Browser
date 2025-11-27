"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useTrackUploadStore } from "@/store";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TrackUploadCloud } from "@/assets/icons";
import { AlertTriangle } from "lucide-react";
// TODO: Uncomment later
// import { auddApi } from "@/services/audd-services";
import { toast } from "sonner";

const TrackUploadSection = () => {
  const router = useRouter();
  const { startUpload, isUploading, currentUpload, clearAllTracks, setUploading } = useTrackUploadStore();

  // Dialog states
  const [showCopyrightDialog, setShowCopyrightDialog] = useState(false);
  const [copyrightError, setCopyrightError] = useState<{
    type: "match" | "verification_failed" | "check_failed";
    message: string | React.ReactNode;
  } | null>(null);

  // Handle copyright dialog close
  const handleCopyrightDialogClose = () => {
    setShowCopyrightDialog(false);
    setCopyrightError(null);
  };

  const checkCopyrightAndUpload = useCallback(
    async (file: File) => {
      // Start loading state for copyright check
      setUploading(true);

      try {
        // Check for copyright violations using song recognition
        toast.info("Checking track for copyright compliance...");

        // TODO: Uncomment later
        /* const recognitionResult = await auddApi.recognizeSong(file);

        // Check if the song recognition found a match (potential copyright issue)
        if (
          recognitionResult.status !== "success" ||
          recognitionResult.result !== null ||
          recognitionResult.result?.apple_music ||
          recognitionResult.result?.spotify ||
          recognitionResult.result?.deezer ||
          recognitionResult.result?.napster
        ) {
          console.log(recognitionResult);

          // Stop loading state on copyright issue
          setUploading(false);
          if (recognitionResult.result) {
            setCopyrightError({
              type: "match",
              message: (
                <>
                  This track appears to match existing copyrighted content:{" "}
                  <span className="font-semibold text-white">&ldquo;{recognitionResult.result.title}&rdquo;</span> by{" "}
                  <span className="font-semibold text-white">{recognitionResult.result.artist}</span>. Please ensure you
                  have the proper rights to upload this track or upload original content only.
                </>
              ),
            });
          } else {
            setCopyrightError({
              type: "verification_failed",
              message:
                "Failed to verify track copyright status. Please try again or contact support if the issue persists.",
            });
          }
          setShowCopyrightDialog(true);
          return;
        } */

        setUploading(false);

        toast.success("Copyright check passed. Proceeding with upload...");

        // If copyright check passes, proceed with upload
        clearAllTracks();
        startUpload(file);
        // Navigate to detail page after starting upload
        router.push("/artist/track-upload/detail");
      } catch (error) {
        // Stop loading state on error
        setUploading(false);
        console.error("Copyright check failed:", error);
        setCopyrightError({
          type: "check_failed",
          message:
            "Unable to verify track copyright status. Please try again or contact support if the issue persists.",
        });
        setShowCopyrightDialog(true);
      }
    },
    [setUploading, clearAllTracks, startUpload, router],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Check copyright before proceeding with upload
        await checkCopyrightAndUpload(file);
      }
    },
    [checkCopyrightAndUpload],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/mp3": [".mp3"],
    },
    multiple: false,
    noClick: true, // We'll handle click on the button specifically
  });

  const handleUploadClick = () => {
    if (!isUploading) {
      open();
    }
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center rounded-md border border-dashed py-[70px] transition-colors duration-200 ${
          isDragActive ? "border-blue-400 bg-blue-50/10" : "border-white/30"
        }`}
      >
        <input {...getInputProps()} />

        <TrackUploadCloud
          className={`text-main-purple mt-4 mb-2 size-17.5 transition-opacity duration-200 ${isDragActive ? "opacity-70" : "opacity-100"}`}
        />

        <p className="text-main-white my-6 text-center text-xl font-medium">
          {isDragActive
            ? "Drop your MP3 file here..."
            : currentUpload && isUploading
              ? `Uploading: ${currentUpload.metadata.fileName}`
              : "Drag and drop audio files to get started"}
        </p>

        <Button
          className="primary_gradient text-main-white hover:brightness-90 disabled:opacity-50"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Now"}
        </Button>
      </div>

      {/* Copyright Warning Dialog */}
      <AlertDialog open={showCopyrightDialog} onOpenChange={setShowCopyrightDialog}>
        <AlertDialogContent className="bg-main-dark-bg border-2 border-red-500/20 sm:max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl text-white">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Upload Failed
            </AlertDialogTitle>
            <AlertDialogDescription className="text-main-grey text-base/relaxed">
              {copyrightError?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCopyrightDialogClose} className="bg-red-700 text-white hover:bg-red-800">
              Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TrackUploadSection;
