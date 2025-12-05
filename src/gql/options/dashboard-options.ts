import { execute } from '@/gql/execute';
import {
  // PAYMENT_TRANSACTIONS,
  // PAYOUT_TRANSACTIONS,
  // REFUND_TRANSACTIONS,
  TOTAL_LISTENER,
  TOTAL_ARTIST,
  TOTAL_TRACKS,
  INVOICE_DASHBOARD,
  INVOICE_DASHBOARD_DETAILS,
  PLATFORM_REVENUE,
  TRACK_DAILY_METRICS,
} from '@/modules/shared/queries/admin/dashboard-queries';
import {
  // PaymentTransactionFilterInput,
  // PaymentTransactionSortInput,
  // PayoutTransactionFilterInput,
  // PayoutTransactionSortInput,
  // RefundTransactionFilterInput,
  // RefundTransactionSortInput,
  ListenerFilterInput,
  ListenerSortInput,
  ArtistFilterInput,
  ArtistSortInput,
  TrackFilterInput,
  TrackSortInput,
  InvoiceFilterInput,
  InvoiceSortInput,
  PlatformRevenueFilterInput,
  PlatformRevenueSortInput,
  TrackDailyMetricFilterInput,
} from '../graphql';

// Payment Transactions Options
// export const paymentTransactionsOptions = (
//   skip: number,
//   take: number,
//   where?: PaymentTransactionFilterInput,
//   order?: PaymentTransactionSortInput[]
// ) => ({
//   queryKey: ['payment-transactions', skip, take, where, order],
//   queryFn: async () => {
//     const result = await execute(PAYMENT_TRANSACTIONS, { skip, take, where, order });
//     return result.paymentTransactions || {
//       items: [],
//       pageInfo: { hasNextPage: false, hasPreviousPage: false },
//       totalCount: 0,
//     };
//   },
//   staleTime: 2 * 60 * 1000, // 2 minutes
// });

// Payout Transactions Options
// export const payoutTransactionsOptions = (
//   skip: number,
//   take: number,
//   where?: PayoutTransactionFilterInput,
//   order?: PayoutTransactionSortInput[]
// ) => ({
//   queryKey: ['payout-transactions', skip, take, where, order],
//   queryFn: async () => {
//     const result = await execute(PAYOUT_TRANSACTIONS, { skip, take, where, order });
//     return result.payoutTransactions || {
//       items: [],
//       pageInfo: { hasNextPage: false, hasPreviousPage: false },
//       totalCount: 0,
//     };
//   },
//   staleTime: 2 * 60 * 1000, // 2 minutes
// });

// Refund Transactions Options
// export const refundTransactionsOptions = (
//   skip: number,
//   take: number,
//   where?: RefundTransactionFilterInput,
//   order?: RefundTransactionSortInput[]
// ) => ({
//   queryKey: ['refund-transactions', skip, take, where, order],
//   queryFn: async () => {
//     const result = await execute(REFUND_TRANSACTIONS, { skip, take, where, order });
//     return result.refundTransactions || {
//       items: [],
//       pageInfo: { hasNextPage: false, hasPreviousPage: false },
//       totalCount: 0,
//     };
//   },
//   staleTime: 2 * 60 * 1000, // 2 minutes
// });

// Total Listeners Options
export const totalListenersOptions = (
  where?: ListenerFilterInput,
  order?: ListenerSortInput[]
) => ({
  queryKey: ['total-listeners', where, order],
  queryFn: async () => {
    const result = await execute(TOTAL_LISTENER, { where, order });
    return result.listeners || {
      items: [],
      totalCount: 0,
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change as frequently
});

// Total Artists Options
export const totalArtistsOptions = (
  where?: ArtistFilterInput,
  order?: ArtistSortInput[]
) => ({
  queryKey: ['total-artists', where, order],
  queryFn: async () => {
    const result = await execute(TOTAL_ARTIST, { where, order });
    return result.artists || {
      items: [],
      totalCount: 0,
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Total Tracks Options
export const totalTracksOptions = (
  where?: TrackFilterInput,
  order?: TrackSortInput[]
) => ({
  queryKey: ['total-tracks', where, order],
  queryFn: async () => {
    const result = await execute(TOTAL_TRACKS, { where, order });
    return result.tracks || {
      totalCount: 0,
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Invoice Dashboard Options
export const invoiceDashboardOptions = (
  skip: number,
  take: number,
  where?: InvoiceFilterInput,
  order?: InvoiceSortInput[],
) => ({
  queryKey: ['invoice-dashboard', skip, take, where, order],
  queryFn: async () => {
    const result = await execute(INVOICE_DASHBOARD, { 
      skip, 
      take, 
      where, 
      order
    });
    return result.invoices || {
      items: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      totalCount: 0,
    };
  },
  staleTime: 2 * 60 * 1000, // 2 minutes
});

// Invoice Details Options
export const invoiceDetailsOptions = (
  where?: InvoiceFilterInput
) => ({
  queryKey: ['invoice-details', where],
  queryFn: async () => {
    const result = await execute(INVOICE_DASHBOARD_DETAILS, { where });
    return result.invoices?.items?.[0] || null;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Platform Revenue Options
export const platformRevenueOptions = (
  skip: number = 0,
  take: number = 1,
  where?: PlatformRevenueFilterInput,
  order?: PlatformRevenueSortInput[]
) => ({
  queryKey: ['platform-revenue', skip, take, where, order],
  queryFn: async () => {
    const result = await execute(PLATFORM_REVENUE, { skip, take, where, order });
    return result.platformRevenues || {
      items: [],
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Track Daily Metrics Options
export const trackDailyMetricsOptions = (
  where?: TrackDailyMetricFilterInput
) => ({
  queryKey: ['track-daily-metrics', where],
  queryFn: async () => {
    const result = await execute(TRACK_DAILY_METRICS, { where });
    return result.trackDailyMetrics || {
      items: [],
      totalCount: 0,
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});
