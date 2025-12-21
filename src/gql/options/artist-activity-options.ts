import { execute } from "@/gql/execute";
import {
  PaymentTransactionFilterInput,
  PaymentTransactionSortInput,
  PayoutTransactionFilterInput,
  PayoutTransactionSortInput,
  SortEnumType,
  InvoiceFilterInput,
  InvoiceSortInput,
  PackageOrderFilterInput,
  TrackFilterInput,
  TrackDailyMetricFilterInput,
  ArtistPackageFilterInput,
} from "@/gql/graphql";
import {
  GetArtistInvoicesQuery,
  GetArtistPackageByIdQuery,
  GetArtistPayoutsQuery,
  GetArtistTransactionsQuery,
  GetPlatformFeesQuery,
} from "@/modules/shared/queries/artist/revenue-queries";
import {
  TrackListStatsQuery,
  TrackDailyMetricsQuery,
} from "@/modules/shared/queries/artist/track-queries";

export function artistTransactionsOptions(params: {
  userId: string;
  page: number;
  pageSize: number;
  status?: string; // reserved for future filters
}) {
  const { userId, page, pageSize } = params;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: PaymentTransactionFilterInput = {
    userId: { eq: userId },
  };
  const order: PaymentTransactionSortInput[] = [{ createdAt: SortEnumType.Desc }];

  return {
    queryKey: ["artist-transactions", userId, page, pageSize],
    queryFn: async () => execute(GetArtistTransactionsQuery, { where, order, skip, take }),
  };
}

export function artistPayoutsOptions(params: { userId: string; page: number; pageSize: number; status?: string }) {
  const { userId, page, pageSize } = params;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: PayoutTransactionFilterInput = {
    userId: { eq: userId },
  };
  const order: PayoutTransactionSortInput[] = [{ createdAt: SortEnumType.Desc }];

  return {
    queryKey: ["artist-payouts", userId, page, pageSize],
    queryFn: async () => execute(GetArtistPayoutsQuery, { where, order, skip, take }),
  };
}

// Detail by ID: Payment Transaction (artist)
export function artistTransactionByIdOptions(params: { id: string }) {
  const { id } = params;
  const where: PaymentTransactionFilterInput = {
    id: { eq: id },
  };
  const take = 1;
  const skip = 0;

  return {
    queryKey: ["artist-transaction", id],
    queryFn: async () => execute(GetArtistTransactionsQuery, { where, skip, take }),
  };
}

// Detail by ID: Payout Transaction (artist)
export function artistPayoutByIdOptions(params: { id: string }) {
  const { id } = params;
  const where: PayoutTransactionFilterInput = {
    id: { eq: id },
  };

  return {
    queryKey: ["artist-payout", id],
    queryFn: async () => execute(GetArtistPayoutsQuery, { where }),
  };
}

// Invoices list for artist by userId
export function artistInvoicesOptions(params: { userId: string; page: number; pageSize: number }) {
  const { userId, page, pageSize } = params;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: InvoiceFilterInput = {
    userId: { eq: userId },
  };
  const order: InvoiceSortInput[] = [{ paidAt: SortEnumType.Desc }];

  return {
    queryKey: ["artist-invoices", userId, page, pageSize],
    queryFn: async () => execute(GetArtistInvoicesQuery, { where, order, skip, take }),
  };
}

// Invoice detail by id for artist
export function artistInvoiceByIdOptions(params: { id: string }) {
  const { id } = params;
  const where: InvoiceFilterInput = { id: { eq: id } };
  const take = 1;
  const skip = 0;
  return {
    queryKey: ["artist-invoice", id],
    queryFn: async () => execute(GetArtistInvoicesQuery, { where, skip, take }),
  };
}

// Platform fee by payoutTransactionId
export function platformFeeByPayoutIdOptions(params: { payoutTransactionId: string }) {
  const { payoutTransactionId } = params;
  const where: PackageOrderFilterInput = {
    payoutTransactionId: { eq: payoutTransactionId },
  };
  
  return {
    queryKey: ["platform-fee", payoutTransactionId],
    queryFn: async () => execute(GetPlatformFeesQuery, { where }),
  };
}

// Track list stats by artist (createdBy)
export function artistTrackListStatsOptions(params: { artistId: string }) {
  const { artistId } = params;
  const where: TrackFilterInput = {
    createdBy: { eq: artistId },
  };
  const skip = 0;
  const take = 1000;
  
  return {
    queryKey: ["artist-track-stats", artistId],
    queryFn: async () => execute(TrackListStatsQuery, { where, skip, take }),
  };
}

// Track daily metrics by track IDs
export function artistTrackDailyMetricsOptions(params: { trackIds: string[] }) {
  const { trackIds } = params;
  const where: TrackDailyMetricFilterInput = {
    trackId: { in: trackIds },
  };
  const skip = 0;
  const take = 1000;
  
  return {
    queryKey: ["artist-track-metrics", trackIds],
    queryFn: async () => execute(TrackDailyMetricsQuery, { where, skip, take }),
    enabled: trackIds.length > 0,
  };
}
export function artistPackageByIdOptions(params: { artistPackageId: string }) {
  const { artistPackageId } = params;
  const where: ArtistPackageFilterInput = {
    id: { eq: artistPackageId },
  };
  
  return {
    queryKey: ["artist-package", artistPackageId],
    queryFn: async () => execute(GetArtistPackageByIdQuery, { where }),
  };
}