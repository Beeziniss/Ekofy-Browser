import { graphql } from "@/gql";

// Payment Transactions list for a listener (by userId)
export const GetListenerTransactionsQuery = graphql(`
  query GetListenerTransactions(
    $where: PaymentTransactionFilterInput
    $order: [PaymentTransactionSortInput!]
    $skip: Int
    $take: Int
  ) {
    transactions(where: $where, order: $order, skip: $skip, take: $take) {
      totalCount
      items {
        id
        amount
        currency
        createdAt
        paymentStatus
        stripePaymentMethod
        stripePaymentId
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
