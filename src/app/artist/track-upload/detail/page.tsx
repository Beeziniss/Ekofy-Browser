import TrackUploadMetadataSection from "@/modules/artist/track-upload/ui/sections/track-upload-metadata-section";

const Page = () => {
  return (
    <div className="w-full">
      {/* Track Metadata Section */}
      <TrackUploadMetadataSection />

      {/* File Details Section */}
      {/* <Card className="border-white/20 bg-gray-900/50">
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
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default Page;
