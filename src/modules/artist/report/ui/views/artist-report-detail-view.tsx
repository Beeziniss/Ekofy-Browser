"use client";

import { useAuthStore } from "@/store";
import { ArtistReportLayout } from "../layouts";
import { ArtistReportDetailSection } from "../sections";
import { usePrefetchQuery } from "@tanstack/react-query";
import { userReportDetailOptions } from "@/gql/options/user-report-options";

interface ArtistReportDetailViewProps {
  reportId: string;
}

export function ArtistReportDetailView({ reportId }: ArtistReportDetailViewProps) {
  const { user } = useAuthStore();

  // Prefetch report detail if user is available
  usePrefetchQuery(userReportDetailOptions(reportId, user!.userId));

  return (
    <ArtistReportLayout>
      <ArtistReportDetailSection reportId={reportId} />
    </ArtistReportLayout>
  );
}
