import { execute } from "@/gql/execute";
import {
  InvoiceFilterInput,
  InvoiceSortInput,
  PaymentTransactionFilterInput,
  PaymentTransactionSortInput,
  SortEnumType,
} from "@/gql/graphql";
import { GetListenerInvoicesQuery, GetListenerTransactionsQuery } from "@/modules/client/profile/ui/views/queries";

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
  // Support both internal id and stripePaymentId lookups
  const where: PaymentTransactionFilterInput = {
    or: [
      { id: { eq: id } },
      { stripePaymentId: { eq: id } },
    ],
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
