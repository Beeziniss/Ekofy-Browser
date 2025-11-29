import { GetUserProfileQuery } from "@/modules/admin/profile/ui/views/admin-profile-view";
import { AdminGetListUser, AdminGetStatistics } from "@/modules/admin/user-management/ui/views/admin-user-managenent";
import { execute } from "../execute";
import { queryOptions } from "@tanstack/react-query";
import { GetAllTransactionsQuery } from "@/modules/shared/queries/admin/transaction-queries";
import {
  PaymentTransactionFilterInput,
  PaymentTransactionSortInput,
  SortEnumType,
  PaymentTransactionStatus,
} from "@/gql/graphql";

export const adminProfileOptions = (userId: string) =>
  queryOptions({
    queryKey: ["admin-profile", userId],
    queryFn: async () => {
      const result = await execute(GetUserProfileQuery, {
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
      const result = await execute(GetUserProfileQuery, {
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
        // Note: To search by user info, you'd need to add user filtering in the backend
        // or fetch user data separately
      };

      // Default sorting: newest first
      const order: PaymentTransactionSortInput[] = [{ createdAt: SortEnumType.Desc }];

      const result = await execute(GetAllTransactionsQuery, { where, order, skip, take });

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

