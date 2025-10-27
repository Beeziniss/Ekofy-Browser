import type {
  ListenerFilterInput,
  TypedDocumentString,
  Scalars,
  UserGender,
  UserSubscriptionFilterInput,
  SubscriptionTier,
  SubscriptionStatus,
  UpdateListenerRequestInput,
  PaymentTransactionFilterInput,
  PaymentTransactionSortInput,
  InvoiceFilterInput,
  InvoiceSortInput,
  PaymentTransactionStatus,
} from "@/gql/graphql";

// Raw typed query string to avoid relying on codegen's graphql() union at dev-time.
export const GetListenerProfileQuery = `
  query GetListenerProfile($where: ListenerFilterInput, $take: Int, $skip: Int) {
    listeners(where: $where, take: $take, skip: $skip) {
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
` as unknown as TypedDocumentString<
  {
    listeners?: {
      items?: Array<
        | {
            id: string;
            userId: string;
            displayName: string;
            email: string;
            avatarImage?: string | null;
            bannerImage?: string | null;
            createdAt: Scalars['DateTime']['output'];
            followerCount: number;
            followingCount: number;
            isVerified: boolean;
            user?: { birthDate: Scalars['DateTime']['output']; gender: UserGender } | null;
          }
        | null
      > | null;
    } | null;
  },
  { where?: ListenerFilterInput; take?: number; skip?: number }
>;

// Active subscription for a user to derive membership status
export const GetUserActiveSubscriptionQuery = `
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
` as unknown as TypedDocumentString<
  {
    userSubscriptions?: {
      items?: Array<
        | {
            id: string;
            isActive: boolean;
            subscription?: {
              tier: SubscriptionTier;
              status: SubscriptionStatus;
              name: string;
            } | null;
          }
        | null
      > | null;
    } | null;
  },
  { where?: UserSubscriptionFilterInput; take?: number; skip?: number }
>;

// Mutation: Update profile (listener-only usage here). Schema requires both args.
export const UpdateListenerProfileMutation = `
  mutation UpdateListenerProfile($updateListenerRequest: UpdateListenerRequestInput!) {
    updateListenerProfile(updateListenerRequest: $updateListenerRequest)
  }
` as unknown as TypedDocumentString<
  { updateListenerProfile: boolean },
  { updateListenerRequest: UpdateListenerRequestInput }
>;

// Payment Transactions list for a listener (by userId)
export const GetListenerTransactionsQuery = `
  query GetListenerTransactions($where: PaymentTransactionFilterInput, $order: [PaymentTransactionSortInput!], $skip: Int, $take: Int) {
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

// Invoices list for a listener (by userId)
export const GetListenerInvoicesQuery = `
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
      pageInfo { hasNextPage hasPreviousPage }
    }
  }
` as unknown as TypedDocumentString<
  {
    invoices?: {
      totalCount: number;
      items?: Array<
        | {
            id: string;
            amount: number;
            currency: string;
            email: string;
            to: string;
            from: string;
            paidAt: Scalars['DateTime']['output'];
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
