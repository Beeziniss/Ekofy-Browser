import { servicePackageOptions, servicePackageReviewOptions } from "@/gql/options/client-options";
import ServicePackageView from "@/modules/client/service-package/ui/views/service-package-view";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{ serviceId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { serviceId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(servicePackageOptions({ serviceId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServicePackageView serviceId={serviceId} />
    </HydrationBoundary>
  );
};

export default Page;
