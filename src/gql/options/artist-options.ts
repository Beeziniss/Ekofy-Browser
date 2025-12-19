import { execute } from "../execute";
import { queryOptions } from "@tanstack/react-query";
import { TrackInsightViewQuery } from "@/modules/artist/tracks/ui/views/track-insight-view";
import {
  ServicePackageServiceViewQuery,
  ServicePackageDetailQuery,
} from "@/modules/shared/queries/artist/artist-packages-queries";
import {
  ArtistPackageFilterInput,
  TrackFilterInput,
  TrackDailyMetricFilterInput,
  UserEngagementAction,
  UserEngagementFilterInput,
  UserEngagementTargetType,
} from "@/gql/graphql";
import {
  ArtistRevenueQuery,
  ArtistTrackDetailQuery,
  CategoriesQuery,
  GetArtistProfileQuery,
  TrackDailyMetricsQuery,
  TrackListWithFiltersQuery,
  TrackUploadArtistListQuery,
  TrackUploadPendingRequestDetailQuery,
  TrackUploadPendingRequestsQuery,
} from "@/modules/shared/queries/artist";
import { TrackEngagementFavCountQuery, TrackEngagementQuery } from "@/modules/shared/queries/artist/engagement-queries";

// TRACK LIST OPTIONS
export const trackListOptions = queryOptions({
  queryKey: ["tracks"],
  queryFn: () => execute(TrackListWithFiltersQuery, { skip: 0, take: 10 }),
});

export const trackInsightOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["track-insight", trackId],
    queryFn: () => execute(TrackInsightViewQuery, { trackId }),
  });

export const trackInsightFavCountOptions = (trackId: string, dateFrom?: string, dateTo?: string) =>
  queryOptions({
    queryKey: ["track-insight-fav-count", trackId, dateFrom, dateTo],
    queryFn: () => {
      const whereUserEngagement: UserEngagementFilterInput = {
        action: { eq: UserEngagementAction.Like },
        targetType: { eq: UserEngagementTargetType.Track },
        targetId: { eq: trackId },
      };

      // Add date filters if provided
      if (dateFrom) {
        whereUserEngagement.createdAt = { gte: new Date(dateFrom) };
      }
      if (dateTo) {
        whereUserEngagement.createdAt = {
          ...whereUserEngagement.createdAt,
          lte: new Date(dateTo),
        };
      }
      return execute(TrackEngagementFavCountQuery, { whereEngaement: whereUserEngagement });
    },
    enabled: !!trackId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const trackInsightFavoriteCountOptions = (trackId: string, dateFrom?: string, dateTo?: string, take?: number) =>
  queryOptions({
    queryKey: ["track-insight-favorite-count", trackId, dateFrom, dateTo, take],
    queryFn: async () => {
      const whereUserEngagement: UserEngagementFilterInput = {
        action: { eq: UserEngagementAction.Like },
        targetType: { eq: UserEngagementTargetType.Track },
        targetId: { eq: trackId },
      };

      // Add date filters if provided
      if (dateFrom) {
        whereUserEngagement.createdAt = { gte: new Date(dateFrom) };
      }
      if (dateTo) {
        whereUserEngagement.createdAt = {
          ...whereUserEngagement.createdAt,
          lte: new Date(dateTo),
        };
      }

      const result = await execute(TrackEngagementQuery, { whereEngaement: whereUserEngagement, take: take || 1000 });

      // Group the engagement data by date (ignoring time)
      const groupedData = new Map<string, number>();

      if (result.userEngagement?.items) {
        result.userEngagement.items.forEach((engagement) => {
          if (engagement.createdAt) {
            // Extract only date (YYYY-MM-DD) from the datetime
            const date = new Date(engagement.createdAt);
            const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

            groupedData.set(dateKey, (groupedData.get(dateKey) || 0) + 1);
          }
        });
      }

      // Convert grouped data to array format for chart consumption
      const favoritesByDate = Array.from(groupedData.entries())
        .map(([date, count]) => ({
          date,
          count,
          createdAt: date,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        ...result,
        favoritesByDate,
        totalCount: result.userEngagement?.totalCount || 0,
      };
    },
    enabled: !!trackId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// CATEGORIES OPTIONS
export const categoriesOptions = (skip: number = 0, take: number = 50) =>
  queryOptions({
    queryKey: ["categories", skip, take],
    queryFn: async () => await execute(CategoriesQuery, { skip, take }),
  });

// ARTIST OPTIONS
export const artistProfileOptions = (userId: string) =>
  queryOptions({
    queryKey: ["artist-profile", userId],
    queryFn: async () => {
      const result = await execute(GetArtistProfileQuery, {
        where: { userId: { eq: userId } },
        take: 1,
        skip: 0,
      });
      return result.artists?.items?.[0] || null;
    },
    enabled: !!userId,
    retry: 0,
  });

// ARTIST LIST OPTIONS
export const trackUploadArtistListOptions = queryOptions({
  queryKey: ["track-upload-artist-list"],
  queryFn: async () => await execute(TrackUploadArtistListQuery),
});

// ARTIST PACKAGES OPTIONS
export const artistPackagesOptions = (
  artistId: string,
  page: number = 1,
  pageSize: number = 10,
  searchTerm: string = "",
) =>
  queryOptions({
    queryKey: ["artist-packages", artistId, page, pageSize, searchTerm],
    queryFn: () => {
      const where: ArtistPackageFilterInput = { artistId: { eq: artistId } };

      // Add packageName filter if search term is provided
      if (searchTerm.trim()) {
        where.packageName = { contains: searchTerm };
      }

      const skip = (page - 1) * pageSize;

      return execute(ServicePackageServiceViewQuery, {
        skip,
        take: pageSize,
        where,
      });
    },
    enabled: !!artistId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const packageDetailOptions = (packageId: string) =>
  queryOptions({
    queryKey: ["package-detail", packageId],
    queryFn: () =>
      execute(ServicePackageDetailQuery, {
        where: { id: { eq: packageId } },
      }),
    enabled: !!packageId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// ENGAGEMENT OPTIONS
/* export const engagementOptions = queryOptions({
  queryKey: ["engagement"],
  queryFn: async ({}) => {
    const where: TrackFilterInput = {};

    return await execute(EngagementQuery, { where, takeTracks: 5 });
  },
}); */

// TRACK PENDING QUERIES
export const trackUploadPendingRequestOptions = ({
  pageNumber,
  pageSize,
  userId,
}: {
  pageNumber: number;
  pageSize: number;
  userId?: string;
}) =>
  queryOptions({
    queryKey: ["track-upload-pending-requests"],
    queryFn: async () => {
      return await execute(TrackUploadPendingRequestsQuery, { pageNumber, pageSize, userId });
    },
  });

export const trackUploadPendingRequestDetailOptions = (uploadId: string) =>
  queryOptions({
    queryKey: ["track-upload-pending-request-detail", uploadId],
    queryFn: async () => {
      return await execute(TrackUploadPendingRequestDetailQuery, { uploadId });
    },
  });

// TRACK OPTIONS
export const artistTrackDetailOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["artist-track-detail", trackId],
    queryFn: async () => {
      const where: TrackFilterInput = { id: { eq: trackId } };
      const result = await execute(ArtistTrackDetailQuery, { where });
      return result.tracks?.items?.[0] || null;
    },
    enabled: !!trackId,
    retry: 0,
  });

export const trackDailyMetricsOptions = (trackId: string, skip: number = 0, take: number = 7) =>
  queryOptions({
    queryKey: ["track-daily-metrics", trackId, skip, take],
    queryFn: async () => {
      const where: TrackDailyMetricFilterInput = { trackId: { eq: trackId } };
      // const order: TrackDailyMetricSortInput = { date: "DESC" };
      const result = await execute(TrackDailyMetricsQuery, { where, skip, take });
      return result?.trackDailyMetrics || null;
    },
    enabled: !!trackId,
    retry: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// REVENUE OPTIONS
export const artistRevenueOptions = (artistId: string) =>
  queryOptions({
    queryKey: ["artist-revenue", artistId],
    queryFn: async () => {
      const result = await execute(ArtistRevenueQuery, {
       artistId
      });
      return result.artists?.items?.[0] || null;
    },
    enabled: !!artistId,
    retry: 0,
  });