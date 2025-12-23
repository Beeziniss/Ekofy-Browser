import TrackUploadMetadataSection from "@/modules/artist/track-upload/ui/sections/track-upload-metadata-section";

const Page = async () => {
  return (
    <div className="w-full">
      {/* Track Metadata Section */}
      <TrackUploadMetadataSection />

      {/* File Details Section */}
      {/* <TrackUploadFileDetailsSection /> */}
    </div>
  );
};

export default Page;
