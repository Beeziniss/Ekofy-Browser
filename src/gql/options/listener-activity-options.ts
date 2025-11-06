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
