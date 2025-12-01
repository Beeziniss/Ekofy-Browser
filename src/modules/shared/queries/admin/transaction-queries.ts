import { graphql } from "@/gql";

/**
 * Query to get all payment transactions in the system (Admin only)
 * No userId filter - returns all transactions from all users
 */
export const GetAllTransactionsQuery = graphql(`
  query GetAllTransactions(
    $where: PaymentTransactionFilterInput
    $order: [PaymentTransactionSortInput!]
    $skip: Int
    $take: Int
  ) {
    paymentTransactions(where: $where, order: $order, skip: $skip, take: $take) {
      totalCount
      items {
        id
        amount
        currency
        createdAt
        updatedAt
        paymentStatus
        status
        stripePaymentMethod
        stripePaymentId
        stripeCheckoutSessionId
        stripeInvoiceId
        stripeSubscriptionId
        userId
        user {
          id
          email
          fullName
          role
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

/**
 * Query to search payment transactions by user name or email (Admin only)
 */
export const SearchTransactionsQuery = graphql(`
  query SearchTransactions(
    $order: [PaymentTransactionSortInput!]
    $searchTerm: String
    $skip: Int
    $take: Int
    $where: PaymentTransactionFilterInput
  ) {
    searchPaymentTransactions(
      order: $order
      searchTerm: $searchTerm
      skip: $skip
      take: $take
      where: $where
    ) {
      totalCount
      items {
        id
        amount
        currency
        createdAt
        updatedAt
        paymentStatus
        status
        stripePaymentMethod
        stripePaymentId
        stripeCheckoutSessionId
        stripeInvoiceId
        stripeSubscriptionId
        userId
        user {
          id
          email
          fullName
          role
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

