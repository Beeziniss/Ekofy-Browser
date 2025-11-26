import { categoriesOptions } from "@/gql/options/artist-options";
import TrackUploadMetadataSection from "@/modules/artist/track-upload/ui/sections/track-upload-metadata-section";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const Page = () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(categoriesOptions);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full">
        {/* Track Metadata Section */}
        <TrackUploadMetadataSection />

        {/* File Details Section */}
        {/* <TrackUploadFileDetailsSection /> */}
      </div>
    </HydrationBoundary>
  );
};

export default Page;
