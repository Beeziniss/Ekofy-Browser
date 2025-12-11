import { execute } from "@/gql/execute";
import {
  RefundTransactionFilterInput,
  RefundTransactionSortInput,
  SortEnumType,
} from "@/gql/graphql";
import { GetListenerRefundTransactionsQuery } from "@/modules/shared/queries/client/refund-queries";

export function listenerRefundTransactionsOptions(params: {
  userId: string;
  page: number;
  pageSize: number;
}) {
  const { userId, page, pageSize } = params;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: RefundTransactionFilterInput = {};
  const order: RefundTransactionSortInput[] = [{ createdAt: SortEnumType.Desc }];

  return {
    queryKey: ["listener-refund-transactions", userId, page, pageSize],
    queryFn: async () => execute(GetListenerRefundTransactionsQuery, { where, order, skip, take, userId }),
  };
}

// Detail by ID: Refund Transaction (listener)
export function listenerRefundTransactionByIdOptions(params: { id: string }) {
  const { id } = params;
  const where: RefundTransactionFilterInput = {
    id: { eq: id },
  };

  const take = 1;
  const skip = 0;

  return {
    queryKey: ["listener-refund-transaction", id],
    queryFn: async () => execute(GetListenerRefundTransactionsQuery, { where, skip, take }),
  };
}
