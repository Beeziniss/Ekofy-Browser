import React from "react";
import TrackUploadSection from "../sections/track-upload-section";

const TrackUploadView = () => {
  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <h1 className="font-poppins text-3xl font-bold">
        Upload your audio files
      </h1>
      <p className="text-main-white mt-6 mb-10 text-sm">
        For best quality, use WAV, FLAC, AIFF, or ALAC. The maximum file size is
        ??MB.
      </p>

      <TrackUploadSection />
    </div>
  );
};

export default TrackUploadView;
