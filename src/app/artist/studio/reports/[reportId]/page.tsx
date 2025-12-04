import { ArtistReportDetailView } from "@/modules/artist/report";

interface ArtistReportDetailPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

const ArtistReportDetailPage = async ({ params }: ArtistReportDetailPageProps) => {
  const resolvedParams = await params;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <ArtistReportDetailView reportId={resolvedParams.reportId} />
    </div>
  );
};

export default ArtistReportDetailPage;
