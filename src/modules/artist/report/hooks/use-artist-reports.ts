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

interface ArtistReportFilters {
  status?: { eq?: ReportStatus };
  reportType?: { eq?: ReportType };
  relatedContentType?: { eq?: ReportRelatedContentType };
  createdAt?: { gte?: string; lte?: string };
  description?: { contains?: string };
}

// Hook to get artist reports with pagination
export const useArtistReports = (
  skip: number = 0,
  take: number = 20,
  additionalFilters?: ArtistReportFilters
) => {
  const { user } = useAuthStore();
  const reporterId = user?.userId || "";

  return useQuery({
    ...userReportsOptions(reporterId, skip, take, additionalFilters),
    enabled: !!reporterId,
  });
};

// Hook to get infinite artist reports for infinite scroll
export const useInfiniteArtistReports = (
  take: number = 20,
  additionalFilters?: ArtistReportFilters
) => {
  const { user } = useAuthStore();
  const reporterId = user?.userId || "";

  return useInfiniteQuery({
    ...infiniteUserReportsOptions(reporterId, take, additionalFilters),
    enabled: !!reporterId,
  });
};

// Hook to get single artist report detail
export const useArtistReportDetail = (reportId: string) => {
  const { user } = useAuthStore();
  const reporterId = user?.userId || "";

  return useQuery({
    ...userReportDetailOptions(reportId, reporterId),
    enabled: !!reportId && !!reporterId,
  });
};

// Hook to prefetch artist reports
export const usePrefetchArtistReports = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const reporterId = user?.userId || "";

  const prefetch = (additionalFilters?: ArtistReportFilters) => {
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