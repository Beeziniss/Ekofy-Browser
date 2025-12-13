
import { ReportLayout } from "../layouts";
import { ReportDetailSection } from "../sections";

interface ReportDetailViewProps {
  reportId: string;
}

export function ReportDetailView({ reportId }: ReportDetailViewProps) {

  return (
    <ReportLayout
      title="Report Details"
      description="View detail information about violation reports"
      backHref="/profile/reports"
      backLabel="Back to List"
    >
      <ReportDetailSection reportId={reportId} />
    </ReportLayout>
  );
}
