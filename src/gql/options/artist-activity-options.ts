import { execute } from "@/gql/execute";
import {
  PaymentTransactionFilterInput,
  PaymentTransactionSortInput,
  PayoutTransactionFilterInput,
  PayoutTransactionSortInput,
  SortEnumType,
  InvoiceFilterInput,
  InvoiceSortInput,
} from "@/gql/graphql";
import {
  GetArtistInvoicesQuery,
  GetArtistPayoutsQuery,
  GetArtistTransactionsQuery,
} from "@/modules/shared/queries/artist/revenue-queries";

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
    queryFn: async () => execute(GetArtistTransactionsQuery, { userId, where, order, skip, take }),
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
export function artistTransactionByIdOptions(params: { id: string; userId: string }) {
  const { id, userId } = params;
  const where: PaymentTransactionFilterInput = {
    or: [{ id: { eq: id } }],
  };
  const take = 1;
  const skip = 0;

  return {
    queryKey: ["artist-transaction", id],
    queryFn: async () => execute(GetArtistTransactionsQuery, { userId, where, skip, take }),
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
