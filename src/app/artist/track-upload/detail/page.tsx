"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrackUploadStore } from "@/store";
import { useRouter } from "next/navigation";
import { Music, FileAudio, Clock, HardDrive } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const { currentUpload, uploadedTracks } = useTrackUploadStore();
  const [displayTrack, setDisplayTrack] = useState(currentUpload);

  useEffect(() => {
    // If there's a current upload, show it
    if (currentUpload) {
      setDisplayTrack(currentUpload);
    }
    // Otherwise, show the most recent uploaded track
    else if (uploadedTracks.length > 0) {
      setDisplayTrack(uploadedTracks[uploadedTracks.length - 1]);
    }
  }, [currentUpload, uploadedTracks]);

  if (!displayTrack) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-white/20 bg-gray-900/50">
          <CardContent className="p-8 text-center">
            <FileAudio className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-white/70">
              No track found. Please upload a track first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Track Metadata Section */}
      <Card className="border-white/20 bg-gray-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Music className="h-5 w-5" />
            Track Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-white/70">Title</label>
              <p className="font-medium text-white">
                {displayTrack.metadata.title || "Unknown Title"}
              </p>
            </div>

            <div>
              <label className="text-sm text-white/70">Artist</label>
              <p className="font-medium text-white">
                {displayTrack.metadata.artist || "Unknown Artist"}
              </p>
            </div>

            <div>
              <label className="text-sm text-white/70">Album</label>
              <p className="font-medium text-white">
                {displayTrack.metadata.album || "Unknown Album"}
              </p>
            </div>

            <div>
              <label className="text-sm text-white/70">Genre</label>
              <p className="font-medium text-white">
                {displayTrack.metadata.genre || "Unknown Genre"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Details Section */}
      <Card className="border-white/20 bg-gray-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <HardDrive className="h-5 w-5" />
            File Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-white/70">File Name</label>
              <p className="font-medium break-all text-white">
                {displayTrack.metadata.fileName}
              </p>
            </div>

            <div>
              <label className="text-sm text-white/70">File Type</label>
              <p className="font-medium text-white">
                {displayTrack.metadata.fileType || "Unknown"}
              </p>
            </div>

            <div>
              <label className="text-sm text-white/70">File Size</label>
              <p className="font-medium text-white">
                {formatFileSize(displayTrack.metadata.fileSize)}
              </p>
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm text-white/70">
                <Clock className="h-3 w-3" />
                Duration
              </label>
              <p className="font-medium text-white">
                {formatDuration(displayTrack.metadata.duration)}
              </p>
            </div>

            <div>
              <label className="text-sm text-white/70">Upload Date</label>
              <p className="font-medium text-white">
                {new Date(displayTrack.uploadedAt).toLocaleString()}
              </p>
            </div>

            {displayTrack.metadata.year && (
              <div>
                <label className="text-sm text-white/70">Year</label>
                <p className="font-medium text-white">
                  {displayTrack.metadata.year}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {displayTrack.progress.status === "completed" && (
        <div className="flex gap-4">
          <Button
            onClick={() => router.push("/artist/track-upload")}
            className="primary_gradient text-white hover:brightness-90"
          >
            Upload Another Track
          </Button>

          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Edit Track Info
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
