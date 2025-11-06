import type { ArtistFilterInput, TypedDocumentString, UserGender, UserStatus } from "@/gql/graphql";

export const GetArtistProfileQuery = `
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
        members { fullName email gender isLeader phoneNumber }
        isVerified
        createdAt
        user { status }
        identityCard {
          number
          fullName
          dateOfBirth
          gender
          placeOfOrigin
          validUntil
          placeOfResidence { addressLine }
        }
      }
    }
  }
` as unknown as TypedDocumentString<
  {
    artists?: {
      items?: Array<{
        id: string;
        userId: string;
        stageName: string;
        email: string;
        artistType: string;
        avatarImage?: string | null;
        bannerImage?: string | null;
        biography?: string | null;
        members: Array<{ fullName: string; email: string; gender: UserGender; isLeader: boolean; phoneNumber: string }>;
        isVerified: boolean;
        createdAt: string;
        user?: { status: UserStatus } | null;
        identityCard?: {
          number?: string | null;
          fullName?: string | null;
          dateOfBirth?: string | null;
          gender?: UserGender | null;
          placeOfOrigin?: string | null;
          validUntil?: string | null;
          placeOfResidence?: { addressLine?: string | null } | null;
        } | null;
      } | null> | null;
    } | null;
  },
  { where?: ArtistFilterInput; take?: number; skip?: number }
>;

export const UpdateArtistProfileMutation = `
  mutation UpdateArtistProfile($updateArtistRequest: UpdateArtistRequestInput!) {
    updateArtistProfile(updateArtistRequest: $updateArtistRequest)
  }
` as unknown as TypedDocumentString<
  { updateArtistProfile: boolean },
  { updateArtistRequest: { biography?: string | null; avatarImage?: string | null; bannerImage?: string | null } }
>;

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
      items?: Array<
        | {
            id: string;
            amount: number;
            currency: string;
            createdAt: Scalars['DateTime']['output'];
            paymentStatus: PaymentTransactionStatus;
            stripePaymentMethod: string[];
            stripePaymentId?: string | null;
          }
        | null
      > | null;
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
import type {
  PayoutTransactionFilterInput,
  PayoutTransactionSortInput,
  PayoutTransactionStatus,
} from "@/gql/graphql";

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
      items?: Array<
        | {
            id: string;
            amount: number;
            currency: string;
            createdAt: Scalars['DateTime']['output'];
            status: PayoutTransactionStatus;
            method?: string | null;
            description: string;
            destinationAccountId: string;
            stripePayoutId: string;
            stripeTransferId: string;
            royaltyReportId?: string | null;
            userId: string;
          }
        | null
      > | null;
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
import type {
  InvoiceFilterInput,
  InvoiceSortInput,
} from "@/gql/graphql";

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
      items?: Array<
        | {
            id: string;
            amount: number;
            currency: string;
            email: string;
            to: string;
            from: string;
            paidAt: string;
            paymentTransactionId: string;
          }
        | null
      > | null;
    } | null;
  },
  {
    where?: InvoiceFilterInput;
    order?: InvoiceSortInput[];
    skip?: number;
    take?: number;
  }
>;
