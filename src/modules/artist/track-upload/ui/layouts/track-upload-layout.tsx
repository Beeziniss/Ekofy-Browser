"use client";

import TrackUploadFooter from "../components/track-upload-footer";
import TrackUploadHeader from "../components/track-upload-header";
import { useTrackUploadStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { trackUploadMutationOptions } from "@/gql/options/artist-mutation-options";

interface TrackUploadLayoutProps {
  children: React.ReactNode;
}

const TrackUploadLayout = ({ children }: TrackUploadLayoutProps) => {
  const isUploading = useTrackUploadStore((state) => state.isUploading);
  const uploadTrackMutation = useMutation(trackUploadMutationOptions);

  // Check if we should show loading overlay
  const showLoadingOverlay = isUploading || uploadTrackMutation.isPending;

  return (
    <div className="bg-main-dark-bg relative min-h-screen w-full">
      <TrackUploadHeader />
      <main className="mx-auto w-full max-w-[1240px] pt-16 pb-32">{children}</main>
      <TrackUploadFooter />

      {/* Global Loading Overlay */}
      {showLoadingOverlay && (
        <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm">
          <div className="loader"></div>
          <div className="text-2xl text-white">Your upload is in progress... Please wait</div>
        </div>
      )}
    </div>
  );
};

export default TrackUploadLayout;
