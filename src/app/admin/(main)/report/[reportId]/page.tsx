import { getQueryClient } from "@/providers/get-query-client";
import { reportDetailOptions } from "@/gql/options/report-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ReportDetailView } from "@/modules/admin/report/ui/views/report-detail-view";

interface ReportDetailPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

const AdminReportDetailPage = async ({ params }: ReportDetailPageProps) => {
  const { reportId } = await params;
  const queryClient = getQueryClient();

  // Prefetch report detail
  await queryClient.prefetchQuery(reportDetailOptions(reportId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportDetailView reportId={reportId} />
    </HydrationBoundary>
  );
};

export default AdminReportDetailPage;
