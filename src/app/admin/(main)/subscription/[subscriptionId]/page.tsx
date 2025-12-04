import { notFound } from "next/navigation";
import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AdminSubscriptionDetail } from "@/modules/admin/subscription/ui/view";
import { subscriptionDetailQueryOptions, subscriptionPlansQueryOptions } from "@/gql/options/subscription-options";

interface SubscriptionDetailPageProps {
  params: Promise<{
    subscriptionId: string;
  }>;
}

const SubscriptionDetailPage = async ({ params }: SubscriptionDetailPageProps) => {
  const { subscriptionId } = await params;

  if (!subscriptionId) {
    notFound();
  }

  const queryClient = getQueryClient();

  // Prefetch subscription details and related plans
  await queryClient.prefetchQuery(subscriptionDetailQueryOptions(subscriptionId));
  await queryClient.prefetchQuery(subscriptionPlansQueryOptions(0, 10, subscriptionId, ""));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminSubscriptionDetail subscriptionId={subscriptionId} />
    </HydrationBoundary>
  );
};

export default SubscriptionDetailPage;
