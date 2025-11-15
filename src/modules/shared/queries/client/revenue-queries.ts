import { graphql } from "@/gql";

// Payment Transactions list for a listener (by userId)
export const GetListenerTransactionsQuery = graphql(`
  query GetListenerTransactions(
    $userId: String!
    $where: PaymentTransactionFilterInput
    $order: [UserSortInput!]
    $skip: Int
    $take: Int
  ) {
    paymentTransactionsByUserId(userId: $userId, where: $where, order: $order, skip: $skip, take: $take) {
      totalCount
      items {
        id
        amount
        currency
        createdAt
        paymentStatus
        status
        stripePaymentMethod
        stripePaymentId
        stripeCheckoutSessionId
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

// Invoices list for a listener (by userId)
export const GetListenerInvoicesQuery = graphql(`
  query GetListenerInvoices($where: InvoiceFilterInput, $order: [InvoiceSortInput!], $skip: Int, $take: Int) {
    invoices(where: $where, order: $order, skip: $skip, take: $take) {
      totalCount
      items {
        id
        amount
        currency
        email
        to
        from
        paidAt
        paymentTransactionId
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);
