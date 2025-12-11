import { graphql } from "@/gql";

// Refund Transactions list for a listener (by userId)
export const GetListenerRefundTransactionsQuery = graphql(`
  query GetListenerRefundTransactions(
    $where: RefundTransactionFilterInput
    $order: [RefundTransactionSortInput!]
    $skip: Int
    $take: Int
    $userId: String
  ) {
    refundTransactions(where: $where, order: $order, skip: $skip, take: $take, userId: $userId) {
      totalCount
      items {
        id
        amount
        currency
        createdAt
        status
        reason
        stripePaymentId
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);
