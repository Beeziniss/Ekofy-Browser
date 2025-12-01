import { ReportControlLayout } from "../layout/report-control-layout";
import { ReportControlSection } from "../section/report-control-section";

export function ReportListView() {
  return (
    <ReportControlLayout title="Report Management" description="View and process reports from users">
      <ReportControlSection />
    </ReportControlLayout>
  );
}
