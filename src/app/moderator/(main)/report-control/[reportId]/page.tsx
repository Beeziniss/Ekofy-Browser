import { ReportDetailView } from "@/modules/moderator/report-control/ui/view/report-detail-view";

interface ReportDetailPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

const ReportDetailPage = async ({ params }: ReportDetailPageProps) => {
  const { reportId } = await params;

  return <ReportDetailView reportId={reportId} />;
};

export default ReportDetailPage;
