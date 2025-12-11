import TrackUploadSection from "../sections/track-upload-section";

const TrackUploadView = () => {
  return (
    <div className="w-full">
      <h1 className="font-poppins text-3xl font-bold">Upload your audio files</h1>
      <p className="text-main-white mt-6 mb-10 text-sm">
        We currently support only MP3 format. The maximum file size is 50MB.
      </p>

      <TrackUploadSection />
    </div>
  );
};

export default TrackUploadView;
