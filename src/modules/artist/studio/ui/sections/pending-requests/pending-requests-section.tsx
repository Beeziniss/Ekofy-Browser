"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PendingRequestsTableWrapper from "../../components/pending-requests-table/pending-requests-table-wrapper";
import { trackUploadPendingRequestOptions } from "@/gql/options/artist-options";
import { useAuthStore } from "@/store";

const PendingRequestsSection = () => {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const { data } = useSuspenseQuery(
    trackUploadPendingRequestOptions({
      pageNumber: currentPage,
      pageSize: pageSize,
      userId: user?.userId,
    }),
  );

  // Filter data based on search query (client-side filtering for now)
  const filteredData = searchQuery.trim()
    ? data.pendingTrackUploadRequests?.items?.filter(
        (request) =>
          request.track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.mainArtists?.items?.some((artist) =>
            artist.stageName.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      ) || []
    : data.pendingTrackUploadRequests?.items || [];

  return (
    <div className="space-y-6">
      {data.pendingTrackUploadRequests && (
        <PendingRequestsTableWrapper
          data={filteredData}
          totalCount={data.pendingTrackUploadRequests.totalCount || 0}
          pageSize={pageSize}
        />
      )}

      {(!data.pendingTrackUploadRequests?.items || data.pendingTrackUploadRequests.items.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-main-white mb-2 text-lg font-semibold">No Pending Requests</h3>
            <p className="text-main-grey">You don&apos;t have any pending track upload requests at the moment.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRequestsSection;
