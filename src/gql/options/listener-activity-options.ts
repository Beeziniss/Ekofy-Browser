import { execute } from "@/gql/execute";
import {
  InvoiceFilterInput,
  InvoiceSortInput,
  PaymentTransactionFilterInput,
  PaymentTransactionSortInput,
  SortEnumType,
  TransactionStatus,
} from "@/gql/graphql";
import {
  GetListenerInvoicesQuery,
  GetListenerTransactionsQuery,
} from "@/modules/shared/queries/client/revenue-queries";

export function listenerTransactionsOptions(params: {
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
    queryKey: ["listener-transactions", userId, page, pageSize],
    queryFn: async () => execute(GetListenerTransactionsQuery, { where, order, skip, take }),
  };
}

// New function to check for open transactions
export function listenerOpenTransactionsOptions(params: { userId: string }) {
  const { userId } = params;
  const where: PaymentTransactionFilterInput = {
    userId: { eq: userId },
    status: { eq: TransactionStatus.Open },
  };
  const order: PaymentTransactionSortInput[] = [{ createdAt: SortEnumType.Desc }];
  const take = 1; // We only need to know if there's at least one
  const skip = 0;

  return {
    queryKey: ["listener-open-transactions", userId],
    queryFn: async () => execute(GetListenerTransactionsQuery, { where, order, skip, take }),
  };
}

export function listenerInvoicesOptions(params: { userId: string; page: number; pageSize: number }) {
  const { userId, page, pageSize } = params;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: InvoiceFilterInput = {
    userId: { eq: userId },
  };
  const order: InvoiceSortInput[] = [{ paidAt: SortEnumType.Desc }];

  return {
    queryKey: ["listener-invoices", userId, page, pageSize],
    queryFn: async () => execute(GetListenerInvoicesQuery, { where, order, skip, take }),
  };
}

// Detail by ID: Payment Transaction (listener)
export function listenerTransactionByIdOptions(params: { id: string }) {
  const { id } = params;
  const where: PaymentTransactionFilterInput = {
    or: [{ id: { eq: id } }],
  };

  const take = 1;
  const skip = 0;

  return {
    queryKey: ["listener-transaction", id],
    queryFn: async () => execute(GetListenerTransactionsQuery, { where, skip, take }),
  };
}

// Detail by ID: Invoice (listener)
export function listenerInvoiceByIdOptions(params: { id: string }) {
  const { id } = params;
  const where: InvoiceFilterInput = {
    id: { eq: id },
  };
  const take = 1;
  const skip = 0;

  return {
    queryKey: ["listener-invoice", id],
    queryFn: async () => execute(GetListenerInvoicesQuery, { where, skip, take }),
  };
}
