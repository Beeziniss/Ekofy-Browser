import { GetAdminProfileQuery } from "@/modules/shared/queries/admin/admin-profile-queries";
import { AdminGetListUser, AdminGetStatistics } from "@/modules/admin/user-management/ui/views/admin-user-managenent";
import { execute } from "../execute";
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { GetAllTransactionsQuery, SearchTransactionsQuery } from "@/modules/shared/queries/admin/transaction-queries";
import {
  PaymentTransactionFilterInput,
  PaymentTransactionSortInput,
  SortEnumType,
  PaymentTransactionStatus,
  CouponFilterInput,
  CouponSortInput,
  CouponStatus,
  CreateCouponRequestInput,
} from "@/gql/graphql";
import { CouponListQuery } from "@/modules/shared/queries/admin/coupon-queries";
import { CREATE_COUPON_MUTATION, DEPRECATE_COUPON } from "@/modules/shared/mutations/admin/coupon-mutaion";

export const adminProfileOptions = (userId: string) =>
  queryOptions({
    queryKey: ["admin-profile", userId],
    queryFn: async () => {
      const result = await execute(GetAdminProfileQuery, {
        where: {
          id: { eq: userId },
        },
      });

      // Return first user from items array
      return result.users?.items?.[0] || null;
    },
  });

export const adminUsersQueryOptions = (page: number = 1, pageSize: number = 10, searchTerm: string = "") =>
  queryOptions({
    queryKey: ["admin-users", page, pageSize, searchTerm],
    queryFn: async () => {
      const skip = (page - 1) * pageSize;
      const where = searchTerm
        ? {
            fullName: {
              contains: searchTerm,
            },
          }
        : {};

      const result = await execute(AdminGetListUser, {
        skip,
        take: pageSize,
        where,
      });

      return result;
    },
  });

export const adminUsersStatsOptions = () =>
  queryOptions({
    queryKey: ["admin-users-stats"],
    queryFn: async () => {
      const result = await execute(AdminGetStatistics, {
        where: {},
      });

      return result;
    },
  });

export const adminArtistDetailOptions = (userId: string) =>
  queryOptions({
    queryKey: ["admin-artist-detail", userId],
    queryFn: async () => {
      const { GET_ARTISTS } = await import("@/modules/admin/user-management/ui/views/admin-user-detail-view");
      const result = await execute(GET_ARTISTS, {
        where: {
          userId: { eq: userId },
        },
      });

      return result.artists?.items?.[0] || null;
    },
  });

export const adminListenerDetailOptions = (userId: string) =>
  queryOptions({
    queryKey: ["admin-listener-detail", userId],
    queryFn: async () => {
      const { AdminListenerDetail } = await import("@/modules/admin/user-management/ui/views/admin-user-detail-view");
      const result = await execute(AdminListenerDetail, {
        where: {
          userId: { eq: userId },
        },
      });

      return result.listeners?.items?.[0] || null;
    },
  });

export const adminUserDetailOptions = (userId: string) =>
  queryOptions({
    queryKey: ["admin-user-detail", userId],
    queryFn: async () => {
      const result = await execute(GetAdminProfileQuery, {
        where: {
          id: { eq: userId },
        },
      });

      return result.users?.items?.[0] || null;
    },
  });

/**
 * Query options for fetching all payment transactions (Admin only)
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @param searchTerm - Optional search by user email or fullName
 * @param statusFilter - Optional filter by payment status (PAID, PENDING, UNPAID)
 */
export const adminTransactionsOptions = (
  page: number = 1,
  pageSize: number = 10,
  searchTerm: string = "",
  statusFilter?: PaymentTransactionStatus
) =>
  queryOptions({
    queryKey: ["admin-transactions", page, pageSize, searchTerm, statusFilter],
    queryFn: async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      // Build filter conditions
      const where: PaymentTransactionFilterInput = {
        ...(statusFilter ? { paymentStatus: { eq: statusFilter } } : {}),
      };

      // Default sorting: newest first
      const order: PaymentTransactionSortInput[] = [{ createdAt: SortEnumType.Desc }];

      // Use search query if searchTerm is provided, otherwise use regular query
      const result = searchTerm
        ? await execute(SearchTransactionsQuery, { order, searchTerm, skip, take, where })
        : await execute(GetAllTransactionsQuery, { where, order, skip, take });

      return result;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

/**
 * Query options for fetching a single transaction by ID (Admin only)
 */
export const adminTransactionByIdOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ["admin-transaction", params.id],
    queryFn: async () => {
      const where: PaymentTransactionFilterInput = {
        id: { eq: params.id },
      };
      const take = 1;
      const skip = 0;

      const result = await execute(GetAllTransactionsQuery, { where, skip, take });
      return result;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

/**
 * Query options for fetching coupons list (Admin only)
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @param searchTerm - Optional search by coupon name or code
 * @param statusFilter - Optional filter by coupon status
 */
export const adminCouponsOptions = (
  page: number = 1,
  pageSize: number = 10,
  searchTerm: string = "",
  statusFilter?: CouponStatus
) =>
  queryOptions({
    queryKey: ["admin-coupons", page, pageSize, searchTerm, statusFilter],
    queryFn: async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      // Build filter conditions
      const where: CouponFilterInput = {
        ...(statusFilter ? { status: { eq: statusFilter } } : {}),
        ...(searchTerm
          ? {
              or: [
                { name: { contains: searchTerm } },
                { code: { contains: searchTerm } },
                { description: { contains: searchTerm } },
              ],
            }
          : {}),
      };

      // Default sorting: newest first
      const order: CouponSortInput[] = [{ createdAt: SortEnumType.Desc }];

      const result = await execute(CouponListQuery, {
        skip,
        take,
        where,
        order,
      });

      return result;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

/**
 * Query options for fetching a single coupon by ID (Admin only)
 */
export const adminCouponByIdOptions = (couponId: string) =>
  queryOptions({
    queryKey: ["admin-coupon", couponId],
    queryFn: async () => {
      const where: CouponFilterInput = {
        id: { eq: couponId },
      };
      const take = 1;
      const skip = 0;

      const result = await execute(CouponListQuery, { where, skip, take });
      return result.coupons?.items?.[0] || null;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

/**
 * Mutation options for creating a coupon (Admin only)
 */
export const createCouponMutationOptions = mutationOptions({
  mutationKey: ["create-coupon"],
  mutationFn: async (createCouponRequest: CreateCouponRequestInput) => {
    const result = await execute(CREATE_COUPON_MUTATION, {
      createCouponRequest,
    });
    return result;
  },
});

/**
 * Mutation options for deprecating coupons (Admin only)
 */
export const deprecateCouponMutationOptions = mutationOptions({
  mutationKey: ["deprecate-coupon"],
  mutationFn: async (couponIds: string[]) => {
    const result = await execute(DEPRECATE_COUPON, {
      couponIds,
    });
    return result;
  },
});

