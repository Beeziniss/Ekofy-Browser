import { graphql } from "@/gql";

export const GetArtistTransactionsQuery = graphql(`
  query GetArtistTransactions(
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

export const GetArtistPayoutsQuery = graphql(`
  query GetArtistPayouts(
    $where: PayoutTransactionFilterInput
    $order: [PayoutTransactionSortInput!]
    $skip: Int
    $take: Int
  ) {
    payoutTransactions(where: $where, order: $order, skip: $skip, take: $take) {
      totalCount
      items {
        id
        amount
        currency
        createdAt
        status
        method
        description
        destinationAccountId
        stripePayoutId
        stripeTransferId
        royaltyReportId
        userId
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

export const GetArtistInvoicesQuery = graphql(`
  query GetArtistInvoices($where: InvoiceFilterInput, $order: [InvoiceSortInput!], $skip: Int, $take: Int) {
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

export const GetPlatformFeesQuery = graphql(`
  query PackageOrdersPlatform ($where: PackageOrderFilterInput) {
    packageOrders(where: $where) {
      items {
        id
        platformFeePercentage
        payoutTransactionId
        status
        startedAt
        completedAt
        artistPackageId
      }
    }
  }
`);
export const GetArtistPackageByIdQuery = graphql(`
  query GetArtistPackageById($where: ArtistPackageFilterInput) {
    artistPackages(where: $where) {
      items {
        id
        amount
        currency
        packageName
      }
    }
  }
`);
export const ArtistRevenueQuery = graphql(`
  query ArtistRevenueData($artistId: String!) {
    artists(where: { id: { eq: $artistId } }) {
      items {
        id
        stageName
        avatarImage
        email
        followerCount
        popularity
        grossRevenue
        netRevenue
        royaltyEarnings
        serviceRevenue
        serviceEarnings
      }
    }
  }
`)