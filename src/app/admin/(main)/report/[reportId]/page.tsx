import { ReportDetailView } from "@/modules/admin/report/ui/views/report-detail-view";

interface ReportDetailPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

const AdminReportDetailPage = async ({ params }: ReportDetailPageProps) => {
  const { reportId } = await params;

  return <ReportDetailView reportId={reportId} />;
};

export default AdminReportDetailPage;
