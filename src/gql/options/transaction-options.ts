import { queryOptions } from "@tanstack/react-query";
import { execute } from "../execute";
import {
  GetAllTransactionsQuery,
  SearchTransactionsQuery,
  GetAllPayoutTransactionsQuery,
  SearchPayoutTransactionsQuery,
  GetAllRefundTransactionsQuery,
  SearchRefundTransactionsQuery,
} from "@/modules/shared/queries/admin/transaction-queries";
import {
  PaymentTransactionFilterInput,
  PaymentTransactionSortInput,
  PayoutTransactionFilterInput,
  PayoutTransactionSortInput,
  RefundTransactionFilterInput,
  RefundTransactionSortInput,
  SortEnumType,
  PaymentTransactionStatus,
  PayoutTransactionStatus,
  RefundTransactionStatus,
} from "@/gql/graphql";

/**
 * Query options for fetching all payment transactions (Admin only)
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @param searchTerm - Optional search by user email or fullName
 * @param statusFilter - Optional filter by payment status
 */
export const adminPaymentTransactionsOptions = (
  page: number = 1,
  pageSize: number = 10,
  searchTerm: string = "",
  statusFilter?: PaymentTransactionStatus
) =>
  queryOptions({
    queryKey: ["admin-payment-transactions", page, pageSize, searchTerm, statusFilter],
    queryFn: async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const where: PaymentTransactionFilterInput = {
        ...(statusFilter ? { paymentStatus: { eq: statusFilter } } : {}),
      };

      const order: PaymentTransactionSortInput[] = [{ createdAt: SortEnumType.Desc }];

      const result = searchTerm
        ? await execute(SearchTransactionsQuery, { order, searchTerm, skip, take, where })
        : await execute(GetAllTransactionsQuery, { where, order, skip, take });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (result as any).searchPaymentTransactions || (result as any).paymentTransactions || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

/**
 * Query options for fetching a single payment transaction by ID (Admin only)
 */
export const adminPaymentTransactionByIdOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ["admin-payment-transaction", params.id],
    queryFn: async () => {
      const where: PaymentTransactionFilterInput = {
        id: { eq: params.id },
      };
      const take = 1;
      const skip = 0;

      const result = await execute(GetAllTransactionsQuery, { where, skip, take });
      return result.paymentTransactions?.items?.[0] || null;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

/**
 * Query options for fetching all payout transactions (Admin only)
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @param searchTerm - Optional search term
 * @param statusFilter - Optional filter by payout status
 */
export const adminPayoutTransactionsOptions = (
  page: number = 1,
  pageSize: number = 10,
  searchTerm: string = "",
  statusFilter?: PayoutTransactionStatus
) =>
  queryOptions({
    queryKey: ["admin-payout-transactions", page, pageSize, searchTerm, statusFilter],
    queryFn: async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const where: PayoutTransactionFilterInput = {
        ...(statusFilter ? { status: { eq: statusFilter } } : {}),
      };

      const order: PayoutTransactionSortInput[] = [{ createdAt: SortEnumType.Desc }];

      const result = searchTerm
        ? await execute(SearchPayoutTransactionsQuery, { order, searchTerm, skip, take, where })
        : await execute(GetAllPayoutTransactionsQuery, { where, order, skip, take });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (result as any).searchPayoutTransactions || (result as any).payoutTransactions || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

/**
 * Query options for fetching a single payout transaction by ID (Admin only)
 */
export const adminPayoutTransactionByIdOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ["admin-payout-transaction", params.id],
    queryFn: async () => {
      const where: PayoutTransactionFilterInput = {
        id: { eq: params.id },
      };
      const take = 1;
      const skip = 0;

      const result = await execute(GetAllPayoutTransactionsQuery, { where, skip, take });
      return result.payoutTransactions?.items?.[0] || null;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

/**
 * Query options for fetching all refund transactions (Admin only)
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @param searchTerm - Optional search term
 * @param statusFilter - Optional filter by refund status
 */
export const adminRefundTransactionsOptions = (
  page: number = 1,
  pageSize: number = 10,
  searchTerm: string = "",
  statusFilter?: RefundTransactionStatus
) =>
  queryOptions({
    queryKey: ["admin-refund-transactions", page, pageSize, searchTerm, statusFilter],
    queryFn: async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const where: RefundTransactionFilterInput = {
        ...(statusFilter ? { status: { eq: statusFilter } } : {}),
      };

      const order: RefundTransactionSortInput[] = [{ createdAt: SortEnumType.Desc }];

      const result = searchTerm
        ? await execute(SearchRefundTransactionsQuery, { order, searchTerm, skip, take, where })
        : await execute(GetAllRefundTransactionsQuery, { where, order, skip, take });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (result as any).searchRefundTransactions || (result as any).refundTransactions || {
        items: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

/**
 * Query options for fetching a single refund transaction by ID (Admin only)
 */
export const adminRefundTransactionByIdOptions = (params: { id: string }) =>
  queryOptions({
    queryKey: ["admin-refund-transaction", params.id],
    queryFn: async () => {
      const where: RefundTransactionFilterInput = {
        id: { eq: params.id },
      };
      const take = 1;
      const skip = 0;

      const result = await execute(GetAllRefundTransactionsQuery, { where, skip, take });
      return result.refundTransactions?.items?.[0] || null;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
