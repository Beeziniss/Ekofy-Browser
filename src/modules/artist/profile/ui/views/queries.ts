import { graphql } from "@/gql";

export const GetArtistProfileQuery = graphql(`
  query GetArtistProfile($where: ArtistFilterInput, $take: Int, $skip: Int) {
    artists(where: $where, take: $take, skip: $skip) {
      items {
        id
        userId
        stageName
        email
        artistType
        avatarImage
        bannerImage
        biography
        members {
          fullName
          email
          gender
          isLeader
          phoneNumber
        }
        isVerified
        createdAt
        user {
          status
        }
        identityCard {
          number
          fullName
          dateOfBirth
          gender
          placeOfOrigin
          validUntil
          placeOfResidence {
            addressLine
          }
        }
      }
    }
  }
`);

// Payment Transactions list for an artist (by userId)
// Note: Artist uses the same PaymentTransaction entity as listener.
import type {
  PaymentTransactionFilterInput,
  PaymentTransactionSortInput,
  PaymentTransactionStatus,
  Scalars,
} from "@/gql/graphql";

export const GetArtistTransactionsQuery = `
  query GetArtistTransactions($where: PaymentTransactionFilterInput, $order: [PaymentTransactionSortInput!], $skip: Int, $take: Int) {
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
      pageInfo { hasNextPage hasPreviousPage }
    }
  }
` as unknown as TypedDocumentString<
  {
    transactions?: {
      totalCount: number;
      pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
      items?: Array<{
        id: string;
        amount: number;
        currency: string;
        createdAt: Scalars["DateTime"]["output"];
        paymentStatus: PaymentTransactionStatus;
        stripePaymentMethod: string[];
        stripePaymentId?: string | null;
      } | null> | null;
    } | null;
  },
  {
    where?: PaymentTransactionFilterInput;
    order?: PaymentTransactionSortInput[];
    skip?: number;
    take?: number;
  }
>;

// Payout Transactions list for an artist (by userId)
import type { PayoutTransactionFilterInput, PayoutTransactionSortInput, PayoutTransactionStatus } from "@/gql/graphql";

export const GetArtistPayoutsQuery = `
  query GetArtistPayouts($where: PayoutTransactionFilterInput, $order: [PayoutTransactionSortInput!], $skip: Int, $take: Int) {
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
      pageInfo { hasNextPage hasPreviousPage }
    }
  }
` as unknown as TypedDocumentString<
  {
    payoutTransactions?: {
      totalCount: number;
      pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
      items?: Array<{
        id: string;
        amount: number;
        currency: string;
        createdAt: Scalars["DateTime"]["output"];
        status: PayoutTransactionStatus;
        method?: string | null;
        description: string;
        destinationAccountId: string;
        stripePayoutId: string;
        stripeTransferId: string;
        royaltyReportId?: string | null;
        userId: string;
      } | null> | null;
    } | null;
  },
  {
    where?: PayoutTransactionFilterInput;
    order?: PayoutTransactionSortInput[];
    skip?: number;
    take?: number;
  }
>;

// Invoices list for an artist (by userId) – same shape as listener
import type { InvoiceFilterInput, InvoiceSortInput } from "@/gql/graphql";

export const GetArtistInvoicesQuery = `
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
      pageInfo { hasNextPage hasPreviousPage }
    }
  }
` as unknown as TypedDocumentString<
  {
    invoices?: {
      totalCount: number;
      pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
      items?: Array<{
        id: string;
        amount: number;
        currency: string;
        email: string;
        to: string;
        from: string;
        paidAt: string;
        paymentTransactionId: string;
      } | null> | null;
    } | null;
  },
  {
    where?: InvoiceFilterInput;
    order?: InvoiceSortInput[];
    skip?: number;
    take?: number;
  }
>;
