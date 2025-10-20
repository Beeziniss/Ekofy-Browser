"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTrackUploadStore } from "@/store";
import { X, CirclePlay } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const TrackUploadHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUpload, clearAllTracks, startUpload } = useTrackUploadStore();

  const handleGoBackToArtistStudioTracks = () => {
    clearAllTracks(); // Clear all tracks when leaving the upload flow
    router.push("/artist/studio/tracks");
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Clear any existing tracks and start new upload
        clearAllTracks();
        startUpload(file);
        // Navigate to detail page if not already there
        if (pathname !== "/artist/track-upload/detail") {
          router.push("/artist/track-upload/detail");
        }
      }
    },
    [startUpload, router, pathname, clearAllTracks],
  );

  const { getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/mp3": [".mp3"],
    },
    multiple: false,
    noClick: true,
    noDrag: true, // We only want the file picker functionality
  });

  const handleReplaceTrack = () => {
    open();
  };

  return (
    <header className="bg-main-dark-bg fixed top-0 flex w-full items-center justify-between px-6 py-3">
      <div className="flex items-center gap-x-2">
        <Image
          src={"/ekofy-logo-xs.svg"}
          alt="Ekofy Logo"
          width={32}
          height={32}
        />

        <div className="primary_gradient flex h-6 items-center gap-x-2 bg-clip-text text-transparent">
          <span className="text-lg font-bold">
            Ekofy | Track{" "}
            {pathname === "/artist/track-upload" ? "Upload" : "Detail"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-x-3">
        {/* Track Info and Progress Section - Show when there's a track */}
        {currentUpload && (
          <div className="flex items-center gap-2">
            {/* Track name with icon - always visible */}
            <div className="flex items-center gap-2">
              <CirclePlay className="size-5 text-white" />
              <span className="max-w-48 truncate text-sm font-medium text-white">
                {currentUpload.metadata.fileName}
              </span>
            </div>

            {/* Progress bar and status - only show when uploading */}
            {currentUpload.progress.status === "uploading" && (
              <>
                <div className="flex w-full items-center gap-2">
                  <Progress
                    value={currentUpload.progress.percentage}
                    className="h-2 w-32"
                  />
                  <span className="min-w-fit text-xs text-white">
                    {currentUpload.progress.percentage}%
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {currentUpload.progress.status.toUpperCase()}
                </Badge>
              </>
            )}
          </div>
        )}
        {/* Replace Track button - show when there's a track */}
        {currentUpload && (
          <>
            <input {...getInputProps()} />
            <button
              onClick={handleReplaceTrack}
              className="cursor-pointer text-sm text-white/70 transition-colors hover:text-white"
            >
              Replace Track
            </button>
          </>
        )}

        <Button
          onClick={handleGoBackToArtistStudioTracks}
          className="bg-main-grey-dark-bg group hover:bg-main-grey-dark-bg/90 size-10 rounded-full"
        >
          <X className="text-main-grey-dark group-hover:text-main-grey size-6" />
        </Button>
      </div>
    </header>
  );
};

export default TrackUploadHeader;
