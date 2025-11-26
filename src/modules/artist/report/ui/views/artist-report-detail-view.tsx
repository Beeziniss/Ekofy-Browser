"use client";

import { ArtistReportLayout } from "../layouts";
import { ArtistReportDetailSection } from "../sections";

interface ArtistReportDetailViewProps {
  reportId: string;
}

export function ArtistReportDetailView({ reportId }: ArtistReportDetailViewProps) {
  return (
    <ArtistReportLayout>
      <ArtistReportDetailSection reportId={reportId} />
    </ArtistReportLayout>
  );
}