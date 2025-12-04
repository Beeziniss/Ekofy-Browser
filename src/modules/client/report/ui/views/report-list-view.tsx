"use client";

import { useAuthStore } from "@/store";
import { ReportLayout } from "../layouts";
import { ReportListSection } from "../sections";
import { usePrefetchQuery } from "@tanstack/react-query";
import { userReportsOptions } from "@/gql/options/user-report-options";

export function ReportListView() {
  const { user } = useAuthStore();

  // Prefetch the first page of user reports if user is available
  usePrefetchQuery(userReportsOptions(user!.userId, 0, 10));

  return (
    <ReportLayout>
      <ReportListSection />
    </ReportLayout>
  );
}
