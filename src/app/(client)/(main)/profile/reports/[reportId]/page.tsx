import { ReportDetailView } from "@/modules/client/report";

interface ReportDetailPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

const ClientReportDetailPage = async ({ params }: ReportDetailPageProps) => {
  const { reportId } = await params;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <ReportDetailView reportId={reportId} />
    </div>
  );
};

export default ClientReportDetailPage;
