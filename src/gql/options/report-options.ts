import { execute } from "../execute";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { REPORT_QUERIES, REPORT_DETAIL_QUERY, QUERY_MODERATOR_REPORTS } from "@/modules/shared/queries/client/report-queries";
import { ReportFilterInput, ReportStatus, ReportRelatedContentType, UserFilterInput } from "../graphql";

// Get all reports with pagination
export const reportsOptions = (skip: number = 0, take: number = 20, where?: ReportFilterInput) =>
  queryOptions({
    queryKey: ["reports", skip, take, where],
    queryFn: async () => {
      const result = await execute(REPORT_QUERIES, { skip, take, where });
      return result.reports || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

// Get infinite reports for infinite scroll
export const infiniteReportsOptions = (take: number = 20, where?: ReportFilterInput) =>
  infiniteQueryOptions({
    queryKey: ["reports-infinite", where],
    queryFn: async ({ pageParam }) => {
      const skip = (pageParam - 1) * take;
      const result = await execute(REPORT_QUERIES, { skip, take, where });
      return result.reports || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.pageInfo.hasNextPage ? allPages.length + 1 : undefined;
    },
  });

// Get report detail by ID
export const reportDetailOptions = (reportId: string) =>
  queryOptions({
    queryKey: ["report-detail", reportId],
    queryFn: async () => {
      const result = await execute(REPORT_DETAIL_QUERY, {
        where: { id: { eq: reportId } },
      });
      return result.reports?.items?.[0] || null;
    },
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// Get reports by status
export const reportsByStatusOptions = (status: ReportStatus, skip: number = 0, take: number = 20) =>
  queryOptions({
    queryKey: ["reports-by-status", status, skip, take],
    queryFn: async () => {
      const result = await execute(REPORT_QUERIES, {
        skip,
        take,
        where: { status: { eq: status } },
      });
      return result.reports || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
    },
    staleTime: 2 * 60 * 1000,
  });

// Get reports assigned to moderator
export const assignedReportsOptions = (moderatorId: string, skip: number = 0, take: number = 20) =>
  queryOptions({
    queryKey: ["assigned-reports", moderatorId, skip, take],
    queryFn: async () => {
      const result = await execute(REPORT_QUERIES, {
        skip,
        take,
        where: { assignedModeratorId: { eq: moderatorId } },
      });
      return result.reports || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
    },
    enabled: !!moderatorId,
    staleTime: 2 * 60 * 1000,
  });

// Get reports by related content (Track, Comment, etc.)
export const reportsByContentOptions = (
  contentType: ReportRelatedContentType,
  contentId: string,
  skip: number = 0,
  take: number = 20,
) =>
  queryOptions({
    queryKey: ["reports-by-content", contentType, contentId, skip, take],
    queryFn: async () => {
      const result = await execute(REPORT_QUERIES, {
        skip,
        take,
        where: {
          relatedContentType: { eq: contentType },
          relatedContentId: { eq: contentId },
        },
      });
      return result.reports || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
    },
    enabled: !!contentType && !!contentId,
    staleTime: 2 * 60 * 1000,
  });

export const moderatorReportsOptions = (where: UserFilterInput) =>
  queryOptions({
    queryKey: ["moderator-users", where],
    queryFn: async () => {
      const result = await execute(QUERY_MODERATOR_REPORTS, { where });
      return result.users || {
        items: [],
      };
    },
    staleTime: 2 * 60 * 1000,
  });