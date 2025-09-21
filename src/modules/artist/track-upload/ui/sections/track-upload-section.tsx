"use client";

import { Button } from "@/components/ui/button";
import { useTrackUploadStore } from "@/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const TrackUploadSection = () => {
  const router = useRouter();
  const { startUpload, isUploading, currentUpload, clearAllTracks } =
    useTrackUploadStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Clear any existing tracks to ensure only 1 MP3 at a time
        clearAllTracks();
        await startUpload(file);
        // Navigate to detail page after starting upload
        router.push("/artist/track-upload/detail");
      }
    },
    [startUpload, router, clearAllTracks],
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
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center rounded-md border border-dashed py-[70px] transition-colors duration-200 ${
        isDragActive ? "border-blue-400 bg-blue-50/10" : "border-white/30"
      }`}
    >
      <input {...getInputProps()} />

      <Image
        src={"/track-upload-cloud.svg"}
        alt="Track Upload Cloud"
        width={70}
        height={70}
        className={`transition-opacity duration-200 ${
          isDragActive ? "opacity-70" : "opacity-100"
        }`}
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
  );
};

export default TrackUploadSection;
