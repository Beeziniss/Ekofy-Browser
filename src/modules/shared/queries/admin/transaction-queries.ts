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

export const GetAllPayoutTransactionsQuery = graphql(`
  query GetAllPayoutTransactions(
    $where: PayoutTransactionFilterInput
    $order: [PayoutTransactionSortInput!]
    $skip: Int
    $take: Int
  ) {
    payoutTransactions(where: $where, order: $order, skip: $skip, take: $take) {
      totalCount
      items {
            id
            userId
            royaltyReportId
            stripeTransferId
            stripePayoutId
            destinationAccountId
            amount
            currency
            level
            description
            status
            method
            createdAt
            updatedAt
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

export const SearchPayoutTransactionsQuery = graphql(`
  query SearchPayoutTransactions(
    $order: [PayoutTransactionSortInput!]
    $searchTerm: String
    $skip: Int
    $take: Int
    $where: PayoutTransactionFilterInput
  ) {
    searchPayoutTransactions(
      order: $order
      searchTerm: $searchTerm
      skip: $skip
      take: $take
      where: $where
    ) {
      totalCount
      items {
        id
        userId
        royaltyReportId
        stripeTransferId
        stripePayoutId
        destinationAccountId
        amount
        currency
        level
        description
        status
        method
        createdAt
        updatedAt
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

export const GetAllRefundTransactionsQuery = graphql(`
  query GetAllRefundTransactions(
    $where: RefundTransactionFilterInput
    $order: [RefundTransactionSortInput!]
    $skip: Int
    $take: Int
  ) {
    refundTransactions(where: $where, order: $order, skip: $skip, take: $take) {
      totalCount
      items {
            id
            stripePaymentId
            amount
            currency
            reason
            status
            createdAt
            updatedAt
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

export const SearchRefundTransactionsQuery = graphql(`
  query SearchRefundTransactions(
    $order: [RefundTransactionSortInput!]
    $searchTerm: String
    $skip: Int
    $take: Int
    $where: RefundTransactionFilterInput
  ) {
    searchRefundTransactions(
      order: $order
      searchTerm: $searchTerm
      skip: $skip
      take: $take
      where: $where
    ) {
      totalCount
      items {
        id
        stripePaymentId
        amount
        currency
        reason
        status
        createdAt
        updatedAt
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
`)