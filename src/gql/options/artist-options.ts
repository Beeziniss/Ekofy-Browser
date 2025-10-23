import { TrackListWithFiltersQuery } from "@/modules/artist/studio/ui/sections/tracks/track-table-section";
import { GetArtistProfileQuery } from "@/modules/artist/profile/ui/views/queries";
import { 
  ServicePackageServiceViewQuery, 
  ServicePackageDetailQuery, 
  PendingArtistPackagesQuery 
} from "@/modules/artist/service-package/ui/view/service-package-service-view";
import { execute } from "../execute";
import { queryOptions } from "@tanstack/react-query";
import {
  CategoriesQuery,
  UserLicenseQuery,
} from "@/modules/artist/track-upload/ui/views/track-upload-view";
import { ArtistPackageFilterInput, PaginatedDataOfPendingArtistPackageResponseFilterInput } from "@/gql/graphql";

export const trackListOptions = queryOptions({
  queryKey: ["tracks"],
  queryFn: () => execute(TrackListWithFiltersQuery, { skip: 0, take: 10 }),
});

export const categoriesOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => await execute(CategoriesQuery),
});

export const userLicenseOptions = queryOptions({
  queryKey: ["user-license"],
  queryFn: async () => await execute(UserLicenseQuery),
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

// Service Package Options with prefetch and search
export const artistPackagesOptions = (artistId: string, page: number = 1, pageSize: number = 10, searchTerm: string = '') =>
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
        where
      });
    },
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

export const pendingPackagesOptions = (artistId: string, page: number = 1, pageSize: number = 10, searchTerm: string = '') =>
  queryOptions({
    queryKey: ["pending-packages", artistId, page, pageSize, searchTerm],
    queryFn: () => {
      const where: PaginatedDataOfPendingArtistPackageResponseFilterInput = { items: { all: { artistId: { eq: artistId } } } };
      
      // Add packageName filter if search term is provided
      if (searchTerm.trim()) {
        if (where.items?.all) {
          where.items.all.packageName = { contains: searchTerm };
        }
      }
      
      return execute(PendingArtistPackagesQuery, {
        pageNumber: page,
        pageSize: pageSize,
        where,
        artistWhere: {} // Get all artists for stage name lookup
      });
    },
    enabled: !!artistId,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for pending)
  });
