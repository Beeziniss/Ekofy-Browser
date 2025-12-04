"use client";

import { useAuthStore } from "@/store";
import { ArtistReportLayout } from "../layouts";
import { ArtistReportListSection } from "../sections";
import { usePrefetchQuery } from "@tanstack/react-query";
import { userReportsOptions } from "@/gql/options/user-report-options";

export function ArtistReportListView() {
  const { user } = useAuthStore();

  // Prefetch the first page of user reports if user is available
  usePrefetchQuery(userReportsOptions(user!.userId, 0, 10));

  return (
    <ArtistReportLayout>
      <ArtistReportListSection />
    </ArtistReportLayout>
  );
}
