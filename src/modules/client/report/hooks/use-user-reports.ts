import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import {
  userReportsOptions,
  infiniteUserReportsOptions,
  userReportDetailOptions,
  prefetchUserReports,
  prefetchUserReportDetail,
} from "@/gql/options/user-report-options";
import { ReportStatus, ReportType, ReportRelatedContentType } from "@/gql/graphql";

interface UserReportFilters {
  status?: { eq?: ReportStatus };
  reportType?: { eq?: ReportType };
  relatedContentType?: { eq?: ReportRelatedContentType };
  createdAt?: { gte?: string; lte?: string };
  description?: { contains?: string };
}

// Hook to get user reports with pagination
export const useUserReports = (
  skip: number = 0,
  take: number = 20,
  additionalFilters?: UserReportFilters
) => {
  const { user } = useAuthStore();
  const reporterId = user?.userId || "";

  return useQuery({
    ...userReportsOptions(reporterId, skip, take, additionalFilters),
    enabled: !!reporterId,
  });
};

// Hook to get infinite user reports for infinite scroll
export const useInfiniteUserReports = (
  take: number = 20,
  additionalFilters?: UserReportFilters
) => {
  const { user } = useAuthStore();
  const reporterId = user?.userId || "";

  return useInfiniteQuery({
    ...infiniteUserReportsOptions(reporterId, take, additionalFilters),
    enabled: !!reporterId,
  });
};

// Hook to get single report detail
export const useUserReportDetail = (reportId: string) => {
  const { user } = useAuthStore();
  const reporterId = user?.userId || "";

  return useQuery({
    ...userReportDetailOptions(reportId, reporterId),
    enabled: !!reportId && !!reporterId,
  });
};

// Hook to prefetch user reports
export const usePrefetchUserReports = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const reporterId = user?.userId || "";

  const prefetch = (additionalFilters?: UserReportFilters) => {
    if (reporterId) {
      return prefetchUserReports(queryClient, reporterId, additionalFilters);
    }
  };

  const prefetchDetail = (reportId: string) => {
    if (reporterId && reportId) {
      return prefetchUserReportDetail(queryClient, reportId, reporterId);
    }
  };

  return {
    prefetch,
    prefetchDetail,
  };
};