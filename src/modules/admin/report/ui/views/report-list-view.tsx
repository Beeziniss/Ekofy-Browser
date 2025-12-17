import { ReportLayout } from "../layouts/report-layout";
import { ReportSection } from "../sections/report-section";

export function ReportListView() {
  return (
    <ReportLayout title="Report Management" description="View reports from users">
      <ReportSection />
    </ReportLayout>
  );
}
