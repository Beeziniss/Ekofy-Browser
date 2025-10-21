import { TrackListWithFiltersQuery } from "@/modules/artist/studio/ui/sections/tracks/track-table-section";
import { GetArtistProfileQuery } from "@/modules/artist/profile/ui/views/queries";
import { 
  ServicePackageServiceViewQuery, 
  ServicePackageDetailQuery, 
  PendingArtistPackagesQuery 
} from "@/modules/artist/service-package/ui/view/service-package-service-view";
import { execute } from "../execute";
import { queryOptions } from "@tanstack/react-query";

export const trackListOptions = queryOptions({
  queryKey: ["tracks"],
  queryFn: () => execute(TrackListWithFiltersQuery, { skip: 0, take: 10 }),
});

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

// Service Package Options with prefetch
export const artistPackagesOptions = (artistId: string) =>
  queryOptions({
    queryKey: ["artist-packages", artistId],
    queryFn: () => execute(ServicePackageServiceViewQuery, {
      skip: 0,
      take: 50,
      where: { artistId: { eq: artistId } }
    }),
    enabled: !!artistId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const packageDetailOptions = (packageId: string) =>
  queryOptions({
    queryKey: ["package-detail", packageId],
    queryFn: () => execute(ServicePackageDetailQuery, {
      where: { id: { eq: packageId } }
    }),
    enabled: !!packageId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const pendingPackagesOptions = (artistId: string) =>
  queryOptions({
    queryKey: ["pending-packages", artistId],
    queryFn: () => execute(PendingArtistPackagesQuery, {
      pageNumber: 1,
      pageSize: 50,
      where: { artistId: { eq: artistId } },
      artistWhere: {} // Get all artists for stage name lookup
    }),
    enabled: !!artistId,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for pending)
  });
