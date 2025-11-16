import { execute } from "../execute";
import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { REPORT_QUERIES, REPORT_DETAIL_QUERY } from "@/modules/shared/queries/client/report-queries";
import { ReportFilterInput } from "../graphql";

// Get reports created by current user (reporter)
export const userReportsOptions = (
  reporterId: string,
  skip: number = 0,
  take: number = 20,
  additionalFilters?: Omit<ReportFilterInput, "reporterId">
) =>
  queryOptions({
    queryKey: ["user-reports", reporterId, skip, take, additionalFilters],
    queryFn: async () => {
      const where: ReportFilterInput = {
        reporterId: { eq: reporterId },
        ...additionalFilters,
      };

      const result = await execute(REPORT_QUERIES, { skip, take, where });
      return result.reports || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
    },
    enabled: !!reporterId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

// Get infinite reports for current user
export const infiniteUserReportsOptions = (
  reporterId: string,
  take: number = 20,
  additionalFilters?: Omit<ReportFilterInput, "reporterId">
) =>
  infiniteQueryOptions({
    queryKey: ["user-reports-infinite", reporterId, additionalFilters],
    queryFn: async ({ pageParam }) => {
      const skip = (pageParam - 1) * take;
      const where: ReportFilterInput = {
        reporterId: { eq: reporterId },
        ...additionalFilters,
      };

      const result = await execute(REPORT_QUERIES, { skip, take, where });
      return result.reports || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
    },
    enabled: !!reporterId,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.pageInfo.hasNextPage ? allPages.length + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000,
  });

// Get single report detail for current user
export const userReportDetailOptions = (reportId: string, reporterId: string) =>
  queryOptions({
    queryKey: ["user-report-detail", reportId, reporterId],
    queryFn: async () => {
      const where: ReportFilterInput = {
        id: { eq: reportId },
        reporterId: { eq: reporterId },
      };

      const result = await execute(REPORT_DETAIL_QUERY, { where });
      return result.reports?.items?.[0] || null;
    },
    enabled: !!reportId && !!reporterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// Prefetch user reports for better UX
export const prefetchUserReports = (
  queryClient: QueryClient,
  reporterId: string,
  additionalFilters?: Omit<ReportFilterInput, "reporterId">
) => {
  return queryClient.prefetchQuery(
    userReportsOptions(reporterId, 0, 20, additionalFilters)
  );
};

// Prefetch user report detail
export const prefetchUserReportDetail = (
  queryClient: QueryClient,
  reportId: string,
  reporterId: string
) => {
  return queryClient.prefetchQuery(
    userReportDetailOptions(reportId, reporterId)
  );
};