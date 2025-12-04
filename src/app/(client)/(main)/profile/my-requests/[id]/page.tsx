import { requestOptions } from "@/gql/options/listener-request-options";
import RequestDetailSection from "@/modules/client/profile/ui/sections/my-requests/request-detail-section";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{ id: string }>;
}

const RequestDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(requestOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RequestDetailSection requestId={id} />
    </HydrationBoundary>
  );
};

export default RequestDetailPage;
