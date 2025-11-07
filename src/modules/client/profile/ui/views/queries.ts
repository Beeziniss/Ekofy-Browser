import { graphql } from "@/gql";

export const GetListenerProfileQuery = graphql(`
  query GetListenerProfile($where: ListenerFilterInput) {
    listeners(where: $where, take: 1) {
      items {
        id
        userId
        displayName
        email
        avatarImage
        bannerImage
        createdAt
        followerCount
        followingCount
        isVerified
        user {
          birthDate
          gender
        }
      }
    }
  }
`);

// Active subscription for a user to derive membership status
export const GetUserActiveSubscriptionQuery = graphql(`
  query GetUserActiveSubscription($where: UserSubscriptionFilterInput, $take: Int, $skip: Int) {
    userSubscriptions(where: $where, take: $take, skip: $skip) {
      items {
        id
        isActive
        subscription {
          tier
          status
          name
        }
      }
    }
  }
`);

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
